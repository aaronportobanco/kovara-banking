---
applyTo: "**"
---

Add Dwolla to your app 
=======================

#### Use Dwolla with Plaid Auth to send and receive payments 

(An image of "Plaid and Dwolla logos, side by side.")

  

Plaid and Dwolla have partnered to offer businesses an easier way to connect to the U.S. banking system. Plaid enables businesses to instantly authenticate a customer's bank account, giving them the ability to leverage the Dwolla API to connect to the ACH or RTP® networks for sending and receiving payments. Dwolla’s solution offers frictionless ACH or real-time payments payments for companies looking to automate their current payments process and scale their business.

With the Plaid + Dwolla integration, your users can verify their accounts in seconds by inputting their banking credentials in Plaid’s front-end module. Plaid’s mobile-friendly module handles input validation, error handling, and multi-factor authentication–providing a seamless onboarding experience to convert more users for your business.

As part of the integration, Dwolla customers can access Plaid’s full suite of APIs for clean, categorized transaction data, real-time balances, and more.

#### Getting started 

You'll first want to familiarize yourself with [Plaid Link](https://plaid.com/docs/link/index.html.md) , a drop-in client-side integration for the Plaid API that handles input validation, error handling, and multi-factor authentication.

Your customers will use Link to authenticate with their financial institution and select the depository account they wish to use for ACH or RTP® transactions. From there, you'll receive a Plaid `access_token`, allowing you to leverage real-time balance checks and transaction data, and a Dwolla `processor_token`, which allows you to quickly and securely verify a bank funding source via [Dwolla's API](https://www.dwolla.com/?utm_campaign=Plaid-Documentation&utm_source=Plaid&utm_medium=Referral) without having to store any sensitive banking information. Utilizing Plaid + Dwolla enables a seamless workflow for sending and receiving payments.

#### Instructions 

##### Set up your Plaid and Dwolla accounts 

You'll need accounts at both Plaid and Dwolla in order to use the Plaid + Dwolla integration. You'll also need to be a Dwolla customer in order to add a bank funding source.

First, [sign up for a Dwolla account](https://accounts.dwolla.com/sign-up/pay-as-you-go?utm_campaign=Plaid-Documentation&utm_source=Plaid&utm_medium=Referral) if you don't already have one.

Next, verify that your Plaid account is enabled for the integration. If you do not have a Plaid account, [create one](https://dashboard.plaid.com/signup/dwolla) . Your account will be automatically enabled for integration access.

To verify that your Plaid account is enabled for the integration, go to the [Integrations](https://dashboard.plaid.com/developers/integrations) section of the account dashboard. If the integration is off, simply click the 'Enable' button for Dwolla to enable the integration.

Use the [Dwolla Sandbox](https://developers.dwolla.com/guides/sandbox-setup/) to test the Plaid + Dwolla integration for free.

##### Complete your Plaid application profile and company profile 

After connecting your Plaid and Dwolla accounts, you'll need to complete your Plaid [application profile](https://dashboard.plaid.com/settings/company/app-branding) and [company profile](https://dashboard.plaid.com/settings/company/profile) in the Dashboard, which involves filling out basic information about your app, such as your company name and website. This step helps your end-users learn more how your product uses their bank information and is also required for connecting to some banks.

##### Create a link\_token 

In order to integrate with Plaid Link, you will first need to create a `link_token`. A `link_token` is a short-lived, one-time use token that is used to authenticate your app with Link. To create one, make a [/link/token/create](https://plaid.com/docs/api/link/index.html.md#linktokencreate) request with your `client_id`, `secret`, and a few other required parameters from your app server. View the [/link/token/create](https://plaid.com/docs/api/link/index.html.md#linktokencreate) documentation for a full list of `link_token` configurations.

To see your `client_id` and `secret`, visit the [Plaid Dashboard](https://dashboard.plaid.com/developers/keys) .

```javascript
app.post('/api/create_link_token', async function (request, response) {
  // Get the client_user_id by searching for the current user
  const user = await User.find(...);
  const clientUserId = user.id;
  const request = {
    user: {
      // This should correspond to a unique id for the current user.
      client_user_id: clientUserId,
    },
    client_name: 'Plaid Test App',
    products: ['auth'],
    language: 'en',
    webhook: 'https://webhook.example.com',
    redirect_uri: 'https://domainname.com/oauth-page.html',
    country_codes: ['US'],
  };
  try {
    const createTokenResponse = await client.linkTokenCreate(request);
    response.json(createTokenResponse.data);
  } catch (error) {
    // handle error
  }
});
```

##### Integrate with Plaid Link 

Once you have a `link_token`, all it takes is a few lines of client-side JavaScript to launch Link. Then, in the `onSuccess` callback, you can call a simple server-side handler to exchange the Link `public_token` for a Plaid `access_token` and a Dwolla `processor_token`.

```javascript
Open Link - Institution Select


  (async function(){
    var linkHandler = Plaid.create({
      // Make a request to your server to fetch a new link_token.
      token: (await $.post('/create_link_token')).link_token,
      onLoad: function() {
          // The Link module finished loading.
      },
      onSuccess: function(public_token, metadata) {
        // The onSuccess function is called when the user has
        // successfully authenticated and selected an account to
        // use.
        //
        // When called, you will send the public_token and the selected accounts,
        // metadata.accounts, to your backend app server.


        sendDataToBackendServer({
           public_token: public_token,
           accounts: metadata.accounts
        });
      },
        console.log('Public Token: ' + public_token);
        console.log('Customer-selected account ID: ' + metadata.account_id);
      },
      onExit: function(err, metadata) {
        // The user exited the Link flow.
        if (err != null) {
            // The user encountered a Plaid API error
            // prior to exiting.
        }
        // metadata contains information about the institution
        // that the user selected and the most recent
        // API request IDs.
        // Storing this information can be helpful for support.
      },
    });
  })();


  // Trigger the authentication view
  document.getElementById('linkButton').onclick = function() {
    linkHandler.open();
  };

```

See the [Link parameter reference](https://plaid.com/docs/link/web/index.html.md#create) for complete documentation on possible configurations.

`Plaid.create` accepts one argument, a configuration `Object`, and returns an `Object` with three functions, [open](https://plaid.com/docs/link/web/index.html.md#open) , [exit](https://plaid.com/docs/link/web/index.html.md#exit) , and [destroy](https://plaid.com/docs/link/web/index.html.md#destroy) . Calling `open` will display the "Institution Select" view, calling `exit` will close Link, and calling `destroy` will clean up the iframe.

##### Write server-side handler 

The Link module handles the entire onboarding flow securely and quickly, but does not actually retrieve account data for a user. Instead, the Link module returns a `public_token` and an `accounts` array, which is a property on the `metadata` object, via the `onSuccess` callback. Exchange this `public_token` for a Plaid `access_token` using the [/item/public\_token/exchange](https://plaid.com/docs/api/items/index.html.md#itempublic_tokenexchange) API endpoint.

The `accounts` array will contain information about bank accounts associated with the credentials entered by the user, and may contain multiple accounts if the user has more than one bank account at the institution. In order to avoid any confusion about which account your user wishes to use with Dwolla, it is recommended to set [Account Select](https://dashboard.plaid.com/link/account-select) to "enabled for one account" in the Plaid Dashboard. When this setting is selected, the `accounts` array will always contain exactly one account.

Once you have identified the account you will use, you will send the `account_id` property of the account to Plaid, along with the `access_token`, to create a Dwolla `processor_token`. You'll send this token to Dwolla and they will use it to securely retrieve account and routing numbers from Plaid.

Select group for content switcher

Current librariesLegacy libraries

```javascript
const {
  Configuration,
  PlaidApi,
  PlaidEnvironments,
  ProcessorTokenCreateRequest,
} = require('plaid');
// Change sandbox to production when you're ready to go live!
const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
      'Plaid-Version': '2020-09-14',
    },
  },
});


const plaidClient = new PlaidApi(configuration);


try {
  // Exchange the public_token from Plaid Link for an access token.
  const tokenResponse = await plaidClient.itemPublicTokenExchange({
    public_token: publicToken,
  });
  const accessToken = tokenResponse.access_token;


  // Create a processor token for a specific account id.
  const request: ProcessorTokenCreateRequest = {
    access_token: accessToken,
    account_id: accountID,
    processor: 'dwolla',
  };
  const processorTokenResponse = await plaidClient.processorTokenCreate(
    request,
  );
  const processorToken = processorTokenResponse.processor_token;
} catch (error) {
  // handle error
}
```

For a valid request, the API will return a JSON response similar to:

```json
{
  "processor_token": "processor-sandbox-0asd1-a92nc",
  "request_id": "[Unique request ID]"
}
```

##### Make a request to Dwolla 

Once you've obtained the `processor_token`, you'll then pass it to Dwolla as the value of the `plaidToken` request parameter, along with a funding source `name`, to create a funding source for a Dwolla Customer:

```bash
POST https://api-sandbox.dwolla.com/customers/AB443D36-3757-44C1-A1B4-29727FB3111C/funding-sources
Content-Type: application/vnd.dwolla.v1.hal+json
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY


{
  "plaidToken": "processor-sandbox-161c86dd-d470-47e9-a741-d381c2b2cb6f",
  "name": "Jane Doe’s Checking"
}


...


HTTP/1.1 201 Created
Location: https://api-sandbox.dwolla.com/funding-sources/375c6781-2a17-476c-84f7-db7d2f6ffb31
```

Once you’ve received a successful response from the Dwolla API, you’ll use the unique funding source URL to identify the Customer’s bank when [initiating ACH](https://docs.dwolla.com/#initiate-a-transfer?utm_campaign=Plaid-Documentation&utm_source=Plaid&utm_medium=Referral) or [RTP transfers](https://developers.dwolla.com/concepts/real-time-payments#real-time-payments?utm_campaign=Plaid-Documentation&utm_source=Landing-Page&utm_medium=Referral) .

##### Testing your Dwolla integration 

You can create Dwolla `processor_tokens` in Sandbox (sandbox.plaid.com, allows testing with simulated users) or Production (production.plaid.com, requires Dwolla Production credentials).

To test the integration in Sandbox mode, simply use the Plaid [Sandbox credentials](https://plaid.com/docs/sandbox/test-credentials/index.html.md) when launching Link with a `link_token` created in the Sandbox environment.

When testing in the Sandbox, you have the option to use the [/sandbox/public\_token/create](https://plaid.com/docs/api/sandbox/index.html.md#sandboxpublic_tokencreate) endpoint instead of the end-to-end Link flow to create a `public_token`. When using the [/sandbox/public\_token/create](https://plaid.com/docs/api/sandbox/index.html.md#sandboxpublic_tokencreate) \-based flow, the Account Select flow will be bypassed and the `accounts` array will not be populated. On Sandbox, instead of using the `accounts` array, you can call [/accounts/get](https://plaid.com/docs/api/accounts/index.html.md#accountsget) and test with any returned account ID associated with an account with the subtype `checking` or `savings`.

##### Get ready for production 

Your account is immediately enabled for our Sandbox environment ([https://sandbox.plaid.com](https://sandbox.plaid.com) ). To move to Production, please request access from the [Dashboard](https://dashboard.plaid.com/developers/keys) .

#### Example code in Plaid Pattern 

For a real-life example of an app that incorporates the creation of processor tokens, see the Node-based [Plaid Pattern Account Funding](https://github.com/plaid/pattern-account-funding) sample app. Pattern Account Funding is a sample account funding app that creates a processor token to send to your payment partner. The processor token creation code can be found in [items.js](https://github.com/plaid/pattern-account-funding/blob/master/server/routes/items.js#L126-L135) .

For a tutorial walkthrough of creating a similar app with Dwolla support, see [Account funding tutorial](https://github.com/plaid/account-funding-tutorial) .

#### Support and questions 

Find answers to many common integration questions and concerns—such as pricing, sandbox and test mode usage, and more, in our [docs](https://plaid.com/docs/index.html.md) .

If you're still stuck, open a [support ticket](https://dashboard.plaid.com/support/new) with information describing the issue that you're experiencing and we'll get back to you as soon as we can.