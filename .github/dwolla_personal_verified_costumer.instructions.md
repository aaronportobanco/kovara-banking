---
applyTo: "**"
---

# Personal Verified Customer

> Learn how to create a Verified personal Customer that can send and receive funds.

## Overview

This guide will walk through the identity verification process for [personal verified Customers](dwolla_customer_types.instructions.md) within the Dwolla API.

A `personal` verified Customer represents an individual that intends to send or receive funds on your platform. In any transaction, at least one party—either the sender or the receiver—must complete the [identity verification](https://www.dwolla.com/updates/guide-to-cip-customer-identification-program-dwolla-payments-api/) process as outlined in this guide.

## Create a personal verified Customer

To create a personal verified Customer, use the [create a Customer](dwolla_create_costumer.instructions.md) endpoint. A personal verified Customer is determined by setting the value of the `type` request parameter to `personal` and including additional fields required for identifying the individual.

##### Events

As a developer, you can expect these events to be triggered when a personal verified Customer is successfully created and systematically verified:

1. `customer_created`
2. `customer_verified`

### Request parameters - personal verified Customer

<Expandable title="Parameter details" defaultOpen="true">
  <ParamField body="firstName" type="string" required>
    An individual Customer's first name. Must be ≤ 50 characters and contain no special characters ``<[<>="`!?%~${}\]>``.
  </ParamField>

  <ParamField body="lastName" type="string" required>
    An individual Customer's last name. Must be ≤ 50 characters and contain no special characters ``<[<>="`!?%~${}\]>``.
  </ParamField>

  <ParamField body="email" type="string" required>
    Customer's email address. Must be a valid email format (e.g., [example@domain.com](mailto:example@domain.com)).
  </ParamField>

  <ParamField body="ipAddress" type="string">
    Customer's IP address.
  </ParamField>

  <ParamField body="type" type="string" required>
    The Verified Customer type. Set to personal if creating a verified personal Customer.
  </ParamField>

  <ParamField body="address1" type="string" required>
    First line of the street address of the Customer's permanent residence. Must be ≤ 50 characters, contain no special characters ``<[<>="`!?%~${}\]>``, and cannot be a PO Box.
  </ParamField>

  <ParamField body="address2" type="string">
    Second line of the street address of the Customer's permanent residence. Must be ≤ 50 characters, contain no special characters ``<[<>="`!?%~${}\]>``, and cannot be a PO Box.
  </ParamField>

  <ParamField body="city" type="string" required>
    City of Customer's permanent residence. Must be ≤ 50 characters and cannot contain numbers or special characters ``<[<>="`!?%~${}\]>``.
  </ParamField>

  <ParamField body="state" type="string" required>
    Two-letter abbreviation of the state in which the Customer resides, e.g., CA. Must be a valid U.S. state.
  </ParamField>

  <ParamField body="postalCode" type="string" required>
    Postal code of Customer's permanent residence. Must be a US 5-digit ZIP code (e.g., 50314) or ZIP+4 (e.g., 50314-1234).
  </ParamField>

  <ParamField body="dateOfBirth" type="string" required>
    Customer's date of birth in YYYY-MM-DD format. Must be between 18 to 125 years old at the time of submission.
  </ParamField>

  <ParamField body="ssn" type="string" required>
    Last four or full 9 digits of the Customer's Social Security Number. Must contain only numbers (e.g., 1234 or 123456789).
  </ParamField>

  <ParamField body="phone" type="string">
    Customer's 10-digit phone number. Must contain only numbers, no hyphens, spaces, or separators (e.g., 3334447777).
  </ParamField>

  <ParamField body="correlationId" type="string">
    A unique string value attached to a customer which can be used for traceability between Dwolla and your application. Must be ≤ 255 characters and contain no spaces. Acceptable characters: `a-z, 0-9, -, ., and _`. Note: Do not use sensitive Personal Identifying Information (PII). Uniqueness is enforced across Customers.
  </ParamField>
</Expandable>

Once you submit this request, Dwolla will perform some initial validation to check for formatting issues such as an invalid date of birth, invalid email format, etc. If successful, the response will be an HTTP 201/Created with the URL of the new Customer resource contained in the `Location` header.

##### Request and response

<CodeGroup>
  ```bash HTTP
  POST https://api-sandbox.dwolla.com/customers
  Content-Type: application/vnd.dwolla.v1.hal+json
  Accept: application/vnd.dwolla.v1.hal+json
  Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

{
"firstName": "John",
"lastName": "Doe",
"email": "johndoe@email.net",
"ipAddress": "10.10.10.10",
"type": "personal",
"address1": "99-99 33rd St",
"city": "Some City",
"state": "NY",
"postalCode": "11101",
"dateOfBirth": "1970-01-01",
"ssn": "1234"
}

HTTP/1.1 201 Created
Location: https://api.dwolla.com/customers/FC451A7A-AE30-4404-AB95-E3553FCD733F

````

```php create_customer.php
<?php
$customersApi = new DwollaSwagger\CustomersApi($apiClient);

$newCustomer = $customersApi->create([
  'firstName' => 'John',
  'lastName' => 'Doe',
  'email' => 'jdoe@nomail.net',
  'type' => 'personal',
  'address1' => '99-99 33rd St',
  'city' => 'Some City',
  'state' => 'NY',
  'postalCode' => '11101',
  'dateOfBirth' => '1970-01-01',

  # For the first attempt, only the
  # last 4 digits of SSN required

  # If the entire SSN is provided,
  # it will still be accepted
  'ssn' => '1234'
]);

$newCustomer; # => "https://api-sandbox.dwolla.com/customers/AB443D36-3757-44C1-A1B4-29727FB3111C"
?>
````

```ruby create_customer.rb
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
request_body = {
  :firstName => 'John',
  :lastName => 'Doe',
  :email => 'jdoe@nomail.net',
  :type => 'personal',
  :address1 => '99-99 33rd St',
  :city => 'Some City',
  :state => 'NY',
  :postalCode => '11101',
  :dateOfBirth => '1970-01-01',

  # For the first attempt, only the
  # last 4 digits of SSN required

  # If the entire SSN is provided,
  # it will still be accepted

  :ssn => '1234'
}

new_customer = app_token.post "customers", request_body
new_customer.response_headers[:location] # => "https://api-sandbox.dwolla.com/customers/AB443D36-3757-44C1-A1B4-29727FB3111C"
```

```python create_customer.py
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
request_body = {
  'firstName': 'John',
  'lastName': 'Doe',
  'email': 'jdoe@nomail.net',
  'type': 'personal',
  'address1': '99-99 33rd St',
  'city': 'Some City',
  'state': 'NY',
  'postalCode': '11101',
  'dateOfBirth': '1970-01-01',
  # For the first attempt, only the
  # last 4 digits of SSN required
  # If the entire SSN is provided,
  # it will still be accepted
  'ssn': '1234'
}

new_customer = app_token.post('customers', request_body)
new_customer.headers['location'] # => 'https://api-sandbox.dwolla.com/customers/AB443D36-3757-44C1-A1B4-29727FB3111C'
```

```javascript createCustomer.js
var requestBody = {
  firstName: "John",
  lastName: "Doe",
  email: "jdoe@nomail.net",
  type: "personal",
  address1: "99-99 33rd St",
  city: "Some City",
  state: "NY",
  postalCode: "11101",
  dateOfBirth: "1970-01-01",
  // For the first attempt, only the
  // last 4 digits of SSN required
  // If the entire SSN is provided,
  // it will still be accepted
  ssn: "1234",
};

dwolla.post("customers", requestBody).then(res => res.headers.get("location")); // => 'https://api-sandbox.dwolla.com/customers/FC451A7A-AE30-4404-AB95-E3553FCD733F'
```

</CodeGroup>

### Check the status of the personal verified Customer

The successful creation of a Customer doesn't necessarily mean the Customer is verified and eligible to send or receive funds. When a Customer has been successfully verified by Dwolla, their status will be set to `verified`.

Let's check to see if the Customer was successfully verified or not. We are going to use the location of the Customer resource that was just created, which is in `new_customer`.

```bash check_customer.sh
GET https://api-sandbox.dwolla.com/customers/FC451A7A-AE30-4404-AB95-E3553FCD733F
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

{
  "_links": {
    "self": {
      "href": "https://api-sandbox.dwolla.com/customers/FC451A7A-AE30-4404-AB95-E3553FCD733F",
      "type": "application/vnd.dwolla.v1.hal+json",
      "resource-type": "customer"
    },
    "receive": {
      "href": "https://api-sandbox.dwolla.com/transfers",
      "type": "application/vnd.dwolla.v1.hal+json",
      "resource-type": "transfer"
    },
    "edit-form": {
      "href": "https://api-sandbox.dwolla.com/customers/FC451A7A-AE30-4404-AB95-E3553FCD733F",
      "type": "application/vnd.dwolla.v1.hal+json; profile=\"https://github.com/dwolla/hal-forms\"",
      "resource-type": "customer"
    },
    "edit": {
      "href": "https://api-sandbox.dwolla.com/customers/FC451A7A-AE30-4404-AB95-E3553FCD733F",
      "type": "application/vnd.dwolla.v1.hal+json",
      "resource-type": "customer"
    },
    "funding-sources": {
      "href": "https://api-sandbox.dwolla.com/customers/FC451A7A-AE30-4404-AB95-E3553FCD733F/funding-sources",
      "type": "application/vnd.dwolla.v1.hal+json",
      "resource-type": "funding-source"
    },
    "transfers": {
      "href": "https://api-sandbox.dwolla.com/customers/FC451A7A-AE30-4404-AB95-E3553FCD733F/transfers",
      "type": "application/vnd.dwolla.v1.hal+json",
      "resource-type": "transfer"
    },
    "send": {
      "href": "https://api-sandbox.dwolla.com/transfers",
      "type": "application/vnd.dwolla.v1.hal+json",
      "resource-type": "transfer"
    }
  },
  "id": "FC451A7A-AE30-4404-AB95-E3553FCD733F",
  "firstName": "John",
  "lastName": "Doe",
  "email": "jdoe@nomail.net",
  "type": "personal",
  "status": "verified",
  "created": "2016-11-28T19:51:48.050Z",
  "address1": "99-99 33rd St",
  "address2": "Apt 8",
  "city": "Some City",
  "state": "NY",
  "postalCode": "11101",
  "phone": "5554321234"
}
```

Congrats! Our Customer was successfully verified!

However, if the Customer was unable to be verified on the initial flow, they will be given a verification status of either retry, kba, document, or suspended. Continue reading for instructions on [handling various Customer verification statuses](dwolla_personal_verified_costumer.instructions.md#handling-verification-statuses) and guidelines for providing additional information to verify these Customers.

# Handling verification statuses

After successfully creating a personal identity-verified `Customer`, they will immediately be given a status. There are various reasons a Customer status can be something other than `verified`; you will want to account for this after the Customer is created.

A Customer's verification status is determined by an identity verification score based on the data submitted; this score is returned from Dwolla's identity vendor. Therefore, it is important that the user enters accurate and complete identifying data, and that you exercise [best practices](https://www.owasp.org/index.php/Input_Validation_Cheat_Sheet) in input field validation to ensure the best possible success rate. As an example, the `retry` status can occur when an individual mis-keys or uses incorrect identifying information upon Customer creation (i.e. submitting a date of birth that differs from the user's actual date of birth).

It is recommended to have an active [webhook subscription](/docs/api-reference/webhook-subscriptions) to listen for Customer verification related events. Reference the table below for Customer verification statuses and the related events.

### Verification statuses

| Customer status | Event                                 | Description                                                                                                                                                                                                                                                                                                                                                                                           |
| --------------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| verified        | customer_verified                     | The identifying information submitted was sufficient in verifying the Customer account.                                                                                                                                                                                                                                                                                                               |
| retry           | customer_reverification_needed        | The initial identity verification attempt failed because the information provided did not satisfy Dwolla's verification check. You can make one additional attempt by changing some or all the attributes of the existing Customer with a POST request. All fields are required on the retry attempt. If the additional attempt fails, the resulting status will be either `document` or `suspended`. |
| kba             | customer_kba_verification_needed      | The `retry` identity verification attempt failed due to insufficient scores on the submitted data. The end user will have a single kba attempt to answer a set of "out of wallet" questions about themselves for identity verification. **Note:** KBA is a premium feature. Please contact Sales or your account manager for more information on enabling KBA functionality.                          |
| document        | customer_verification_document_needed | Dwolla requires additional documentation to identify the Customer in the document status. Once a document is uploaded it will be reviewed for verification.                                                                                                                                                                                                                                           |
| suspended       | customer_suspended                    | The Customer is suspended and may neither send nor receive funds. Contact Account Management for more information.                                                                                                                                                                                                                                                                                    |

### Testing verification statuses in Sandbox

Dwolla's <Tooltip tip="Sandbox is a testing environment provided by Dwolla for developers to test their applications.">Sandbox</Tooltip> environment allows you to submit `verified`, `retry`, `kba`, `document`, or `suspended` as the value of the firstName parameter to create a new verified Customer with their respective status. To simulate transitioning a verified Customer with a `retry` status to `verified`, you'll need to call the [Update a Customer](https://developers.dwolla.com/api-reference/customers/update) endpoint and submit full identifying information with an updated firstName value and full SSN. To simulate transitioning a verified Customer with a `document` status to `verified` in the Sandbox, you'll need to upload a test document as outlined in the [Testing in the Sandbox](dwolla_testing_sandbox.instructions.md#simulate-document-upload-approved-and-failed-events) resource article.

## Handling status - `retry`

A `retry` status occurs when a Customer's identity scores are too low during the initial verification attempt. Dwolla will require the **full 9-digits** of the individual's SSN on the retry attempt in order to give our identity vendor more information in an attempt to receive a sufficient score to approve the Customer account. The Customer will have one more opportunity to correct any mistakes.

<Warning>
  You need to gather <strong>new</strong> information if the Customer is placed
  into the <code>retry</code> status; simply passing the same information will
  result in the same insufficient scores. All fields that were required in the
  initial Customer creation attempt will be required in the retry attempt, along
  with the full 9-digit SSN.
</Warning>

<CodeGroup>
  ```bash HTTP
  POST https://api.dwolla.com/customers/132681fa-1b4d-4181-8ff2-619ca46235b1
  Content-Type: application/vnd.dwolla.v1.hal+json
  Accept: application/vnd.dwolla.v1.hal+json
  Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

{
"firstName": "John",
"lastName": "Doe",
"email": "johndoe@nomail.net",
"ipAddress": "10.10.10.10",
"type": "personal",
"address1": "221 Corrected Address St.",
"address2": "Fl 8",
"city": "Ridgewood",
"state": "NY",
"postalCode": "11385",
"dateOfBirth": "1990-07-11",
"ssn ": "202-99-1516"
}

````

```ruby retry_customer.rb
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
customer_url = 'https://api.dwolla.com/customers/132681fa-1b4d-4181-8ff2-619ca46235b1'
request_body = {
      "firstName" => "John",
       "lastName" => "Doe",
          "email" => "jdoe@nomail.com",
      "ipAddress" => "10.10.10.10",
           "type" => "personal",
       "address1" => "221 Corrected Address St..",
       "address2" => "Apt 201",
           "city" => "San Francisco",
          "state" => "CA",
     "postalCode" => "94104",
    "dateOfBirth" => "1970-07-11",
            "ssn" => "123-45-6789"
}

customer = app_token.post customer_url, request_body
customer.id # => "132681fa-1b4d-4181-8ff2-619ca46235b1"
````

```javascript retryCustomer.js
// Using dwolla-v2 - https://github.com/Dwolla/dwolla-v2-node
var customerUrl = "https://api.dwolla.com/customers/132681fa-1b4d-4181-8ff2-619ca46235b1";
var requestBody = {
  firstName: "John",
  lastName: "Doe",
  email: "johndoe@dwolla.com",
  ipAddress: "10.10.10.10",
  type: "personal",
  address1: "221 Corrected Address St..",
  address2: "Fl 8",
  city: "Ridgewood",
  state: "NY",
  postalCode: "11385",
  dateOfBirth: "1990-07-11",
  ssn: "202-99-1516",
};

dwolla.post(customerUrl, requestBody).then(function (res) {
  res.body.id; // => '132681fa-1b4d-4181-8ff2-619ca46235b1'
});
```

```python retry_customer.py
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python (Recommended)
customer_url = 'https://api.dwolla.com/customers/132681fa-1b4d-4181-8ff2-619ca46235b1'
request_body = {
  'firstName': 'John',
  'lastName': 'Doe',
  'email': 'jdoe@nomail.com',
  'ipAddress': '10.10.10.10',
  'type': 'personal',
  'address1': '221 Corrected Address St..',
  'address2': 'Apt 201',
  'city': 'San Francisco',
  'state': 'CA',
  'postalCode': '94104',
  'dateOfBirth': '1970-07-11',
  'ssn': '123-45-6789'
}

customer = app_token.post(customer_url, request_body)
customer.body.id # => '132681fa-1b4d-4181-8ff2-619ca46235b1'
```

```php retry_customer.php
<?php
$customersApi = DwollaSwagger\CustomersApi($apiClient);

$customerUrl = "https://api.dwolla.com/customers/132681fa-1b4d-4181-8ff2-619ca46235b1";
$retryCustomer = $customersApi->updateCustomer(array (
  'firstName' => 'John',
  'lastName' => 'Doe',
  'email' => 'johndoe@nomail.net',
  'ipAddress' => '10.10.10.10',
  'type' => 'personal',
  'address1' => '221 Corrected Address St.',
  'address2' => 'Fl 8',
  'city' => 'Ridgewood',
  'state' => 'NY',
  'postalCode' => '11385',
  'dateOfBirth' => '1990-07-11',
  'ssn' => '202-99-1516',
), $customerUrl);

print($retryCustomer->id); # => 132681fa-1b4d-4181-8ff2-619ca46235b1
?>
```

</CodeGroup>

Check the Customer's status again. The Customer will either be in the `verified`, `kba`, `document`, or `suspended` state of verification.

## Handling status - `kba`

<Info>
  This section outlines a premium feature for the Dwolla API. Please contact
  Sales or your account manager for more information on enabling KBA
  functionality.
</Info>

### Initiating the KBA session

The first step in the KBA flow is to make a request to the Dwolla API to [generate a unique KBA ID](https://developers.dwolla.com/api-reference/kba/initiate-kba-session) which is used to represent the KBA session.

#### Example request and response

<CodeGroup>
  ```bash HTTP
  POST https://api.dwolla.com/customers/33aa88b1-97df-424a-9043-d5f85809858b/kba
  Authorization: Bearer cRahPzURfaIrTKL18tmslWPqKdzkLeYJm0oB1hGJ1vMPArft1v
  Content-Type: application/json
  Accept: application/vnd.dwolla.v1.hal+json

...

HTTP/1.1 201 Created\
 Location: https://api.dwolla.com/kba/33aa88b1-97df-424a-9043-d5f85809858b

````

```ruby initiate_kba.rb
customer_url = 'https://api-sandbox.dwolla.com/customers/ca22d192-48f1-4b72-b29d-681e9e20795d'

kba = app_token.post "#{customer_url}/kba"
kba.response_headers[:location] # => "https://api-sandbox.dwolla.com/kba/70b0e9cc-020d-4de2-9a82-a2281afa4c31"
````

```php initiate_kba.php
<?php
// Using dwollaswagger - https://github.com/Dwolla/dwolla-swagger-php
$customersApi = new DwollaSwagger\CustomersApi($apiClient);

$customerUrl = "https://api.dwolla.com/customers/ca22d192-48f1-4b72-b29d-681e9e20795d"

$kba = $customersApi->initiateKba($customer_url);
$kba; # => "https://api-sandbox.dwolla.com/kba/70b0e9cc-020d-4de2-9a82-a2281afa4c31"
?>
```

```python initiate_kba.py
customer_url = 'https://api-sandbox.dwolla.com/customers/61a74e62-e27d-46f1-9fa6-a8e57226bb3e'

kba = app_token.post('%s/kba' % customer_url)
kba.headers['location'] # => "https://api-sandbox.dwolla.com/kba/70b0e9cc-020d-4de2-9a82-a2281afa4c31"
```

```javascript initiate_kba.js
var customerUrl = "https://api-sandbox.dwolla.com/customers/61a74e62-e27d-46f1-9fa6-a8e57226bb3e";

dwolla.post(`${customerUrl}/kba`).then(res => res.headers.get("location")); // => 'https://api-sandbox.dwolla.com/kba/70b0e9cc-020d-4de2-9a82-a2281afa4c31'
```

</CodeGroup>

### Retrieve KBA Question set

Once the KBA ID is created, your application will have a **single attempt** to [retrieve](https://developers.dwolla.com/api-reference/kba/retrieve-kba-questions) and [answer](https://developers.dwolla.com/api-reference/kba/verify-kba-questions) the question set returned from the Dwolla API. Upon a successful request to retrieve the question set, your end user will have two minutes to complete the submission of their selected answers.

#### Example request and response

<CodeGroup>
  ```bash [expandable]
  GET https://api.dwolla.com/kba/33aa88b1-97df-424a-9043-d5f85809858b
  Accept: application/vnd.dwolla.v1.hal+json
  Authorization: Bearer cRahPzURfaIrTewKL18tmslWPqKdzkLeYJm0oB1hGJ1vMPArft1v

...

{
"\_links": {
"answer": {
"href": "https://api-sandbox.dwolla.com/kba/33aa88b1-97df-424a-9043-d5f85809858b",
"type": "application/vnd.dwolla.v1.hal+json",
"resource-type": "kba"
}
},
"id": "33aa88b1-97df-424a-9043-d5f85809858b",
"questions": [
{
"id": "2355953375",
"text": "In what county do you currently live?",
"answers": [
{
"id": "2687969295",
"text": "Pulaski"
},
{
"id": "2687969305",
"text": "St. Joseph"
},
{
"id": "2687969315",
"text": "Daviess"
},
{
"id": "2687969325",
"text": "Jackson"
},
{
"id": "2687969335",
"text": "None of the above"
}
]
},
{
"id": "2355953385",
"text": "Which team nickname is associated with a college you attended?",
"answers": [
{
"id": "2687969345",
"text": "Colts"
},
{
"id": "2687969355",
"text": "Eagles"
},
{
"id": "2687969365",
"text": "Gator"
},
{
"id": "2687969375",
"text": "Sentinels"
},
{
"id": "2687969385",
"text": "None of the above"
}
]
},
{
"id": "2355953395",
"text": "What kind of IA license plate has been on your 1996 Acura TL?",
"answers": [
{
"id": "2687969395",
"text": "Antique"
},
{
"id": "2687969405",
"text": "Disabled Veteran"
},
{
"id": "2687969415",
"text": "Educational Affiliation"
},
{
"id": "2687969425",
"text": "Military Honor"
},
{
"id": "2687969435",
"text": "I have never been associated with this vehicle"
}
]
}
]
}

````

```ruby retrieve_kba.rb
kba_url = 'https://api-sandbox.dwolla.com/kba/70b0e9cc-020d-4de2-9a82-a2281afa4c31'

kba_questions = app_token.get kba_url
kba_questions.id # => "70b0e9cc-020d-4de2-9a82-a2281afa4c31"
````

```php retrieve_kba.php
<?php
// Using dwollaswagger - https://github.com/Dwolla/dwolla-swagger-php
$kbaApi = new DwollaSwagger\KbaApi($apiClient);

kba_url = "https://api-sandbox.dwolla.com/kba/70b0e9cc-020d-4de2-9a82-a2281afa4c31";

$kbaQuestions = $kbaApi->getKbaQuestions($kbaUrl);
print $kbaQuestions->id; # => "70b0e9cc-020d-4de2-9a82-a2281afa4c31"
?>
```

```python retrieve_kba.py
kba_url = 'https://api-sandbox.dwolla.com/kba/70b0e9cc-020d-4de2-9a82-a2281afa4c31'

kba_questions = app_token.get(kba_url)
kba_questions.id # => '70b0e9cc-020d-4de2-9a82-a2281afa4c31'
```

```javascript retrieveKba.js
var kbaUrl = "https://api-sandbox.dwolla.com/kba/70b0e9cc-020d-4de2-9a82-a2281afa4c31";

dwolla.get(kbaUrl).then(res => res.body.id); // => '70b0e9cc-020d-4de2-9a82-a2281afa4c31'
```

</CodeGroup>

### Answer KBA Questions

Questions and answers will have their own unique identifiers. Questions and answers are submitted via an `answers` array that contains a list of four JSON objects that include key-value pairs for specifying a questionId and answerId.

#### Example request and response

<CodeGroup>
  ```bash HTTP
  POST https://api.dwolla.com/kba/33aa88b1-97df-424a-9043-d5f85809858b
  Accept: application/vnd.dwolla.v1.hal+json
  Authorization: Bearer cRahPzURfaIrTewKL18tmslWPqKdzkLeYJm0oB1hGJ1vMPArft1v

...

{
"answers": [
{
"questionId": "2355953375",
"answerId": "2687969335"
},
{
"questionId": "2355953385",
"answerId": "2687969385"
},
{
"questionId": "2355953395",
"answerId": "2687969435"
},
{
"questionId": "2355953405",
"answerId": "2687969485"
}
]
}

````

```ruby answer_kba.rb
kba_url = 'https://api-sandbox.dwolla.com/kba/70b0e9cc-020d-4de2-9a82-a2281afa4c31'

request_body = {
    :answers => [
        {
            :questionId => "2355953375",
            :answerId => "2687969335"
        },
        {
            :questionId => "2355953385",
            :answerId => "2687969385"
        },
        {
            :questionId => "2355953395",
            :answerId => "2687969435"
        },
        {
            :questionId => "2355953405",
            :answerId => "2687969485"
        }
    ]
}

kba_answers = app_token.post kba_url, request_body
````

```php answer_kba.php
<?php
// Using dwollaswagger - https://github.com/Dwolla/dwolla-swagger-php
$kbaApi = new DwollaSwagger\KbaApi($apiClient);

$kbaUrl = "https://api-sandbox.dwolla.com/kba/70b0e9cc-020d-4de2-9a82-a2281afa4c31";

$kbaAnswers = $kbaApi->answerKbaQuestions([
    "answers" => [
         [
             "questionId" => "2355953375",
             "answerId" => "2687969335"
         ],
         [
             "questionId" => "2355953385",
             "answerId" => "2687969385"
         ],
         [
             "questionId" => "2355953395",
             "answerId" => "2687969435"
         ],
         [
             "questionId" => "2355953405",
             "answerId" => "2687969485"
         ]
    ]
  ], $kbaUrl);
?>
```

```python answer_kba.py
kba_url = 'https://api-sandbox.dwolla.com/kba/70b0e9cc-020d-4de2-9a82-a2281afa4c31'

request_body = {
    'answers' : [
        {
            'questionId': "2355953375",
            'answerId': "2687969335"
        },
        {
            'questionId': "2355953385",
            'answerId': "2687969385"
        },
        {
            'questionId': "2355953395",
            'answerId':"2687969435"
        },
        {
            'questionId': "2355953405",
            'answerId': "2687969485"
        }
    ]
}

kba_answers = app_token.post (kba_url, request_body)
```

```javascript answer_kba.js
var kbaUrl = "https://api.dwolla.com/kba/70b0e9cc-020d-4de2-9a82-a2281afa4c31";
var requestBody = {
  answers: [
    {
      questionId: "2355953375",
      answerId: "2687969335",
    },
    {
      questionId: "2355953385",
      answerId: "2687969385",
    },
    {
      questionId: "2355953395",
      answerId: "2687969435",
    },
    {
      questionId: "2355953405",
      answerId: "2687969485",
    },
  ],
};

dwolla.post(kbaUrl, requestBody);
```

</CodeGroup>

#### KBA Success

If your Customer is able to correctly answer at least three of the four (total) KBA questions, your Customer will be moved into `verified` status. You will receive the `customer_kba_verification_passed` and <Tooltip tip="A webhook is a notification sent from Dwolla to your application when certain events occur.">webhooks</Tooltip> to indicate that your Customer has passed the KBA attempt and has been successfully verified.

#### KBA Failure

A Customer that is unable to answer at least three questions correctly will be moved into `document` status. You will receive the `customer_kba_verification_failed` and `customer_verification_document_needed` webhooks to indicate that your Customer has failed the KBA attempt and must upload a photo Id in order to become `verified`.

## Handling status - `document`

If the Customer has a status of `document`, the Customer will need to upload additional pieces of information in order to verify the account. Use the [create a document](https://developers.dwolla.com/api-reference/documents/create-document-for-customer) endpoint when uploading a colored camera captured image of the identifying document. The document(s) will then be reviewed by Dwolla; this review may take up to 1-2 business days to approve or reject.

You can provide the following best practices to the Customer in order to reduce the chances of a document being rejected:

- Only images of the front of an ID
- All 4 Edges of the document should be visible
- A dark/high contrast background should be used
- At least 90% of the image should be the document
- Should be at least 300dpi
- Capture image from directly above the document
- Make sure that the image is properly aligned, not rotated, tilted or skewed
- No flash to reduce glare
- No black and white documents
- No expired IDs

### Document types

A colored camera captured image of the Customer's identifying document can be specified as documentType: `passport`, `license` (state issued driver's license), or `idCard` (other U.S. government-issued photo id card).

<Info>
  Note: Military IDs are <b>not</b> accepted
</Info>

When a Customer is placed in the `document` verification status, Dwolla will return a link in the API response after [retrieving a Customer](https://developers.dwolla.com/api-reference/customers/retrieve-a-customer) which will be used by an application to determine if documentation is needed.

| Link name            | Description                                               |
| -------------------- | --------------------------------------------------------- |
| verify-with-document | Identifies if documents are needed only for an individual |

##### Example response

```json
{
  "_links": {
    "document-form": {
      "href": "https://api-sandbox.dwolla.com/customers/64dd2beb-fe56-4cdc-80dd-82a3d7f5b921/documents",
      "type": "application/vnd.dwolla.v1.hal+json; profile=\"https://github.com/dwolla/hal-forms\"",
      "resource-type": "document"
    },
    "self": {
      "href": "https://api-sandbox.dwolla.com/customers/64dd2beb-fe56-4cdc-80dd-82a3d7f5b921",
      "type": "application/vnd.dwolla.v1.hal+json",
      "resource-type": "customer"
    },
    "funding-sources": {
      "href": "https://api-sandbox.dwolla.com/customers/64dd2beb-fe56-4cdc-80dd-82a3d7f5b921/funding-sources",
      "type": "application/vnd.dwolla.v1.hal+json",
      "resource-type": "funding-source"
    },
    "transfers": {
      "href": "https://api-sandbox.dwolla.com/customers/64dd2beb-fe56-4cdc-80dd-82a3d7f5b921/transfers",
      "type": "application/vnd.dwolla.v1.hal+json",
      "resource-type": "transfer"
    },
    "verify-with-document": {
      "href": "https://api-sandbox.dwolla.com/customers/64dd2beb-fe56-4cdc-80dd-82a3d7f5b921/documents",
      "type": "application/vnd.dwolla.v1.hal+json",
      "resource-type": "document"
    }
  },
  "id": "64dd2beb-fe56-4cdc-80dd-82a3d7f5b921",
  "firstName": "document",
  "lastName": "doctest",
  "email": "docTest@email.com",
  "type": "personal",
  "status": "document",
  "created": "2017-08-31T14:28:11.047Z",
  "address1": "99-99 33rd St",
  "address2": "Apt 8",
  "city": "Some City",
  "state": "NY",
  "postalCode": "11101"
}
```

### Uploading a document

To upload a color photo of the document, you'll initiate a multipart form-data POST request from your backend server to `https://api.dwolla.com/customers/{id}/documents`. The file must be either a .jpg, .jpeg, or .png. Files must be no larger than 10MB in size.

<CodeGroup>
  ```bash
  curl -X POST
  \ -H "Authorization: Bearer tJlyMNW6e3QVbzHjeJ9JvAPsRglFjwnba4NdfCzsYJm7XbckcR"
  \ -H "Accept: application/vnd.dwolla.v1.hal+json"
  \ -H "Cache-Control: no-cache"
  \ -H "Content-Type: multipart/form-data"
  \ -F "documentType=passport"
  \ -F "file=@foo.png"
  \ 'https://api-sandbox.dwolla.com/customers/132681fa-1b4d-4181-8ff2-619ca46235b1/documents'

HTTP/1.1 201 Created
Location: https://api-sandbox.dwolla.com/documents/11fe0bab-39bd-42ee-bb39-275afcc050d0

````

```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
customer_url = 'https://api.dwolla.com/customers/132681fa-1b4d-4181-8ff2-619ca46235b1'

file = Faraday::UploadIO.new('mclovin.jpg', 'image/jpeg')
document = app_token.post "#{customer_url}/documents", file: file, documentType: 'license'
document.response_headers[:location] # => "https://api.dwolla.com/documents/11fe0bab-39bd-42ee-bb39-275afcc050d0"
````

```javascript
// Using dwolla-v2 - https://github.com/Dwolla/dwolla-v2-node
var customerUrl = "https://api.dwolla.com/customers/132681fa-1b4d-4181-8ff2-619ca46235b1";

var requestBody = new FormData();
body.append("file", fs.createReadStream("mclovin.jpg"), {
  filename: "mclovin.jpg",
  contentType: "image/jpeg",
  knownLength: fs.statSync("mclovin.jpg").size,
});
body.append("documentType", "license");

dwolla.post(`${customerUrl}/documents`, requestBody).then(function (res) {
  res.headers.get("location"); // => "https://api.dwolla.com/documents/11fe0bab-39bd-42ee-bb39-275afcc050d0"
});
```

```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python (Recommended)
customer_url = 'https://api.dwolla.com/customers/132681fa-1b4d-4181-8ff2-619ca46235b1'

document = app_token.post('%s/documents' % customer_url, file = open('mclovin.jpg', 'rb'), documentType = 'license')
document.headers['location'] # => 'https://api.dwolla.com/documents/11fe0bab-39bd-42ee-bb39-275afcc050d0'
```

```php
// No SDK support. Coming soon
```

If the document was successfully uploaded, the response will be a HTTP 201 Created with the URL of the new document resource contained in the Location header.

```bash
HTTP/1.1 201 Created
Location: https://api-sandbox.dwolla.com/documents/11fe0bab-39bd-42ee-bb39-275afcc050d0
```

</CodeGroup>

You'll also get a webhook with a `customer_verification_document_uploaded` event to let you know the document was successfully uploaded.

### Document review process

Once created, the document will be reviewed by Dwolla. When the document has been reviewed, which may take anywhere from a few seconds up to 1-2 business days if manual verification is required to approve or reject, we'll create either a `customer_verification_document_approved` or `customer_verification_document_failed` event.

If the document was sufficient, the Customer may be verified in this process. If not, we may need additional documentation. Note: Reference the [determining verification documents needed](#handling-status---document) section for more information on determining if additional documents are needed after an approved or failed event is triggered.

If the document was found to be fraudulent or doesn't match the identity of the Customer, the Customer will be suspended.

### Document failure

A document can fail if, for example, the Customer uploaded the wrong type of document or the `.jpg` or `.png` file supplied was not readable (i.e. blurry, not well lit, not in color, or cuts off a portion of the identifying image). If you receive a `customer_verification_document_failed` webhook, you'll need to upload another document. To retrieve the failure reason for the document upload, you'll retrieve the document by its ID. Contained in the response will be a `failureReason` field which corresponds to one or more of the following values. In case of a failure due to multiple reasons, an additional `allFailureReasons` array of `reason`s and `description`s is also returned :

| Failure reason                         | Description                                                            |
| -------------------------------------- | ---------------------------------------------------------------------- |
| <code>ForeignPassportNotAllowed</code> | The passport's country of origin was not the United States of America  |
| <code>ScanNotReadable</code>           | Image blurry, too dark, or obscured by glare                           |
| <code>ScanNotUploaded</code>           | Scan not uploaded                                                      |
| <code>ScanIdExpired</code>             | ID is expired                                                          |
| <code>ScanIdTypeNotSupported</code>    | ID may be a military ID, firearm license, or other unsupported ID type |
| <code>ScanIdUnrecognized</code>        | ID is not recognized                                                   |
| <code>ScanNameMismatch</code>          | Name mismatch                                                          |
| <code>ScanDobMismatch</code>           | Date of birth mismatch                                                 |
| <code>ScanFailedOther</code>           | ID may be fraudulent or a generic example ID image                     |

##### Request and response

<CodeGroup>
  ```bash
  GET https://api-sandbox.dwolla.com/documents/11fe0bab-39bd-42ee-bb39-275afcc050d0
  Accept: application/vnd.dwolla.v1.hal+json
  Authorization: Bearer tJlyMNW6e3QVbzHjeJ9JvAPsRglFjwnba4NdfCzsYJm7XbckcR

...

{
"\_links": {
"self": {
"href": "https://api-sandbox.dwolla.com/documents/11fe0bab-39bd-42ee-bb39-275afcc050d0"
}
},
"id": "11fe0bab-39bd-42ee-bb39-275afcc050d0",
"status": "reviewed",
"type": "license",
"created": "2016-01-29T21:22:22.000Z",
"failureReason": "ScanNotReadable",
"allFailureReasons": [
{
"reason": "ScanDobMismatch",
"description": "Date of Birth mismatch"
},
{
"reason": "ScanIdExpired",
"description": "ID is expired"
}
]
}

````

```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
document_url = 'https://api.dwolla.com/documents/11fe0bab-39bd-42ee-bb39-275afcc050d0'

document = app_token.get document_url
document.failureReason # => "ScanNotReadable"
````

```javascript
var documentUrl = "https://api.dwolla.com/documents/11fe0bab-39bd-42ee-bb39-275afcc050d0";

dwolla.get(document_url).then(function (res) {
  res.body.failureReason; // => "ScanNotReadable"
});
```

```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python (Recommended)
document_url = 'https://api.dwolla.com/documents/11fe0bab-39bd-42ee-bb39-275afcc050d0'

documents = app_token.get(document_url)
documents.body['failureReason'] # => 'ScanNotReadable'
```

```php
<?php
$aDocument = 'https://api.dwolla.com/documents/11fe0bab-39bd-42ee-bb39-275afcc050d0';

$documentsApi = DwollaSwagger\DocumentsApi($apiClient);

$retrieved = $documentsApi->getCustomer($aDocument);
print($retrieved->failureReason); # => "ScanNotReadable"
?>
```

</CodeGroup>

## Handling status: suspended

If the Customer is `suspended`, there's no further action you can take to correct this using the API. You'll need to contact [support@dwolla.com](mailto:support@dwolla.com) or your account manager for assistance.

# Frequently Asked Questions

<Collapsible
triggerText={
<span>
Q: My Customer has a <code>retry</code> status. What activity would they
be able to engage in while being in <code>retry</code> status, as it
relates to the Dwolla Platform?
</span>
}

>

  <ul>
    <li>Send funds - No</li>

    <li>
      Receive funds - Yes - Note that funds will only process to their balance
      and the transfer will stay <code>pending</code> until the Customer has
      been verified.
    </li>

    <li>Add and verify a bank funding source - Yes</li>

  </ul>
</Collapsible>

<Collapsible
triggerText={
<span>
Q: My Customer has a <code>document</code> status. What activity would
they be able to engage in while being in <code>document</code> status, as
it relates to the Dwolla Platform?
</span>
}

>

  <ul>
    <li>Send funds - No</li>

    <li>
      Receive funds - Yes - Note that funds will only process to their balance
      and the transfer will stay <code>pending</code> until the Customer has
      been verified.
    </li>

    <li>Add and verify a bank funding source - Yes</li>

  </ul>
</Collapsible>

<Collapsible
triggerText={
<span>
Q: My Customer has a <code>deactivated</code> or <code>suspended</code>{" "}
status. What activity would they be able to engage in while being in{" "}
<code>deactivated</code> or <code>suspended</code> status, as it relates
to the Dwolla Platform?
</span>
}

>

  <ul>
    <li>Send funds - No</li>
    <li>Receive funds - No</li>
    <li>Add and verify a bank funding source - No</li>
  </ul>
</Collapsible>

<Collapsible
triggerText={
<span>
Q: My Customer has a <code>verified</code> status, but is unable to send
funds. Why is this?
</span>
}

>

  <p>
    Your Customer has likely not completed the bank verification process. You
    can check to see the status of the funding source{" "}

    <a href="https://developers.dwolla.com/api-reference/funding-sources/list-funding-sources-for-a-customer">
      via the API
    </a>

    {" "}

    or by going into the{" "}
    <a href="https://www.dwolla.com/platform/dashboard">Dwolla dashboard.</a>

  </p>
</Collapsible>

<Collapsible
triggerText={
<span>
Q: Can I change a <code>Verified</code> Customer type to an{" "}
<code>Unverified</code> Customer type?
</span>
}

>

  <p>
    No. Downgrade functionality is not supported for Dwolla Verified Customers.
  </p>
</Collapsible>

<Collapsible
triggerText={
<span>
Q: My Customer has a <code>document</code> status. Can I submit more than
one document via the API?
</span>
}

>

  <p>
    Yes, although this is not necessary, nor recommended. Dwolla manually
    reviews all documents, so sending more documents than necessary may slow
    down the verification process for your Customers.
  </p>
</Collapsible>

<Collapsible
triggerText={
<span>
Q: My end user is not a US resident, can they still create a Personal
Verified Customer via the API to access my application?
</span>
}

>

  <p>
    No. At this time, Dwolla only supports end users that are US residents when
    creating Personal Verified Customers.
  </p>
</Collapsible>

<Collapsible
triggerText={
<span>
Q: My Customer needs to send more funds than is allowed in my Dwolla
services agreement. What is the best way to go about this?
</span>
}

>

  <p>
    Your Customer is able to send multiple separate transfers as long as each
    transfer amount is less than the transfer limit defined in your services
    agreement. <br />

    <br />

    Example Scenario: The transaction limit for my Customer is $10,000 and they
        need to send $15,000. In this case, you can prompt your Customer to send two
    transfers. One for $10,000 and another for $5,000.

  </p>
</Collapsible>
