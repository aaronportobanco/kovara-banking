---
applyTo: "**"
---

# Authentication

> Requests to the Dwolla API require an OAuth access token for authentication. Learn about Dwolla's supported authorization flow and how to create an access token.

## Overview

Dwolla utilizes the [OAuth 2 protocol](https://oauth.net/2/) to facilitate authorization. OAuth is an authorization framework that enables a third-party application to obtain access to protected resources (Transfers, Funding Sources, etc.) in the Dwolla API. The following guide will walk through Dwolla's implementation of OAuth and how it will be leveraged by your application.

## Creating an application

Before you can get started with making OAuth requests, you'll need to first register an application with Dwolla by logging in and navigating to the applications page in the Dashboard. Once an application is registered you will obtain your `client_id` and `client_secret` (aka client credentials), which will be used to identify your application when calling the Dwolla API. The <Tooltip tip="The Dwolla Sandbox environment is a complete replica of the production environment, used for testing and development.">Sandbox</Tooltip> environment provides you with a created application once you have signed up for an account. Learn more in our [Sandbox guide](dwolla_testing_sandbox.instructions.md).

<Warning>
  Your <code>client\_secret</code> should be kept a secret! Be sure to store your
  client credentials securely.
</Warning>

## Dwolla's authorization flow

The OAuth 2 protocol defines four main authorization grant types, more commonly referred to as OAuth flows. Dwolla implements one of these flows that third party applications will utilize to obtain authorization.

**Application authorization:** Using the client credentials grant flow, your application will obtain authorization to interact with the API on its own behalf. This is a server-to-server flow with interaction between an application and the Dwolla API; also known as 2-legged OAuth.

## Create an Access Token

The [client credentials flow](https://tools.ietf.org/html/rfc6749#section-4.1) is used when an application needs to obtain permission to act on its own behalf. An application will exchange it's `client_id`, `client_secret`, and `grant_type=client_credentials` for an [application access token](/docs/api-reference/tokens/create-an-application-access-token). An application access token can then be used to make calls to the Dwolla API on behalf of the application, for example, when you create a webhook subscriptiint.on, retrieve events, and interact with a [Customer](/docs/api-reference/customers) related endpoint.

### Request application authorization

The client credentials flow is the simplest OAuth 2 grant, with a server-to-server exchange of your application's `client_id` and `client_secret` for an OAuth application access token. In order to execute this flow, your application will send a POST request with the Authorization header that contains the word `Basic` followed by a space and a base64-encoded string `client_id:client_secret`.

##### Example:

`Authorization: Basic Base64(client_id:client_secret)`

##### HTTP request

> `POST https://api.dwolla.com/token`

Including the `Content-Type: application/x-www-form-urlencoded` header, the request is sent to the token endpoint with `grant_type=client_credentials` in the body of the request:

##### Request parameters

| Parameter     | Required | Type   | Description                                                                                                                                                                             |
| ------------- | -------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| client_id     | yes      | string | Application key. Navigate to `https://www.dwolla.com/applications` (production) or `https://dashboard-sandbox.dwolla.com/applications-legacy` (Sandbox) for your application key        |
| client_secret | yes      | string | Application secret. Navigate to `https://www.dwolla.com/applications` (production) or `https://dashboard-sandbox.dwolla.com/applications-legacy` (Sandbox) for your application secret. |
| grant_type    | yes      | string | This must be set to `client_credentials`.                                                                                                                                               |

### Example request

<CodeGroup>
  ```bash request.sh
  POST https://api-sandbox.dwolla.com/token
  Authorization: Basic YkVEMGJMaEFhb0pDamplbmFPVjNwMDZSeE9Eb2pyOUNFUzN1dldXcXUyeE9RYk9GeUE6WEZ0bmJIbXR3dXEwNVI1Yk91WmVOWHlqcW9RelNSc21zUU5qelFOZUFZUlRIbmhHRGw=
  Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials

````

```python auth.py
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
# This example assumes you've already intialized the client. Reference the SDKs page for more information: https://developers.dwolla.com/sdks-tools
application_token = client.Auth.client()
````

```javascript auth.js
// Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-node
// This example assumes you've already intialized the client. Reference the SDKs page for more information: https://developers.dwolla.com/sdks-tools
var Client = require("dwolla-v2").Client;
var appToken = new Client({
  key: process.env.DWOLLA_APP_KEY,
  secret: process.env.DWOLLA_APP_SECRET,
  environment: "sandbox", // defaults to 'production'
});
```

```ruby auth.rb
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
# This example assumes you've already intialized the client. Reference the SDKs page for more information: https://developers.dwolla.com/sdks-tools
application_token = $dwolla.auths.client
# => #<DwollaV2::Token client=#<DwollaV2::Client id="..." secret="..." environment=:sandbox> access_token="..." expires_in=3600 scope="...">
```

```php auth.php
<?php
// Using dwollaswagger - https://github.com/Dwolla/dwolla-swagger-php
// This example assumes you've already intialized the client. Reference the SDKs page for more information: https://developers.dwolla.com/sdks-tools
$tokensApi = new DwollaSwagger\TokensApi($apiClient);
$appToken = $tokensApi->token();
?>
```

</CodeGroup>

### Refreshing an application access token

A refresh token is not paired with an application access token, therefore in order to refresh authorization you'll simply request a new application access token by exchanging your client credentials (as shown above).

## Using an access token

Once your application obtains an access token, it can be used to access protected resources in the Dwolla API. If using an account access token, access to protected resources is limited to the scopes contained on an access token, and whether or not the token is valid (expired or revoked token).

Here is an example of an API request. Note that OAuth access tokens are passed via the Authorization HTTP header:
`Authorization: Bearer {access_token_here}`

```bash
POST https://api.dwolla.com/webhook-subscriptions
Content-Type: application/json
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer myApplicationAccessToken

{
    "url": "https://myapplication.com/webhooks",
    "secret": "sshhhhhh"
}

... or ...

GET https://api.dwolla.com/accounts/a84222d5-31d2-4290-9a96-089813ef96b3/transfers
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer myApplicationAccesstoken
```

Assuming the access token is valid, the Dwolla API will return a success or error response. If the access token is expired or invalid, the API will return an HTTP 401 with either a `InvalidAccessToken` or `ExpiredAccessToken` error code. Learn more about making requests in our [API docs](/docs/api-reference/api-fundamentals/making-requests-and-authentication).
