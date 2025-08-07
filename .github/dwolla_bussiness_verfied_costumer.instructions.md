---
applyTo: "**"
---

# Business Verified Customer

> Verifying a business' identity enables increased functionality on the platform. Create a business Customer that can receive funds and send up to $10,000 per transfer (default).

## Overview

This guide will walk through the complete process of business verification within the Dwolla API, including creating a business verified Customer, handling verification statuses, adding beneficial owners, and certifying beneficial ownership. A business verified Customer represents a business that intends to send or receive funds on your platform. In any transaction, at least one party—either the sender or the receiver—must complete the identity verification process as outlined in this guide.

The business verification process consists of the following key steps:

<Steps>
  <Step title="Creating a Business Verified Customer">
    Learn how to create a business verified Customer in Dwolla, including required information for different business types and how to submit the initial verification request.
  </Step>

  <Step title="Handling Business Verified Customer Statuses">
    Understand the possible verification statuses, how to handle retry and document requests, and what to do if additional information is needed for verification.
  </Step>

  <Step title="Adding Beneficial Owner(s)">
    Add and verify beneficial owners for your business Customer, including required information and how to check their verification status.
  </Step>

  <Step title="Certify Beneficial Ownership">
    Certify that all beneficial owner information is correct to fulfill compliance requirements and enable your business Customer to send funds.
  </Step>
</Steps>

### Key Terminology

- **Account Admin** - The representative creating the business verified Customer on behalf of the business and Controller.
- **Controller** - Any natural individual who holds significant responsibilities to control, manage, or direct a company or other corporate entity (i.e. CEO, CFO, General Partner, President, etc). A company may have more than one controller, but only one controller's information must be collected.
- **Beneficial owner** - Any natural person who, directly or indirectly, owns 25% or more of the equity interests of the company.
- **Beneficial ownership certification** - An action taken by the Account Admin to confirm that the information provided is correct.
- **EIN (Employer Identification Number)** - A unique identification number that is assigned to a business entity so that they can easily be identified by the Internal Revenue Service.

# Step 1 - Creating a Business Verified Customer

Creating a business verified Customer will require you to provide information about the business entity as well as a Controller, if required.

#### Business Verified Customer Quick Guide

| Business Structure           | Dwolla `businessType` Value | Controller Required? | Add Beneficial Owners? | Certify Beneficial Ownership? |
| ---------------------------- | --------------------------- | -------------------- | ---------------------- | ----------------------------- |
| Sole proprietorships         | `soleProprietorship`        | No                   | No (exempt)            | No (exempt)                   |
| Unincorporated association   | `soleProprietorship`        | No                   | No (exempt)            | No (exempt)                   |
| Trust                        | `soleProprietorship`        | No                   | No (exempt)            | No (exempt)                   |
| Corporation                  | `corporation`               | Yes                  | Yes (if owns 25%+)     | Yes                           |
| Publicly traded corporations | `corporation`               | Yes                  | No (exempt)            | Yes                           |
| Non-profits                  | `corporation` or `llc`      | Yes                  | No (exempt)            | Yes                           |
| LLCs                         | `llc`                       | Yes                  | Yes (if owns 25%+)     | Yes                           |
| Partnerships, LP's, LLP's    | `partnership`               | Yes                  | Yes (if owns 25%+)     | Yes                           |

There are two types of business verified Customers that you can create, based on if they are required to add information on the Controller or not.

## Create a business verified Customer with no Controller

Follow these steps to create a business verified Customer where `"businessType": "soleProprietorship"`

##### Events

As a developer, you can expect these events to be triggered when a business verified Customer is successfully created and systematically verified:

1. `customer_created`
2. `customer_verified`

#### What parties are identity verified by Dwolla?

| Business Type           | Business Entity   | Controller | Business Owner    |
| ----------------------- | ----------------- | ---------- | ----------------- |
| **Sole Proprietorship** | Identity verified | N/A        | Identity verified |

In order to create a business verified Customer with `businessType` of `soleProprietorship`, Dwolla only requires information to verify the identity of the business and the Account Admin.

### Sole Propreietorship - Request parameters

| Parameter              | Required | Type   | Description                                                                                                                                                                             |
| ---------------------- | -------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| firstName              | yes      | string | The legal first name of the Business Owner. Must be **≤ 50 characters** and cannot include special characters ``[<>="`!?%~${}\]``.                                                      |
| lastName               | yes      | string | The legal last name of the Business Owner. Must be **≤ 50 characters** and cannot include special characters ``[<>="`!?%~${}\]``.                                                       |
| email                  | yes      | string | Email address of the Business Owner. Must be a **valid email format** (e.g., `example@domain.com`).                                                                                     |
| ipAddress              | no       | string | IP address of the registering user is **recommended**.                                                                                                                                  |
| type                   | yes      | string | Must be **`business`**.                                                                                                                                                                 |
| dateOfBirth            | yes      | string | The date of birth of the Business Owner. <br /> **Format:** `YYYY-MM-DD` <br /> **Age Range:** Must be between **18 to 125 years**.                                                     |
| ssn                    | yes      | string | Last four or full 9 digits of the Business Owner's Social Security Number. Must contain only numbers (e.g., `1234` or `123456789`).                                                     |
| address1               | yes      | string | Street number and street name of the business' physical address. Must be **≤ 50 characters**, contain no special characters ``[<>="`!?%~${}\]``, and **cannot be a PO Box**.            |
| address2               | no       | string | Apartment, floor, suite, bldg. # of business' physical address. Must be **≤ 50 characters** and cannot include special characters ``[<>="`!?%~${}\]``.                                  |
| city                   | yes      | string | City of the business' physical address. Must be **≤ 50 characters** and cannot contain numbers or special characters ``[<>="`!?%~${}\]``.                                               |
| state                  | yes      | string | **US Persons** - Must be a **valid two-letter US state/territory abbreviation** (e.g., `CA`). <br /> Reference: [US Postal Service guide](https://pe.usps.com/text/pub28/28apb.htm).    |
| postalCode             | yes      | string | Business' **US ZIP Code**. Must be either **5 digits** (e.g., `50314`) or **ZIP+4** (e.g., `50314-1234`).                                                                               |
| businessName           | yes      | string | Registered business name. Must be **≤ 255 characters** and cannot include special characters ``[<>="`!?%~${}\]``.                                                                       |
| doingBusinessAs        | no       | string | Preferred business name – also known as a **fictitious name** or **assumed name**. Must be **≤ 255 characters** and cannot include special characters ``[<>="`!?%~${}\]``.              |
| businessType           | yes      | string | Business structure. Must be **`soleProprietorship`**.                                                                                                                                   |
| businessClassification | yes      | string | The **industry classification ID** corresponding to the Customer's business. <br /> Reference: [Business Classifications](/docs/api-reference/customers/list-business-classifications). |
| ein                    | no       | string | Employer Identification Number (**EIN**). **Optional** for `soleProprietorship` business Customers. Must be **9 numeric characters** (e.g., `123456789`).                               |
| website                | no       | string | Business' website. Must be a **valid URL** (e.g., `https://www.domain.com`).                                                                                                            |
| phone                  | no       | string | Business's **10-digit phone number**. Must contain **only numbers** (e.g., `3334447777`). **No hyphens, spaces, or separators**.                                                        |

#### Sole Propreietorship - Request and response

<CodeGroup>
  ```bash HTTP
  POST https://api-sandbox.dwolla.com/customers
  Content-Type: application/vnd.dwolla.v1.hal+json
  Accept: application/vnd.dwolla.v1.hal+json
  Authorization: Bearer 0Sn0W6kzNic+oWhDbQcVSKLRUpGjIdl/YyrHqrDDoRnQwE7Q

{
"firstName": "Business",
"lastName": "Owner",
"email": "solePropBusiness@email.com",
"ipAddress": "143.156.7.8",
"type": "business",
"dateOfBirth": "1980-01-31",
"ssn": "6789",
"address1": "99-99 33rd St",
"city": "Some City",
"state": "NY",
"postalCode": "11101",
"businessClassification": "9ed3f670-7d6f-11e3-b1ce-5404a6144203",
"businessType": "soleProprietorship",
"businessName":"Jane Corp",
"ein":"00-0000000"
}

HTTP/1.1 201 Created
Location: https://api-sandbox.dwolla.com/customers/62c3aa1b-3a1b-46d0-ae90-17304d60c3d5

````

```php create_business_customer.php
<?php
$customersApi = new DwollaSwagger\CustomersApi($apiClient);
$new_customer = $customersApi->create([
    'firstName' => 'Business',
    'lastName' => 'Owner',
    'email' => 'solePropBusiness@email.com',
    'ipAddress' => '143.156.7.8',
    'type' => 'business',
    'dateOfBirth' => '1980-01-31',
    'ssn' => '6789',
    'address1' => '99-99 33rd St',
    'city' => 'Some City',
    'state' => 'NY',
    'postalCode' => '11101',
    'businessClassification' => '9ed3f670-7d6f-11e3-b1ce-5404a6144203',
    'businessType' => 'soleProprietorship',
    'businessName' => 'Jane Corp',
    'ein' => '00-0000000']);
?>
````

```ruby create_business_customer.rb
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
request_body = {
    :firstName => 'Business',
    :lastName => 'Owner',
    :email => 'solePropBusiness@email.com',
    :ipAddress => '143.156.7.8',
    :type => 'business',
    :dateOfBirth => '1980-01-31',
    :ssn => '6789',
    :address1 => '99-99 33rd St',
    :city => 'Some City',
    :state => 'NY',
    :postalCode => '11101',
    :businessClassification => '9ed3f670-7d6f-11e3-b1ce-5404a6144203',
    :businessType => 'soleProprietorship',
    :businessName => 'Jane Corp',
    :ein => '00-0000000'
}

customer = app_token.post "customers", request_body
customer.response_headers[:location] # => "https://api-sandbox.dwolla.com/customers/62c3aa1b-3a1b-46d0-ae90-17304d60c3d5"
```

```python create_business_customer.py
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python (Recommended)
request_body = {
  'firstName': 'Business',
  'lastName': 'Owner',
  'email': 'solePropBusiness@email.com',
  'ipAddress': '143.156.7.8',
  'type': 'business',
  'dateOfBirth': '1980-01-31',
  'ssn': '6789',
  'address1': '99-99 33rd St',
  'city': 'Some City',
  'state': 'NY',
  'postalCode': '11101',
  'businessClassification': '9ed3f670-7d6f-11e3-b1ce-5404a6144203',
  'businessType': 'soleProprietorship',
  'businessName': 'Jane Corp',
  'ein': '00-0000000'
}

customer = app_token.post('customers', request_body)
customer.headers['location'] # => 'https://api-sandbox.dwolla.com/customers/62c3aa1b-3a1b-46d0-ae90-17304d60c3d5'
```

```javascript create_business_customer.js
var requestBody = {
  firstName: "Business",
  lastName: "Owner",
  email: "solePropBusiness@email.com",
  ipAddress: "143.156.7.8",
  type: "business",
  dateOfBirth: "1980-01-31",
  ssn: "6789",
  address1: "99-99 33rd St",
  city: "Some City",
  state: "NY",
  postalCode: "11101",
  businessClassification: "9ed3f670-7d6f-11e3-b1ce-5404a6144203",
  businessType: "soleProprietorship",
  businessName: "Jane Corp",
  ein: "00-0000000",
};

dwolla.post("customers", requestBody).then(res => res.headers.get("location")); // => 'https://api-sandbox.dwolla.com/customers/62c3aa1b-3a1b-46d0-ae90-17304d60c3d5'
```

</CodeGroup>

## Create a business verified Customer with controller

#### Events

As a developer, you can expect these events to be triggered when a business verified Customer is successfully created and systematically verified:

1. `customer_created`
2. `customer_verified`

#### What parties are identity verified by Dwolla?

| Business Type   | Business Entity   | Controller        | Account Admin         |
| --------------- | ----------------- | ----------------- | --------------------- |
| **Corporation** | Identity verified | Identity verified | Not identity verified |
| **Partnership** | Identity verified | Identity verified | Not identity verified |
| **LLC**         | Identity verified | Identity verified | Not identity verified |

For all other `businessType`'s other than `soleProprietorship`, your Customer will need to provide more information for verification. In order to create a business verified Customer with a controller, Dwolla requires information on an account admin, the business, and the controller. Your business verified Customer account admin will act as the agent signing up on behalf of the business. When going through the Customer creation flow, your business verified Customer account admin will only need information on one controller to successfully complete the signup flow.

### Corporation, partnership, llc - Request parameters

| Parameter              | Required    | Type   | Description                                                                                                                                                                                             |
| ---------------------- | ----------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| firstName              | yes         | string | The legal first name of the **Account Admin** or individual signing up the business verified Customer. Must be **≤ 50 characters** and cannot include special characters ``[<>="`!?%~${}\]``.           |
| lastName               | yes         | string | The legal last name of the **Account Admin** or individual signing up the business verified Customer. Must be **≤ 50 characters** and cannot include special characters ``[<>="`!?%~${}\]``.            |
| email                  | yes         | string | Email address of the **Account Admin** creating and managing the Customer account. Must be a **valid email format** (e.g., `example@domain.com`).                                                       |
| ipAddress              | no          | string | IP address of the registering user. **Recommended** but not required.                                                                                                                                   |
| type                   | yes         | string | Must be **`business`**.                                                                                                                                                                                 |
| address1               | yes         | string | Street number and street name of the business' physical address. Must be **≤ 50 characters**, contain no special characters ``[<>="`!?%~${}\]``, and **cannot be a PO Box**.                            |
| address2               | no          | string | Apartment, floor, suite, bldg. # of business' physical address. Must be **≤ 50 characters** and cannot include special characters ``[<>="`!?%~${}\]``.                                                  |
| city                   | yes         | string | City of the business' physical address. Must be **≤ 50 characters** and cannot contain numbers or special characters ``[<>="`!?%~${}\]``.                                                               |
| state                  | yes         | string | **US Persons** - Must be a **valid two-letter US state/territory abbreviation** (e.g., `CA`). <br /> Reference: [US Postal Service guide](https://pe.usps.com/text/pub28/28apb.htm).                    |
| postalCode             | yes         | string | Business' **US ZIP Code**. Must be either **5 digits** (e.g., `50314`) or **ZIP+4** (e.g., `50314-1234`).                                                                                               |
| businessName           | yes         | string | Registered business name. Must be **≤ 255 characters** and cannot include special characters ``[<>="`!?%~${}\]``.                                                                                       |
| doingBusinessAs        | no          | string | Preferred business name – also known as a **fictitious name** or **assumed name**. Must be **≤ 255 characters** and cannot include special characters ``[<>="`!?%~${}\]``.                              |
| businessType           | yes         | string | Business structure. **Accepted values:** `corporation`, `llc`, `partnership`.                                                                                                                           |
| businessClassification | yes         | string | The **industry classification ID** corresponding to the Customer's business. <br /> Reference: [Business Classifications](/docs/api-reference/customers/list-business-classifications).                 |
| ein                    | yes         | string | **Employer Identification Number (EIN)**. Must be **9 numeric characters** (e.g., `123456789`). <br /> **Note:** If `businessType` is `soleProprietorship`, then `ein` and `controller` can be omitted. |
| website                | no          | string | Business' website. Must be a **valid URL** (e.g., `https://www.domain.com`).                                                                                                                            |
| phone                  | no          | string | Business's **10-digit phone number**. Must contain **only numbers** (e.g., `3334447777`). **No hyphens, spaces, or separators**.                                                                        |
| controller             | conditional | object | A **Controller JSON object**. <br /> **Required** unless `businessType` is `soleProprietorship`.                                                                                                        |

##### Controller JSON object

| Parameter   | Required    | Type   | Description                                                                                                                                                                                                                                |
| ----------- | ----------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| firstName   | yes         | string | The **legal first name** of the Controller. Must be **≤ 50 characters** and cannot include special characters ``[<>="`!?%~${}\]``.                                                                                                         |
| lastName    | yes         | string | The **legal last name** of the Controller. Must be **≤ 50 characters** and cannot include special characters ``[<>="`!?%~${}\]``.                                                                                                          |
| title       | yes         | string | **Job title** of the Controller. Examples: `Chief Financial Officer`, `Managing Director`. Must be **≤ 100 characters** and cannot contain numbers or special characters ``[<>="`!?%~${}\]``.                                              |
| dateOfBirth | yes         | string | **Controller's date of birth** in `YYYY-MM-DD` format. Must be between **18 to 125 years old**.                                                                                                                                            |
| ssn         | conditional | string | **Last four digits** or **full 9-digit** Social Security Number (SSN). <br /> **Required for US residents**. <br /> If omitted, a **passport object** is required.                                                                         |
| address     | yes         | object | A **Controller Address JSON Object** containing the Controller's full physical address. <br /> **Reference:** [Controller Address JSON Object](#controller-address-json-object).                                                           |
| passport    | conditional | object | A **Controller Passport JSON Object**. <br /> **Required for non-US individuals**. Includes **Passport Identification Number** and **Country**. <br /> **Reference:** [Controller Passport JSON Object](#controller-passport-json-object). |

##### Controller address JSON object

| Parameter           | Required    | Type   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------------- | ----------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| address1            | yes         | string | **Street number and name** of Controller's physical address. <br /> **Must be ≤ 50 characters**. <br /> **Cannot contain special characters** ``[<>="`!?%~${}\]``. <br /> **PO Boxes are not allowed**.                                                                                                                                                                                                                                                                        |
| address2            | no          | string | **Apartment, floor, suite, or building number** of Controller's physical address. <br /> **Must be ≤ 50 characters**. <br /> **Cannot contain special characters** ``[<>="`!?%~${}\]``. <br /> **PO Boxes are not allowed**.                                                                                                                                                                                                                                                   |
| address3            | no          | string | **Third line of the address**, if applicable. <br /> **Must be ≤ 50 characters**. <br /> **Cannot contain special characters** ``[<>="`!?%~${}\]``. <br /> **PO Boxes are not allowed**.                                                                                                                                                                                                                                                                                       |
| city                | yes         | string | **City name** of Controller's physical address. <br /> **Must be ≤ 50 characters**. <br /> **Cannot contain numbers or special characters** ``[<>="`!?%~${}\]``.                                                                                                                                                                                                                                                                                                               |
| stateProvinceRegion | yes         | string | **US Persons** - **Two-letter US state abbreviation**. See the [US Postal Service guide](https://pe.usps.com/text/pub28/28apb.htm). <br /> **Non-US Persons** - **Two-letter ISO abbreviation for state, province, or region**. See the [ISO guide](https://en.wikipedia.org/wiki/ISO_3166-1). <br /> **If a country does not have a two-letter abbreviation for a state/province, use the country's two-letter ISO code instead**. <br /> **Must be uppercase** (e.g., `CA`). |
| postalCode          | conditional | string | **US Persons** - **Must provide a 5-digit ZIP code** (e.g., `12345`) or **ZIP+4 code** (e.g., `12345-6789`). <br /> **Non-US Persons** - Optional. Can include alphanumeric postal codes where applicable.                                                                                                                                                                                                                                                                     |
| country             | yes         | string | **Two-letter ISO country code** (e.g., `US` for United States, `CA` for Canada). <br /> Reference the [ISO country codes list](https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes).                                                                                                                                                                                                                                                                                  |

##### Controller passport JSON object

| Parameter | Required    | Type   | Description                                                                                                                                      |
| --------- | ----------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| number    | conditional | string | **Required** if the controller is a **non-US person** and does **not** have a Social Security Number (SSN). <br /> **Must be ≤ 255 characters**. |
| country   | conditional | string | **Country where the passport was issued**. <br /> **Must be a two-letter ISO country code** (e.g., `GB` for United Kingdom, `IN` for India).     |

Once you submit this request, Dwolla will perform some initial validation to check for formatting issues such as an invalid date of birth, invalid email format, etc. If successful, the response will be a HTTP 201/Created with the URL of the new Customer resource contained in the Location header.

#### Business with Controller - Request and response

<CodeGroup>
  ```bash HTTP
  POST https://api-sandbox.dwolla.com/customers
  Content-Type: application/vnd.dwolla.v1.hal+json
  Accept: application/vnd.dwolla.v1.hal+json
  Authorization: Bearer 0Sn0W6kzNic+oWhDbQcVSKLRUpGjIdl/YyrHqrDDoRnQwE7Q

{
"firstName": "Account",
"lastName": "Admin",
"email": "accountAdmin@email.com",
"ipAddress": "143.156.7.8",
"type": "business",
"address1": "99-99 33rd St",
"city": "Some City",
"state": "NY",
"postalCode": "11101",
"controller": {
"firstName": "John",
"lastName": "Controller",
"title": "CEO",
"ssn": "6789",
"dateOfBirth": "1980-01-31",
"address": {
"address1": "1749 18th st",
"address2": "apt 12",
"city": "Des Moines",
"stateProvinceRegion": "IA",
"postalCode": "50266",
"country": "US"
}
},
"businessClassification": "9ed3f670-7d6f-11e3-b1ce-5404a6144203",
"businessType": "llc",
"businessName":"Jane Corp",
"ein":"00-0000000"
}

HTTP/1.1 201 Created
Location: https://api-sandbox.dwolla.com/customers/62c3aa1b-3a1b-46d0-ae90-17304d60c3d5

````

```php create_business_customer.php
<?php
$customersApi = new DwollaSwagger\CustomersApi($apiClient);
$new_customer = $customersApi->create([
  'firstName' => 'Account',
  'lastName' => 'Admin',
  'email' => 'accountAdmin@email.com',
  'type' => 'business',
  'address1' => '99-99 33rd St',
  'city' => 'Some City',
  'state' => 'NY',
  'postalCode' => '11101',
  'controller' =>
  [
      'firstName' => 'John',
      'lastName'=> 'Controller',
      'title' => 'CEO',
      'dateOfBirth' => '1990-01-31',
      'ssn' => '1234',
      'address' =>
      [
          'address1' => '18749 18th st',
          'address2' => 'apt 12',
          'city' => 'Des Moines',
          'stateProvinceRegion' => 'IA',
          'postalCode' => '50265',
          'country' => 'US'
      ],
  ],
  'phone' => '5554321234',
  'businessClassification' => '9ed3f670-7d6f-11e3-b1ce-5404a6144203',
  'businessType' => 'llc',
  'businessName' => 'Jane Corp',
  'ein' => '00-0000000']);

?>
````

```ruby create_business_customer.rb
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
request_body = {
  :firstName => 'Account',
  :lastName => 'Admin',
  :email => 'accountAdmin@email.com',
  :type => 'business',
  :address1 => '99-99 33rd St',
  :city => 'Some City',
  :state => 'NY',
  :postalCode => '11101',
  :controller => {
      :firstName => 'John',
      :lastName => 'Controller',
      :title => 'CEO',
      :dateOfBirth => '1980-01-31',
      :ssn => '1234',
      :address => {
        :address1 => '1749 18th st',
        :address2 => 'apt 12',
        :city => 'Des Moines',
        :stateProvinceRegion => 'IA',
        :postalCode => '50266',
        :country => 'US',
      }
  },
  :businessClassification => '9ed38155-7d6f-11e3-83c3-5404a6144203',
  :businessType => 'llc',
  :businessName => 'Jane Corp',
  :ein => '12-3456789'
}

customer = app_token.post "customers", request_body
customer.response_headers[:location] # => "https://api-sandbox.dwolla.com/customers/62c3aa1b-3a1b-46d0-ae90-17304d60c3d5"
```

```python create_business_customer.py
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python (Recommended)
request_body = {
  'firstName': 'Account',
  'lastName': 'Admin',
  'email': 'accountAdmin@email.com',
  'type': 'business',
  'address1': '99-99 33rd St',
  'city': 'Some City',
  'state': 'NY',
  'postalCode': '11101',
  'controller': {
      'firstName': 'John',
      'lastName': 'Controller',
      'title': 'CEO',
      'dateOfBirth': '1980-01-31',
      'ssn': '1234',
      'address': {
        'address1': '1749 18th st',
        'address2': 'apt12',
        'city': 'Des Moines',
        'stateProvinceRegion': 'IA',
        'postalCode': '50266',
        'country': 'US'
      }
  },
  'businessClassification': '9ed38155-7d6f-11e3-83c3-5404a6144203',
  'businessType': 'llc',
  'businessName': 'Jane Corp',
  'ein': '12-3456789'
}

customer = app_token.post('customers', request_body)
customer.headers['location'] # => 'https://api-sandbox.dwolla.com/customers/62c3aa1b-3a1b-46d0-ae90-17304d60c3d5'
```

```javascript createBusinessCustomer.js
var requestBody = {
  firstName: "Account",
  lastName: "Admin",
  email: "accountAdmin@email.com",
  type: "business",
  address1: "99-99 33rd St",
  city: "Some City",
  state: "NY",
  postalCode: "11101",
  controller: {
    firstName: "John",
    lastName: "Controller",
    title: "CEO",
    dateOfBirth: "1980-01-31",
    ssn: "1234",
    address: {
      address1: "1749 18th st",
      address2: "apt 12",
      city: "Des Moines",
      stateProvinceRegion: "IA",
      postalCode: "50266",
      country: "US",
    },
  },
  businessClassification: "9ed38155-7d6f-11e3-83c3-5404a6144203",
  businessType: "llc",
  businessName: "Jane Corp",
  ein: "12-3456789",
};

dwolla.post("customers", requestBody).then(res => res.headers.get("location")); // => 'https://api-sandbox.dwolla.com/customers/62c3aa1b-3a1b-46d0-ae90-17304d60c3d5'
```

</CodeGroup>

## Check the status of the business Customer

You have created a business verified Customer; however, the successful creation of a business verified Customer doesn't necessarily mean the Customer account is verified. Businesses may need to provide additional information to help verify their identity. It is important to check the status of the business Customer to determine if additional documentation is needed.

#### Request and response

<CodeGroup>
  ```bash HTTP [expandable]
  GET https://api-sandbox.dwolla.com/customers/62c3aa1b-3a1b-46d0-ae90-17304d60c3d5
  Accept: application/vnd.dwolla.v1.hal+json
  Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

...

{
"\_links": {
"verify-beneficial-owners": {
"href": "https://api-sandbox.dwolla.com/customers/d56c07fa-3832-427d-bb88-a9eb2d375c14/beneficial-owners",
"type": "application/vnd.dwolla.v1.hal+json",
"resource-type": "beneficial-owner"
},
"beneficial-owners": {
"href": "https://api-sandbox.dwolla.com/customers/d56c07fa-3832-427d-bb88-a9eb2d375c14/beneficial-owners",
"type": "application/vnd.dwolla.v1.hal+json",
"resource-type": "beneficial-owner"
},
"deactivate": {
"href": "https://api-sandbox.dwolla.com/customers/d56c07fa-3832-427d-bb88-a9eb2d375c14",
"type": "application/vnd.dwolla.v1.hal+json",
"resource-type": "customer"
},
"self": {
"href": "https://api-sandbox.dwolla.com/customers/d56c07fa-3832-427d-bb88-a9eb2d375c14",
"type": "application/vnd.dwolla.v1.hal+json",
"resource-type": "customer"
},
"receive": {
"href": "https://api-sandbox.dwolla.com/transfers",
"type": "application/vnd.dwolla.v1.hal+json",
"resource-type": "transfer"
},
"edit-form": {
"href": "https://api-sandbox.dwolla.com/customers/d56c07fa-3832-427d-bb88-a9eb2d375c14",
"type": "application/vnd.dwolla.v1.hal+json; profile=\"https://github.com/dwolla/hal-forms\"",
"resource-type": "customer"
},
"edit": {
"href": "https://api-sandbox.dwolla.com/customers/d56c07fa-3832-427d-bb88-a9eb2d375c14",
"type": "application/vnd.dwolla.v1.hal+json",
"resource-type": "customer"
},
"certify-beneficial-ownership": {
"href": "https://api-sandbox.dwolla.com/customers/d56c07fa-3832-427d-bb88-a9eb2d375c14/beneficial-ownership",
"type": "application/vnd.dwolla.v1.hal+json",
"resource-type": "beneficial-ownership"
},
"funding-sources": {
"href": "https://api-sandbox.dwolla.com/customers/d56c07fa-3832-427d-bb88-a9eb2d375c14/funding-sources",
"type": "application/vnd.dwolla.v1.hal+json",
"resource-type": "funding-source"
},
"transfers": {
"href": "https://api-sandbox.dwolla.com/customers/d56c07fa-3832-427d-bb88-a9eb2d375c14/transfers",
"type": "application/vnd.dwolla.v1.hal+json",
"resource-type": "transfer"
}
},
"id": "d56c07fa-3832-427d-bb88-a9eb2d375c14",
"firstName": "Account",
"lastName": "Admin",
"email": "accountAdmin@email.com",
"type": "business",
"status": "verified",
"created": "2018-04-26T19:11:41.290Z",
"address1": "99-99 33rd St",
"city": "Some City",
"state": "NY",
"postalCode": "11101",
"businessName": "Jane Corp",
"controller": {
"firstName": "John",
"lastName": "Controller",
"title": "CEO",
"address": {
"address1": "1749 18th st",
"address2": "apt 12",
"city": "Des Moines",
"stateProvinceRegion": "IA",
"country": "US",
"postalCode": "50266"
}
},
"businessType": "llc",
"businessClassification": "9ed3f670-7d6f-11e3-b1ce-5404a6144203"
}

````

```php retrieve_customer.php
<?php
$customerUrl = 'https://api-sandbox.dwolla.com/customers/62c3aa1b-3a1b-46d0-ae90-17304d60c3d5';

$customersApi = new DwollaSwagger\CustomersApi($apiClient);

$customer = $customersApi->getCustomer($customerUrl);
$customer->status; # => "verified"
?>
````

```ruby retrieve_customer.rb
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
customer_url = 'https://api-sandbox.dwolla.com/customers/62c3aa1b-3a1b-46d0-ae90-17304d60c3d5'

customer = app_token.get customer_url
customer.status # => "verified"
```

```python retrieve_customer.py
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python (Recommended)
customer_url = 'https://api-sandbox.dwolla.com/customers/62c3aa1b-3a1b-46d0-ae90-17304d60c3d5'

customer = app_token.get(customer_url)
customer.body['status']
```

```javascript retrieveCustomer.js
var customerUrl = "https://api-sandbox.dwolla.com/customers/62c3aa1b-3a1b-46d0-ae90-17304d60c3d5";

dwolla.get(customerUrl).then(res => res.body.status); // => 'verified'
```

</CodeGroup>

You will want to ensure that both your Controller and your Business have been verified, as the Customer will be unable to send or receive funds until then. If the Customer is in `retry` or `document` status, head to the next step to learn how to handle these statuses.

# Step 2 - Handling Business Verified Customer Statuses

You have successfully created a business verified Customer; however, there are cases where Dwolla will need more information to fully verify the identity of the Controller and/or Business. Read on to learn more.

<Info>
  If your Business and Controller are already identity verified, you can skip to the next step<a href="#step-3-adding-beneficial-owners"> adding beneficial owners</a> to continue with your business verified Customer onboarding.
</Info>

#### Verification statuses and corresponding events

As a developer, you will want to handle the various Customer statuses that can be returned.

| Customer status | Event Topic Name                      | Transaction restricted?            | Description                                                                                                                                                                                                                                                                                                                                                                                           |
| --------------- | ------------------------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| verified        | customer_verified                     | No                                 | The identifying information submitted was sufficient in verifying the Customer account.                                                                                                                                                                                                                                                                                                               |
| retry           | customer_reverification_needed        | Yes - Cannot send funds            | The initial identity verification attempt failed because the information provided did not satisfy Dwolla's verification check. You can make one additional attempt by changing some or all the attributes of the existing Customer with a POST request. All fields are required on the retry attempt. If the additional attempt fails, the resulting status will be either `document` or `suspended`. |
| document        | customer_verification_document_needed | Yes - Cannot send funds            | Dwolla requires additional documentation to identify the Customer in the document status. Once a document is uploaded it will be reviewed for verification.                                                                                                                                                                                                                                           |
| suspended       | customer_suspended                    | Yes - Cannot send or receive funds | The Customer is suspended and may neither send nor receive funds. Contact Account Management for more information.                                                                                                                                                                                                                                                                                    |

## Handling `retry` status

A `retry` status occurs when a Customer's identity scores are too low during a verification attempt. Typically, a `retry` status occurs after the initial creation of a business-verified customer, however, a customer can also be placed into a retry status via the Dwolla Dashboard if the customer is in a `document` status. When the customer is in the `retry` status, your application needs to re-initiate the verification process by prompting the user via a form to resubmit their identifying information.

<Warning>
  You need to gather new information if the Customer is placed into the{" "}
  <code>retry</code> status; simply passing the same information will result in
  the same insufficient scores.
</Warning>

#### Determining information needed to retry verification

When a business verified Customer is placed in the `retry` verification status, Dwolla will return a link in the API response after [retrieving a Customer](/docs/api-reference/customers/retrieve-a-customer). The retry link contained within the `_links` object of the response helps your application determine if a retry is needed and what type of retry is required. What data you need to request from the customer depends on the retry scenario:

- **Business-only retry**: A `retry-verification` link is returned. Include all fields required during initial customer but **omit** Controller information. For business verified Customers with Controllers, different links can be returned depending on whether retry is needed for just the business, or both the Controller and business.

- **Controller and business retry**: A `retry-with-full-ssn` link is returned. If the Controller information needs to be retried, all fields that were required in the initial Customer creation attempt will be required in the retry attempt, along with **the full 9-digit SSN** of the Controller in order to give our identity vendor more information in an attempt to receive a sufficient score to approve the Customer account ([see example request below](#business-with-controller-retry-with-full-ssn---request-and-response)).

##### Understanding \_embedded errors

Additionally, `_embedded` errors are included in the Customer resource which include information about the next steps required to get the Customer verified (see example response below). Refer to the table below for the list of possible links and their descriptions.

| Link name           | Description                                                                     |
| ------------------- | ------------------------------------------------------------------------------- |
| retry-verification  | Identifies if retry information is needed for the business.                     |
| retry-with-full-ssn | Identifies if retry information is needed for both the Controller and business. |

##### Example response

```json
{
  "_links": {
    "self": {
      "href": "https://api-sandbox.dwolla.com/customers/20c2d8e2-8ccf-42fd-bd9e-757c396f342d",
      "type": "application/vnd.dwolla.v1.hal+json",
      "resource-type": "customer"
    },
    "retry-verification": {
      "href": "https://api-sandbox.dwolla.com/customers/20c2d8e2-8ccf-42fd-bd9e-757c396f342d",
      "type": "application/vnd.dwolla.v1.hal+json",
      "resource-type": "customer"
    },
    "retry-with-full-ssn": {
      "href": "https://api-sandbox.dwolla.com/customers/20c2d8e2-8ccf-42fd-bd9e-757c396f342d",
      "type": "application/vnd.dwolla.v1.hal+json",
      "resource-type": "customer"
    }
  },
  "_embedded": {
    "errors": [
      {
        "code": "Required",
        "message": "Full SSN required",
        "path": "",
        "_links": {
          "retry-with-full-ssn": {
            "href": "https://api-sandbox.dwolla.com/customers/20c2d8e2-8ccf-42fd-bd9e-757c396f342d",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "customer"
          }
        }
      }
    ]
  },
  "id": "20c2d8e2-8ccf-42fd-bd9e-757c396f342d",
  "firstName": "Account",
  "lastName": "Admin",
  "email": "accountAdmin@email.com",
  "type": "business",
  "status": "retry",
  "created": "2024-02-20T22:53:00.727Z",
  "address1": "9876 Million Dollar St",
  "address2": "Unit 123",
  "city": "Des Moines",
  "state": "IA",
  "postalCode": "50265",
  "phone": "5555555555",
  "businessName": "Jane Corp",
  "doingBusinessAs": "This is the DBA name",
  "website": "https://www.dwolla.com",
  "correlationId": "CID-bc3b6cd8-fca0-471d-b6f2-4b10abb20956",
  "controller": {
    "firstName": "Jane",
    "lastName": "Doe",
    "title": "CEO",
    "address": {
      "address1": "1749 18th st",
      "address2": "apt 12",
      "address3": "Ste 123",
      "city": "Des Moines",
      "stateProvinceRegion": "IA",
      "country": "US",
      "postalCode": "50266"
    }
  },
  "businessType": "llc",
  "businessClassification": "9ed38155-7d6f-11e3-83c3-5404a6144203"
}
```

### Sole Proprietorship (`retry-verification`) - Request and response

<CodeGroup>
  ```bash
  POST https://api-sandbox.dwolla.com/customers/62c3aa1b-3a1b-46d0-ae90-17304d60c3d5
  Content-Type: application/vnd.dwolla.v1.hal+json
  Accept: application/vnd.dwolla.v1.hal+json
  Authorization: Bearer 0Sn0W6kzNic+oWhDbQcVSKLRUpGjIdl/YyrHqrDDoRnQwE7Q

{
"firstName": "Business",
"lastName": "Owner",
"email": "solePropBusiness@email.com",
"ipAddress": "143.156.7.8",
"type": "business",
"dateOfBirth": "1980-01-31",
"ssn": "123-45-6789",
"address1": "99-99 33rd St",
"city": "Some City",
"state": "NY",
"postalCode": "11101",
"businessClassification": "9ed3f670-7d6f-11e3-b1ce-5404a6144203",
"businessType": "soleProprietorship",
"businessName":"Jane Corp",
"ein":"00-0000000"
}

````

```php
<?php
$customersApi = new DwollaSwagger\CustomersApi($apiClient);
$customerUrl = 'https://api.dwolla.com/customers/62c3aa1b-3a1b-46d0-ae90-17304d60c3d5';
$retryCustomer = $customersApi->updateCustomer([
    'firstName' => 'Business',
    'lastName' => 'Owner',
    'email' => 'solePropBusiness@email.com',
    'ipAddress' => '143.156.7.8',
    'type' => 'business',
    'dateOfBirth' => '1980-01-31',
    'ssn' => '123-45-6789',
    'address1' => '99-99 33rd St',
    'city' => 'Some City',
    'state' => 'NY',
    'postalCode' => '11101',
    'businessClassification' => '9ed3f670-7d6f-11e3-b1ce-5404a6144203',
    'businessType' => 'soleProprietorship',
    'businessName' => 'Jane Corp',
    'ein' => '00-0000000'], $customerUrl);

?>
````

```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
request_body = {
    :firstName => 'Business',
    :lastName => 'Owner',
    :email => 'solePropBusiness@email.com',
    :ipAddress => '143.156.7.8',
    :type => 'business',
    :dateOfBirth => '1980-01-31',
    :ssn => '123-45-6789',
    :address1 => '99-99 33rd St',
    :city => 'Some City',
    :state => 'NY',
    :postalCode => '11101',
    :businessClassification => '9ed3f670-7d6f-11e3-b1ce-5404a6144203',
    :businessType => 'soleProprietorship',
    :businessName => 'Jane Corp',
    :ein => '00-0000000'
}

customer = app_token.post customer_url, request_body
customer.id # => "62c3aa1b-3a1b-46d0-ae90-17304d60c3d5"
```

```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python (Recommended)
request_body = {
  'firstName': 'Business',
  'lastName': 'Owner',
  'email': 'solePropBusiness@email.com',
  'ipAddress': '143.156.7.8',
  'type': 'business',
  'dateOfBirth': '1980-01-31',
  'ssn': '123-45-6789',
  'address1': '99-99 33rd St',
  'city': 'Some City',
  'state': 'NY',
  'postalCode': '11101',
  'businessClassification': '9ed3f670-7d6f-11e3-b1ce-5404a6144203',
  'businessType': 'soleProprietorship',
  'businessName': 'Jane Corp',
  'ein': '00-0000000'
}

customer = app_token.post(customer_url, request_body)
customer.body.id # => '62c3aa1b-3a1b-46d0-ae90-17304d60c3d5'
```

```javascript
var customerUrl = "https://api.dwolla.com/customers/62c3aa1b-3a1b-46d0-ae90-17304d60c3d5";
var requestBody = {
  firstName: "Business",
  lastName: "Owner",
  email: "solePropBusiness@email.com",
  ipAddress: "143.156.7.8",
  type: "business",
  dateOfBirth: "1980-01-31",
  ssn: "123-45-6789",
  address1: "99-99 33rd St",
  city: "Some City",
  state: "NY",
  postalCode: "11101",
  businessClassification: "9ed3f670-7d6f-11e3-b1ce-5404a6144203",
  businessType: "soleProprietorship",
  businessName: "Jane Corp",
  ein: "00-0000000",
};

dwolla.post("customers", requestBody).then(res => res.headers.get("location")); // => 'https://api-sandbox.dwolla.com/customers/62c3aa1b-3a1b-46d0-ae90-17304d60c3d5'
```

</CodeGroup>

### Business with Controller (`retry-verification`) - Request and response

<CodeGroup>
  ```bash
  POST https://api-sandbox.dwolla.com/customers/62c3aa1b-3a1b-46d0-ae90-17304d60c3d5
  Content-Type: application/vnd.dwolla.v1.hal+json
  Accept: application/vnd.dwolla.v1.hal+json
  Authorization: Bearer 0Sn0W6kzNic+oWhDbQcVSKLRUpGjIdl/YyrHqrDDoRnQwE7Q

{
"firstName": "Jane",
"lastName": "Merchant",
"email": "accountAdmin@email.com",
"ipAddress": "143.156.7.8",
"type": "business",
"address1": "123 Corrected Address St",
"city": "Some City",
"state": "NY",
"postalCode": "11101",
"businessClassification": "9ed3f670-7d6f-11e3-b1ce-5404a6144203",
"businessType": "llc",
"businessName":"Jane Corp",
"ein":"00-0000000"
}

````

```php
<?php
$customersApi = new DwollaSwagger\CustomersApi($apiClient);
$customerUrl = 'https://api-sandbox.dwolla.com/customers/b70c3194-35fa-49e8-9243-d55a30e06d1e';
$retryCustomer = $customersApi->updateCustomer([
  'firstName' => 'Jane',
  'lastName' => 'Merchant',
  'email' => 'accountAdmin@email.com',
  'type' => 'business',
  'address1' => '123 Corrected Address St',
  'city' => 'Some City',
  'state' => 'NY',
  'postalCode' => '11101',
  'phone' => '5554321234',
  'businessClassification' => '9ed3f670-7d6f-11e3-b1ce-5404a6144203',
  'businessType' => 'llc',
  'businessName' => 'Jane Corp',
  'ein' => '00-0000000'], $customerUrl);

?>
````

```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
customer_url = 'https://api.dwolla.com/customers/62c3aa1b-3a1b-46d0-ae90-17304d60c3d5'
request_body = {
  :firstName => 'Jane',
  :lastName => 'Merchant',
  :email => 'accountAdmin@email.com',
  :type => 'business',
  :address1 => '123 Corrected Address St',
  :city => 'Some City',
  :state => 'NY',
  :postalCode => '11101',
  :businessClassification => '9ed38155-7d6f-11e3-83c3-5404a6144203',
  :businessType => 'llc',
  :businessName => 'Jane Corp',
  :ein => '12-3456789'
}

customer = app_token.post customer_url, request_body
customer.id # => "62c3aa1b-3a1b-46d0-ae90-17304d60c3d5"
```

```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python (Recommended)
customer_url = 'https://api.dwolla.com/customers/62c3aa1b-3a1b-46d0-ae90-17304d60c3d5'
request_body = {
  'firstName': 'Jane',
  'lastName': 'Merchant',
  'email': 'accountAdmin@email.com',
  'type': 'business',
  'address1': '123 Corrected Address St',
  'city': 'Some City',
  'state': 'NY',
  'postalCode': '11101',
  'businessClassification': '9ed38155-7d6f-11e3-83c3-5404a6144203',
  'businessType': 'llc',
  'businessName': 'Jane Corp',
  'ein': '12-3456789'
}

customer = app_token.post(customer_url, request_body)
customer.body.id # => '62c3aa1b-3a1b-46d0-ae90-17304d60c3d5'
```

```javascript
var customerUrl = "https://api.dwolla.com/customers/62c3aa1b-3a1b-46d0-ae90-17304d60c3d5";
var requestBody = {
  firstName: "Jane",
  lastName: "Merchant",
  email: "accountAdmin@email.com",
  type: "business",
  address1: "123 Corrected Address St",
  city: "Some City",
  state: "NY",
  postalCode: "11101",
  businessClassification: "9ed38155-7d6f-11e3-83c3-5404a6144203",
  businessType: "llc",
  businessName: "Jane Corp",
  ein: "12-3456789",
};

dwolla.post(customerUrl, requestBody).then(function (res) {
  res.body.id; // => '62c3aa1b-3a1b-46d0-ae90-17304d60c3d5'
});
```

</CodeGroup>

### Business with Controller (`retry-with-full-ssn`) - Request and response

<CodeGroup>
  ```bash
  POST https://api-sandbox.dwolla.com/customers/62c3aa1b-3a1b-46d0-ae90-17304d60c3d5
  Content-Type: application/vnd.dwolla.v1.hal+json
  Accept: application/vnd.dwolla.v1.hal+json
  Authorization: Bearer 0Sn0W6kzNic+oWhDbQcVSKLRUpGjIdl/YyrHqrDDoRnQwE7Q

{
"firstName": "Jane",
"lastName": "Merchant",
"email": "accountAdmin@email.com",
"ipAddress": "143.156.7.8",
"type": "business",
"address1": "123 Corrected Address St",
"city": "Some City",
"state": "NY",
"postalCode": "11101",
"controller": {
"firstName": "John",
"lastName": "Controller",
"title": "CEO",
"dateOfBirth": "1980-01-01",
"ssn": "123-45-6789",
"address": {
"address1": "1749 18th st",
"address2": "apt 12",
"city": "Des Moines",
"stateProvinceRegion": "IA",
"postalCode": "50266",
"country": "US"
}
},
"businessClassification": "9ed3f670-7d6f-11e3-b1ce-5404a6144203",
"businessType": "llc",
"businessName":"Jane Corp",
"ein":"00-0000000"
}

````

```php
<?php
$customersApi = new DwollaSwagger\CustomersApi($apiClient);
$customerUrl = 'https://api-sandbox.dwolla.com/customers/b70c3194-35fa-49e8-9243-d55a30e06d1e';
$retryCustomer = $customersApi->updateCustomer([
  'firstName' => 'Jane',
  'lastName' => 'Merchant',
  'email' => 'accountAdmin@email.com',
  'type' => 'business',
  'address1' => '123 Corrected Address St',
  'city' => 'Some City',
  'state' => 'NY',
  'postalCode' => '11101',
  'controller' =>
  [
      'firstName' => 'John',
      'lastName'=> 'Controller',
      'title' => 'CEO',
      'dateOfBirth' => '1990-10-10',
      'ssn' => '123-45-6789',
      'address' =>
      [
          'address1' => '18749 18th st',
          'address2' => 'apt 12',
          'city' => 'Des Moines',
          'stateProvinceRegion' => 'IA',
          'postalCode' => '50265',
          'country' => 'US'
      ],
  ],
  'phone' => '5554321234',
  'businessClassification' => '9ed3f670-7d6f-11e3-b1ce-5404a6144203',
  'businessType' => 'llc',
  'businessName' => 'Jane Corp',
  'ein' => '00-0000000'], $customerUrl);

?>
````

```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
customer_url = 'https://api.dwolla.com/customers/62c3aa1b-3a1b-46d0-ae90-17304d60c3d5'
request_body = {
  :firstName => 'Jane',
  :lastName => 'Merchant',
  :email => 'accountAdmin@email.com',
  :type => 'business',
  :address1 => '123 Corrected Address St',
  :city => 'Some City',
  :state => 'NY',
  :postalCode => '11101',
  :controller => {
      :firstName => 'John',
      :lastName => 'Controller',
      :title => 'CEO',
      :dateOfBirth => '1980-01-01',
      :ssn => '123-45-6789'
      :address => {
        :address1 => '1749 18th st',
        :address2 => 'apt 12',
        :city => 'Des Moines',
        :stateProvinceRegion => 'IA',
        :postalCode => '50266',
        :country => 'US'
      }
  },
  :businessClassification => '9ed38155-7d6f-11e3-83c3-5404a6144203',
  :businessType => 'llc',
  :businessName => 'Jane Corp',
  :ein => '12-3456789'
}

customer = app_token.post customer_url, request_body
customer.id # => "62c3aa1b-3a1b-46d0-ae90-17304d60c3d5"
```

```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python (Recommended)
customer_url = 'https://api.dwolla.com/customers/62c3aa1b-3a1b-46d0-ae90-17304d60c3d5'
request_body = {
  'firstName': 'Jane',
  'lastName': 'Merchant',
  'email': 'accountAdmin@email.com',
  'type': 'business',
  'address1': '123 Corrected Address St',
  'city': 'Some City',
  'state': 'NY',
  'postalCode': '11101',
  'controller': {
      'firstName': 'John',
      'lastName': 'Controller',
      'title': 'CEO',
      'dateOfBirth': '1980-01-01',
      'ssn': '123-45-6789',
      'address': {
        'address1': '1749 18th st',
        'address2': 'apt12',
        'city': 'Des Moines',
        'stateProvinceRegion': 'IA',
        'postalCode': '50266',
        'country': 'US'
      }
  },
  'businessClassification': '9ed38155-7d6f-11e3-83c3-5404a6144203',
  'businessType': 'llc',
  'businessName': 'Jane Corp',
  'ein': '12-3456789'
}

customer = app_token.post(customer_url, request_body)
customer.body.id # => '62c3aa1b-3a1b-46d0-ae90-17304d60c3d5'
```

```javascript
var customerUrl = "https://api.dwolla.com/customers/62c3aa1b-3a1b-46d0-ae90-17304d60c3d5";
var requestBody = {
  firstName: "Jane",
  lastName: "Merchant",
  email: "accountAdmin@email.com",
  type: "business",
  address1: "123 Corrected Address St",
  city: "Some City",
  state: "NY",
  postalCode: "11101",
  controller: {
    firstName: "John",
    lastName: "Controller",
    title: "CEO",
    dateOfBirth: "1980-01-01",
    ssn: "123-45-6789",
    address: {
      address1: "1749 18th st",
      address2: "apt 12",
      city: "Des Moines",
      stateProvinceRegion: "IA",
      postalCode: "50266",
      country: "US",
    },
  },
  businessClassification: "9ed38155-7d6f-11e3-83c3-5404a6144203",
  businessType: "llc",
  businessName: "Jane Corp",
  ein: "12-3456789",
};

dwolla.post(customerUrl, requestBody).then(function (res) {
  res.body.id; // => '62c3aa1b-3a1b-46d0-ae90-17304d60c3d5'
});
```

</CodeGroup>

## Handling `document` status

If the Customer has a status of `document`, the Customer will need to upload additional pieces of information in order to verify the account. Use the [create a document](/docs/api-reference/documents/create-a-document-for-customer) endpoint when uploading a colored camera captured image of the identifying document. The document(s) will then be reviewed by Dwolla; this review may take up to 1-2 business days to approve or reject.

You can provide the following best practices to the Customer in order to reduce the chances of a document being rejected:

- Only images of the front of an ID
- All 4 edges of the document should be visible
- A dark/high contrast background should be used
- At least 90% of the image should be the document
- Should be at least 300dpi
- Capture image from directly above the document
- Make sure that the image is properly aligned, not rotated, tilted or skewed
- No flash to reduce glare
- No black and white documents
- No expired IDs

#### Determining verification documents needed

When a business verified Customer is placed in the `document` verification status, Dwolla will return a link in the API response after [retrieving a Customer](/docs/api-reference/customers/retrieve-a-customer), which will be used by an application to determine if documentation is needed. For business verified Customers, different links can be returned depending on whether or not documents are needed for a Controller, the business, both the Controller and business, or for the DBA (Doing Business As). Additionally, embedded errors are included in the Customer resource which include information about the next steps required to get the Customer verified (see example response below). Refer to the table below for the list of possible links and their description. Refer to the [acceptable document types](#document-types) section for more information on what types of documents are accepted for businesses and Controllers.

| Link name                                    | Description                                                                  |
| -------------------------------------------- | ---------------------------------------------------------------------------- |
| verify-with-document                         | Identifies if documents are needed only for a Controller.                    |
| verify-business-with-document                | Identifies if documents are needed only for a business.                      |
| verify-controller-and-business-with-document | Identifies if documents are needed for both the Controller and business.     |
| upload-dba-document                          | Identifies if documents are needed for a business's DBA (Doing Business As). |

##### Example response

```json
{
  "_links": {
    "self": {
      "href": "https://api-sandbox.dwolla.com/customers/41432759-6d65-42e5-a6be-400ddd103b78",
      "type": "application/vnd.dwolla.v1.hal+json",
      "resource-type": "customer"
    },
    "document-form": {
      "href": "https://api-sandbox.dwolla.com/customers/41432759-6d65-42e5-a6be-400ddd103b78/documents",
      "type": "application/vnd.dwolla.v1.hal+json; profile=\"https://github.com/dwolla/hal-forms\"",
      "resource-type": "document"
    },
    "upload-dba-document": {
      "href": "https://api-sandbox.dwolla.com/customers/41432759-6d65-42e5-a6be-400ddd103b78/documents",
      "type": "application/vnd.dwolla.v1.hal+json",
      "resource-type": "document"
    }
  },
  "_embedded": {
    "errors": [
      {
        "code": "Required",
        "message": "DBA (Doing Business As) document upload required",
        "_links": {
          "upload-dba-document": {
            "href": "https://api-sandbox.dwolla.com/customers/41432759-6d65-42e5-a6be-400ddd103b78/documents"
          }
        }
      }
    ]
  },
  "id": "41432759-6d65-42e5-a6be-400ddd103b78",
  "firstName": "Account",
  "lastName": "Admin",
  "email": "accountAdmin@email.com",
  "type": "business",
  "status": "document",
  "created": "2018-05-10T19:59:22.643Z",
  "address1": "66 Walnut St",
  "city": "Des Moines",
  "state": "IA",
  "postalCode": "50309",
  "businessName": "Jane Corp",
  "controller": {
    "firstName": "document",
    "lastName": "Controller",
    "title": "CEO",
    "address": {
      "address1": "1749 18th st",
      "address2": "apt 12",
      "city": "Des Moines",
      "stateProvinceRegion": "IA",
      "country": "US",
      "postalCode": "50266"
    }
  },
  "businessClassification": "9ed3f670-7d6f-11e3-b1ce-5404a6144203",
  "businessType": "llc"
}
```

#### Document Types

##### Controllers

**US persons:** A colored camera captured image of the Controller's identifying document can be specified as documentType: `license` (state issued driver's license), or `idCard` (U.S. government-issued photo id card).

Supported Document Examples:

- Non-expired State Issued Driver's License/Identification Card
- Non-expired US Passport
- Federal Employment Authorization Card
- US Visa

Unsupported Document Examples:

- Military IDs
- Expired government-issued IDs

**Non-US persons:** A colored camera captured image of the Controller's identifying document can be specified as documentType: `passport`. Examples include:

- Non-expired Foreign Passport **\*Note:** Foreign Passports are only accepted when the individual does not have an ITIN or SSN and the user must alternatively enter the Passport number\*.

##### Businesses

Documents that are used to help identify a business are specified as documentType `other`. **Note**: A DBA document should be issued by the government and should include the DBA name along with the state registered business name. Business Identifying documents we recommend uploading can include the following:

- **Partnership, General Partnership**: EIN Letter (IRS-issued SS4 confirmation letter).
- **Limited Liability Corporation (LLC), Corporation**: EIN Letter (IRS-issued SS4 confirmation letter).
- **Sole Proprietorship**: Sole Proprietorships can be verified by uploading Business documents as well as Personal IDs. Personal IDs need to be specified as documentType `idCard`, `license` or `passport` depending on the type of the ID. Business documents need to be specified as documentType `other`. Acceptable documents include one or more of the following, as applicable to your sole proprietorship:
  - Business documents (documentType `other`):
    - Fictitious Business Name Statement,
    - Certificate of Assumed Name; Business License,
    - Sales/Use Tax License,
    - Registration of Trade Name,
    - EIN documentation (IRS-issued SS4 confirmation letter)
  - Personal documents (documentType `license`, `passport` or `idCard`):
    - Color copy of a valid government-issued photo ID (e.g., a driver's license, passport, or state ID card).

<Note>
  Trusts should be created as Sole Proprietor accounts and will require signed trust documents that include the trust and username that are on file.
</Note>

Other business documents may be acceptable on a case by case basis with Dwolla approval. These include any US government entity (federal, state, local) issued business formation or licensing exhibiting the name of the business enrolling with Dwolla, or; Any business formation documents exhibiting the name of the business entity in addition to being filed and stamped by a US government entity. Examples include:

- Filed and stamped Articles of Organization or Incorporation
- Sales/Use Tax License
- Business License
- Certificate of Good Standing

##### Proof of address

If Dwolla's Compliance team is unable to find an external connection to confirm the user does in fact conduct business at their provided business address, a "proof of address" will be required. Proof of address are any of the following, current documents that show the address in question:

- Utility Bill
- Financial Statement
- Tax Statement (Please note - Form W-9 is a tax form, and is not an acceptable Tax Statement)
- Fully Executed Lease Agreement - must be valid for a minimum of the next 30 days.

### Uploading a document

To upload a color photo of the document, you'll initiate a multipart form-data POST request from your backend server to `https://api.dwolla.com/customers/{id}/documents`. The file must be either a .jpg, .jpeg, or .png. Files must be no larger than 10MB in size. Additionally, Business Documents can also be uploaded in a .pdf format.

You'll also get a <Tooltip tip="A webhook is a notification sent from Dwolla to your application when certain events occur.">webhook</Tooltip> with a `customer_verification_document_uploaded` event to let you know the document was successfully uploaded.

#### Request and response

<CodeGroup>
  ```bash HTTP
  curl -X POST
  \ -H "Authorization: Bearer tJlyMNW6e3QVbzHjeJ9JvAPsRglFjwnba4NdfCzsYJm7XbckcR"
  \ -H "Accept: application/vnd.dwolla.v1.hal+json"
  \ -H "Cache-Control: no-cache"
  \ -H "Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW"
  \ -F "documentType=passport"
  \ -F "file=@foo.png"
  \ 'https://api-sandbox.dwolla.com/customers/132681fa-1b4d-4181-8ff2-619ca46235b1/documents
  ```

```php upload_customer_document.php
No example for this language yet.
```

```ruby upload_customer_document.rb
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
customer_url = 'https://api.dwolla.com/customers/132681fa-1b4d-4181-8ff2-619ca46235b1'

file = Faraday::UploadIO.new('mclovin.jpg', 'image/jpeg')
document = app_token.post "#{customer_url}/documents", file: file, documentType: 'license'
document.response_headers[:location] # => "https://api.dwolla.com/documents/11fe0bab-39bd-42ee-bb39-275afcc050d0"
```

```python upload_customer_document.py
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python (Recommended)
customer_url = 'https://api.dwolla.com/customers/132681fa-1b4d-4181-8ff2-619ca46235b1'

document = app_token.post('%s/documents' % customer_url, file = open('mclovin.jpg', 'rb'), documentType = 'license')
document.headers['location'] # => 'https://api.dwolla.com/documents/11fe0bab-39bd-42ee-bb39-275afcc050d0'
```

```javascript uploadCustomerDocument.js
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

</CodeGroup>

If the document was successfully uploaded, the response will be a HTTP 201 Created with the URL of the new document resource contained in the Location header.

```bash
HTTP/1.1 201 Created
Location: https://api-sandbox.dwolla.com/documents/11fe0bab-39bd-42ee-bb39-275afcc050d0
```

#### Document review process

Once created, the document will be reviewed by Dwolla. When our team has made a decision to approve or reject, which may take up to 1-2 business days, we'll create either a `customer_verification_document_approved` or `customer_verification_document_failed` event.

If the document was sufficient, the Customer may be verified in this process. If not, we may need additional documentation. Note: Reference the [determining verification documents needed](#document-types) section for more information on determining if additional documents are needed after an approved or failed event is triggered.

If the document was found to be fraudulent or doesn't match the identity of the Customer, the Customer will be suspended.

#### Document failure

A document can fail if, for example, the Customer uploaded the wrong type of document or the `.jpg` or `.png` file supplied was not readable (i.e. blurry, not well lit, not in color, or cuts off a portion of the identifying image). If you receive a `customer_verification_document_failed` webhook, you'll need to upload another document. To retrieve the failure reason for the document upload, you'll retrieve the document by its ID. Contained in the response will be a `failureReason` field which corresponds to one or more of the following values. In case of a failure due to multiple reasons, an additional `allFailureReasons` of `reason`s and `description`s is also returned:

| Failure reason            | Description                                                            | Detailed description                                                                                                                                                                                                                                                                                                 |
| ------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BusinessDocNotSupported` | Business document not supported                                        | The business document provided is not supported for verification. Please request approved [business documentation](#document-types) from the end user for verification.                                                                                                                                              |
| `BusinessNameMismatch`    | Business name on account does not match document                       | The legal business name listed in the documentation uploaded does not match the Registered Business Name on the account. The account has been moved to [retry](#handling-retry-status) so that the business name listed at the account level can be adjusted to match the business documentation which was uploaded. |
| `BusinessTypeMismatch`    | Business type chosen does not match document                           | Based on the documentation provided, the entity type for this business should be created as a/an (LLC, Corporation, Sole Prop). The account has been moved to [retry](#handling-retry-status) so that the correct business type (LLC, Corporation, Sole Prop etc.) can be submitted.                                 |
| `ScanDobMismatch`         | Scan DOB does not match DOB on account                                 | The DOB listed on the ID uploaded does not match the DOB on the user's account. The account has been placed in [retry](#handling-retry-status) so that the user can adjust the DOB listed on the account to match the ID which was provided.                                                                         |
| `ScanFailedOther`         | ID may be fraudulent or a generic example ID image                     | The ID uploaded may be fraudulent or a generic example of an ID. The user needs to upload a valid ID to proceed with account verification.                                                                                                                                                                           |
| `ScanIdExpired`           | ID is expired or missing expiration date                               | The ID uploaded by the user is expired. The user will need to upload a non-expired ID.                                                                                                                                                                                                                               |
| `ScanIdTypeNotSupported`  | ID may be a military ID, firearm license, or other unsupported ID type | The uploaded ID is not an acceptable form of ID. [Here](#document-types) is a list of ID types that Dwolla accepts for account verification.                                                                                                                                                                         |
| `ScanIdUnrecognized`      | ID is not recognized                                                   | The ID which has been uploaded is unreadable. The user will need to upload a new image of their ID to proceed with verification.                                                                                                                                                                                     |
| `ScanNameMismatch`        | Scan name does not match name on account                               | The name listed on the ID which has been uploaded by the user does not match the name which is listed at the account level. The account has been placed in [retry](#handling-retry-status) so that the user can adjust the name on the account to match the ID which was provided.                                   |
| `ScanNotReadable`         | Image blurry, too dark, or obscured by glare                           | The uploaded ID is blurry, cutoff, or unreadable. The user will need to upload a clear, color, camera-captured image of their ID to proceed with verification. Here are some [best practices](#handling-document-status) related to document uploads.                                                                |
| `ScanNotUploaded`         | Scan not uploaded                                                      | The uploaded image is not an ID. The user will need to upload an image of a valid ID to proceed. [Here](#document-types) is a list of valid ID's that Dwolla accepts for account verification.                                                                                                                       |

##### Request and response

<CodeGroup>
  ```bash HTTP
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

```php retrieve_failure_reason.php
<?php
$aDocument = 'https://api.dwolla.com/documents/11fe0bab-39bd-42ee-bb39-275afcc050d0';

$documentsApi = DwollaSwagger\DocumentsApi($apiClient);

$retrieved = $documentsApi->getCustomer($aDocument);
print($retrieved->failureReason); # => "ScanNotReadable"
?>
````

```ruby retrieve_failure_reason.rb
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
document_url = 'https://api.dwolla.com/documents/11fe0bab-39bd-42ee-bb39-275afcc050d0'

document = app_token.get document_url
document.failureReason # => "ScanNotReadable"
```

```python retrieve_failure_reason.py
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python (Recommended)
document_url = 'https://api.dwolla.com/documents/11fe0bab-39bd-42ee-bb39-275afcc050d0'

documents = app_token.get(document_url)
documents.body['failureReason'] # => 'ScanNotReadable'
```

```javascript
var documentUrl = "https://api.dwolla.com/documents/11fe0bab-39bd-42ee-bb39-275afcc050d0";

dwolla.get(document_url).then(function (res) {
  res.body.failureReason; // => "ScanNotReadable"
});
```

</CodeGroup>

## Handling status: suspended

If the Customer is `suspended`, there's no further action you can take to correct this using the API. You'll need to contact [support@dwolla.com](mailto:support@dwolla.com) or your account manager for assistance.

The successful creation of a business verified Customer and Controller doesn't necessarily mean the Customer is fully verified and eligible to transfer. After successfully creating your business verified Customer, you will need to check to see if the beneficial ownership requirements apply to you. To learn how to add beneficial owner(s) to your Customer, read on in the next step.

# Step 3 - Adding Beneficial Owner(s)

To help the government fight financial crime, the existing United States Federal customer due diligence rules were amended to clarify and strengthen [customer due diligence requirements.](https://www.federalregister.gov/documents/2016/05/11/2016-10567/customer-due-diligence-requirements-for-financial-institutions#footnote-44-p29407) The customer due diligence rule imposes a requirement for verifying the identity of beneficial owner(s) of Dwolla's partners and users that are not natural persons. These legal entities can be abused to disguise involvement in terrorist financing, money laundering, tax evasion, corruption, fraud, and other financial crimes. Requiring the disclosure of key individuals who ultimately own or control a legal entity (i.e., the beneficial owners) helps law enforcement investigate and prosecute these crimes.

<Info>
  If your business is exempt or if there is no individual with at least 25% ownership, your Customer can go straight to <a href="#certify-beneficial-ownership">certifying</a> that there are no beneficial owners
</Info>

#### How do I know what business structure is required to add Beneficial Owners?

| If my Customer's business structure is... | ...are they required to add beneficial owners? |
| ----------------------------------------- | ---------------------------------------------- |
| Sole proprietorships                      | No (exempt)                                    |
| Unincorporated association                | No (exempt)                                    |
| Trust                                     | No (exempt)                                    |
| Corporation                               | Yes (if owns 25% or more)                      |
| Publicly traded corporations              | No (exempt)                                    |
| Non-profits                               | No (exempt)                                    |
| LLCs                                      | Yes (if owns 25% or more)                      |
| Partnerships, LP's, LLP's                 | Yes (if owns 25% or more)                      |

### Create a beneficial owner for a Business Verified Customer

To create a beneficial owner, use the [create a beneficial owner](/docs/api-reference/beneficial-owners/create-beneficial-owner) endpoint.

##### Events

As a developer, you can expect these events to be triggered when a beneficial owner is successfully created and systematically verified:

1. `customer_beneficial_owner_created`
2. `customer_beneficial_owner_verified`

##### Request Parameters

| Parameter   | Required    | Type   | Description                                                                                                                                                    |
| ----------- | ----------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| firstName   | yes         | string | **Legal first name** of the Beneficial Owner. <br /> **Must be ≤ 50 characters**. <br /> **Cannot contain numbers or special characters** ``[<>="`!?%~${}\]``. |
| lastName    | yes         | string | **Legal last name** of the Beneficial Owner. <br /> **Must be ≤ 50 characters**. <br /> **Cannot contain numbers or special characters** ``[<>="`!?%~${}\]``.  |
| ssn         | conditional | string | **Full 9-digit SSN** required **only for US persons**. <br /> **Must be exactly 9 digits (e.g., `123456789`)**. <br /> **No dashes or separators**.            |
| dateOfBirth | yes         | string | **Date of birth** of the Beneficial Owner. <br /> **Formatted as `YYYY-MM-DD`**. <br /> **Must be between 18 to 125 years of age**.                            |
| address     | yes         | object | **Physical address of the Beneficial Owner**. <br /> [See Address JSON Object](#address-json-object).                                                          |
| passport    | conditional | object | **Required for non-US persons**. <br /> Includes **passport number and issuing country**. <br /> [See Passport JSON Object](#passport-json-object).            |

##### Address JSON object

| Parameter           | Required    | Type   | Description                                                                                                                                                                                                                                                                                                                                                                                                     |
| ------------------- | ----------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| address1            | yes         | string | **First line** of the street address of the Beneficial Owner's permanent residence. <br /> **PO Boxes are not allowed**. <br /> **Must be ≤ 50 characters** and contain **no special characters** ``[<>="`!?%~${}\]``.                                                                                                                                                                                          |
| address2            | no          | string | **Second line** of the street address. <br /> **PO Boxes are not allowed**. <br /> **Must be ≤ 50 characters** and contain **no special characters** ``[<>="`!?%~${}\]``.                                                                                                                                                                                                                                       |
| address3            | no          | string | **Third line** of the street address. <br /> **PO Boxes are not allowed**. <br /> **Must be ≤ 50 characters** and contain **no special characters** ``[<>="`!?%~${}\]``.                                                                                                                                                                                                                                        |
| city                | yes         | string | **City** of the Beneficial Owner's permanent residence. <br /> **Must be ≤ 50 characters**. <br /> **Cannot contain numbers or special characters** ``[<>="`!?%~${}\]``.                                                                                                                                                                                                                                        |
| stateProvinceRegion | yes         | string | **US persons** - Two-letter **US state abbreviation** of the Beneficial Owner's physical address. See the [US Postal Service guide](https://pe.usps.com/text/pub28/28apb.htm). <br /> **Non-US persons** - Two-letter **state, province, or region ISO abbreviation**. <br /> **If no two-letter abbreviation exists, use the country's ISO 2-letter abbreviation**. <br /> **Must be uppercase** (e.g., `CA`). |
| country             | yes         | string | **Country** of the Beneficial Owner's permanent residence. <br /> **Two-digit ISO country code** (e.g., `US` for United States, `CA` for Canada). See the [ISO country codes list](https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes).                                                                                                                                                               |
| postalCode          | conditional | string | **Postal code** of the Beneficial Owner's permanent residence. <br /> **US persons** must provide a **5-digit ZIP code** (e.g., `50314`). <br /> **Non-US persons** - Optional, but may include alphanumeric postal codes where applicable.                                                                                                                                                                     |

##### Passport JSON object

| Parameter | Required    | Type   | Description                                                                                                                                                                                                 |
| --------- | ----------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| number    | conditional | string | Required if Beneficial Owner resides **outside of the United States** and has no **Social Security Number**. <br /> **Must be ≤ 255 characters** and contain **no special characters** ``[<>="`!?%~${}\]``. |
| country   | conditional | string | **Country** of issued passport. <br /> **Two-digit ISO country code** (e.g., `US` for United States, `CA` for Canada). <br /> **Must be 2 characters** (ISO standard).                                      |

##### Request and Response

<CodeGroup>
  ```bash
  POST https://api-sandbox.dwolla.com/customers/07d59716-ef22-4fe6-98e8-f3190233dfb8/beneficial-owners
  Content-Type: application/vnd.dwolla.v1.hal+json
  Accept: application/vnd.dwolla.v1.hal+json
  Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

{
"firstName": "Jane",
"lastName": "Doe",
"ssn": "123-56-7890",
"dateOfBirth": "1960-11-30",
"address": {
"address1": "123 Main St.",
"address2": "Apt 12",
"city": "New York",
"stateProvinceRegion": "NY",
"country": "US",
"postalCode": "10005"
}
}

HTTP/1.1 201 Created
Location: https://api.dwolla.com/beneficial-owners/FC451A7A-AE30-4404-AB95-E3553FCD733F

````

```php
<?php
$customersApi = new DwollaSwagger\CustomersApi($apiClient);
$verified_customer = 'https://api-sandbox.dwolla.com/customers/07d59716-ef22-4fe6-98e8-f3190233dfb8';

$addOwner = $customersApi->addBeneficialOwner([
      'firstName' => 'Jane',
      'lastName'=> 'Doe',
      'dateOfBirth' => '1960-11-30',
      'ssn' => '123-56-7890',
      'address' =>
      [
          'address1' => '123 Main St',
          'address2' => 'Apt 12',
          'city' => 'New York',
          'stateProvinceRegion' => 'NY',
          'postalCode' => '10005',
          'country' => 'US'
      ],
  ], $verified_customer);
?>
````

```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
customer_url = 'https://api-sandbox.dwolla.com/customers/AB443D36-3757-44C1-A1B4-29727FB3111C'
request_body = {
  :firstName => 'Jane',
  :lastName => 'Doe',
  :ssn => '123-56-7890',
  :dateOfBirth => '1960-11-30',
  :address => {
    :address1 => '123 Main St',
    :address2 => 'Apt 12'
    :city => 'New York',
    :stateProvinceRegion => 'NY',
    :country => 'US',
    :postalCode => '10005'
  }
}

beneficial_owner = app_token.post "#{customer_url}/beneficial-owners", request_body
beneficial_owner.response_headers[:location] # => "https://api-sandbox.dwolla.com/beneficial-owners/AB443D36-3757-44C1-A1B4-29727FB3111C"
```

```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
customer_url = 'https://api-sandbox.dwolla.com/customers/AB443D36-3757-44C1-A1B4-29727FB3111C'
request_body = {
  'firstName': 'Jane',
  'lastName': 'Doe',
  'dateOfBirth': '1960-11-30',
  'ssn': '123-56-7890',
  'address': {
    'address1': '99-99 33rd St',
    'address2': 'Apt 12',
    'city': 'New York',
    'stateProvinceRegion': 'NY',
    'country': 'US',
    'postalCode': '10005'
  }
}

beneficial_owner = app_token.post('%s/beneficial-owners' % customer_url, request_body)
beneficial_owner.headers['location'] # => 'https://api-sandbox.dwolla.com/beneficial-owners/AB443D36-3757-44C1-A1B4-29727FB3111C'
```

```javascript
var customerUrl = 'https://api-sandbox.dwolla.com/customers/07d59716-ef22-4fe6-98e8-f3190233dfb8';
var requestBody = {
  firstName: 'Jane',
  lastName: 'Doe',
  dateOfBirth: '1960-11-30',
  ssn: '123-56-7890',
  address: {
    address1: '99-99 33rd St',
    address2: 'Apt 12',
    city: 'Some City',
    stateProvinceRegion: 'NY',
    country: 'US'
    postalCode: '10005'
  }
};

dwolla
  .post(`${customerUrl}/beneficial-owners`, requestBody)
  .then(res => res.headers.get('location')); // => 'https://api-sandbox.dwolla.com/beneficial-owners/FC451A7A-AE30-4404-AB95-E3553FCD733F'

```

</CodeGroup>

### Check the status of an individual Beneficial Owner

After a beneficial owner has been created, the beneficial owner's identity needs to go through a verification process. A beneficial owner that has a status of `incomplete` or `document` will impact the business verified Customer's eligibility to send or receive funds. When a beneficial owner has been successfully verified by Dwolla, the beneficial owner's status will be set to verified.

Reference the table below for more information on the events that correspond to each of the beneficial owner statuses:

##### Individual Beneficial Owner statuses and events

| Individual Beneficial Owner Status | Event Topic Name                                | Transaction Restricted? | Description                                                                                                                                                                                                                                                                                                   |
| ---------------------------------- | ----------------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Verified                           | customer_beneficial_owner_verified              | No                      | Beneficial owner has been identity verified.                                                                                                                                                                                                                                                                  |
| Document                           | customer_beneficial_owner_document_needed       | Yes - Cannot send funds | Beneficial owner must upload a document in order to be verified.                                                                                                                                                                                                                                              |
| Incomplete                         | customer_beneficial_owner_reverification_needed | Yes - Cannot send funds | The initial verification attempt failed because the information provided did not satisfy our verification check. You can make one additional attempt by changing some or all the attributes of the existing Customer with an [update request](/docs/api-reference/beneficial-owners/update-beneficial-owner). |

Let's check to see if the Owner was successfully verified or not. We are going to use the location of the Beneficial Owner resource that was just created.

##### Request and response - retrieve a beneficial owner status

<CodeGroup>
  ```bash
  GET https://api-sandbox.dwolla.com/beneficial-owners/07D59716-EF22-4FE6-98E8-F3190233DFB8
  Accept: application/vnd.dwolla.v1.hal+json
  Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

...

{
"\_links": {
"self": {
"href": "https://api-sandbox.dwolla.com/beneficial-owners/00cb67f2-768c-4ee3-ac81-73bc4faf9c2b",
"type": "application/vnd.dwolla.v1.hal+json",
"resource-type": "beneficial-owner"
},
"retry-verification": {
"href": "https://api-sandbox.dwolla.com/beneficial-owners/00cb67f2-768c-4ee3-ac81-73bc4faf9c2b",
"type": "application/vnd.dwolla.v1.hal+json",
"resource-type": "beneficial-owner"
}
},
"id": "00cb67f2-768c-4ee3-ac81-73bc4faf9c2b",
"firstName": "Jane",
"lastName": "Owner",
"address": {
"address1": "123 Main St.",
"city": "New York",
"stateProvinceRegion": "NY",
"country": "US",
"postalCode": "10005"
},
"verificationStatus": "verified"
}

````

```php
$beneficialOwnersApi = new DwollaSwagger\BeneficialownersApi($apiClient);
$owner = 'https://api-sandbox.dwolla.com/beneficial-owners/00cb67f2-768c-4ee3-ac81-73bc4faf9c2b';
$ownerStatus = $beneficialOwnersApi->getById($owner);
````

```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
beneficial_owner_url = 'https://api-sandbox.dwolla.com/beneficial-owners/07d59716-ef22-4fe6-98e8-f3190233dfb8'

beneficial_owner = app_token.get beneficial_owner_url
beneficial_owner.verificationStatus # => "verified"
```

```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
beneficial_owner_url = 'https://api-sandbox.dwolla.com/beneficial-owners/07d59716-ef22-4fe6-98e8-f3190233dfB8'

beneficial_owner = app_token.get(beneficial_owner_url)
beneficial_owner.body['status']
```

```javascript
var beneficialOwnerUrl =
  "https://api-sandbox.dwolla.com/beneficial-owners/07d59716-ef22-4fe6-98e8-f3190233dfb8";

dwolla.get(beneficialOwnerUrl).then(res => res.body.verificationStatus); // => 'verified'
```

</CodeGroup>

## Handling an individual beneficial owner Status

Congrats! You have created a beneficial owner for a business verified Customer, however, the successful creation of a beneficial Owner doesn't necessarily mean they are identity verified. You will want to ensure that the beneficial Owner is `verified`, as the business verified Customer will be unable to send or receive funds until the owner has a verified status.

### Handling `incomplete` status

An `incomplete` status occurs when a beneficial owner's identity scores are too low during the initial verification attempt. Dwolla will trigger a `customer_beneficial_owner_reverification_needed` event which notifies your application to prompt the Customer to [submit another identity verification attempt](/docs/api-reference/beneficial-owners/update-beneficial-owner) for the beneficial owner. The second attempt will give our identity vendor more accurate information in an attempt to receive a sufficient score to approve the beneficial owner. The Customer will only have one opportunity to correct any mistakes.

<Info>
  You need to gather new information if the beneficial owner is placed into the <code>incomplete</code> status; simply passing the same information will result in the same insufficient scores. All fields that were required in the initial beneficial owner creation attempt will be required in the <code>incomplete</code> attempt.
</Info>

#### Request and Response - update beneficial owner

<CodeGroup>
  ```bash
  POST https://api-sandbox.dwolla.com/beneficial-owners/07d59716-ef22-4fe6-98e8-f3190233dfb8
  Content-Type: application/vnd.dwolla.v1.hal+json
  Accept: application/vnd.dwolla.v1.hal+json
  Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

{
"firstName": "beneficial",
"lastName": "owner",
"ssn": "123-54-6789",
"dateOfBirth": "1963-11-11",
"address": {
"address1": "123 Corrected St.",
"address2": "Apt 123",
"city": "Des Moines",
"stateProvinceRegion": "IA",
"country": "US",
"postalCode": "50309"
}
}

...

{
"\_links": {
"self": {
"href": "https://api-sandbox.dwolla.com/beneficial-owners/07d59716-ef22-4fe6-98e8-f3190233dfb8",
"type": "application/vnd.dwolla.v1.hal+json",
"resource-type": "beneficial-owner"
}
},
"id": "00cb67f2-768c-4ee3-ac81-73bc4faf9c2b",
"firstName": "beneficial",
"lastName": "owner",
"address": {
"address1": "123 Corrected St.",
"address2": "Apt 123",
"city": "Des Moines",
"stateProvinceRegion": "IA",
"country": "US",
"postalCode": "50309"
},
"verificationStatus": "verified"
}

````

```php
<?php
$beneficialOwnersApi = new DwollaSwagger\BeneficialownersApi($apiClient);

$beneficialOwnerUrl = 'https://api-sandbox.dwolla.com/beneficial-owners/07d59716-ef22-4fe6-98e8-f3190233dfb8';
$updateBeneficialOwner = $beneficialOwnersApi->update([
      'firstName' => 'beneficial',
      'lastName'=> 'owner',
      'dateOfBirth' => '1963-11-11',
      'ssn' => '123-54-6789',
      'address' =>
      [
          'address1' => '123 Corrected St.',
          'address2' => 'Apt 123',
          'city' => 'Des Moines',
          'stateProvinceRegion' => 'IA',
          'postalCode' => '50309',
          'country' => 'US'
      ],
  ], $beneficialOwnerUrl);

$updateBeneficialOwner->id; # => "07d59716-ef22-4fe6-98e8-f3190233dfb"
?>
````

```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
beneficial_owner_url = 'https://api-sandbox.dwolla.com/beneficial-owners/07d59716-ef22-4fe6-98e8-f3190233dfb8'
request_body = {
  :firstName => 'beneficial',
  :lastName => 'owner',
  :ssn => '123-54-6789',
  :dateOfBirth => '1963-11-11',
  :address => {
    :address1 => '123 Corrected St',
    :city => 'Des Moines',
    :stateProvinceRegion => 'IA',
    :country => 'US',
    :postalCode => '50309'
  }
}

update_beneficial_owner = app_token.post beneficial_owner_url, request_body
update_beneficial_owner.id # => "07d59716-ef22-4fe6-98e8-f3190233dfb8"
```

```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
beneficial_owner_url = 'https://api-sandbox.dwolla.com/beneficial-owners/07d59716-ef22-4fe6-98e8-f3190233dfb8'
request_body = {
  'firstName': 'beneficial',
  'lastName': 'owner',
  'dateOfBirth': '1963-11-11',
  'ssn': '123-54-6789',
  'address': {
    'address1': '123 Corrected St',
    'city': 'Des Moines',
    'stateProvinceRegion': 'IA',
    'country': 'US',
    'postalCode': '50309'
  }
}

update_beneficial_owner = app_token.post(beneficial_owner_url, request_body)
update_beneficial_owner.body.id # => '07d59716-ef22-4fe6-98e8-f3190233dfb8'
```

```javascript
var beneficialOwnerUrl = 'https://api-sandbox.dwolla.com/beneficial-owners/07d59716-ef22-4fe6-98e8-f3190233dfb8';
var requestBody = {
  firstName: 'beneficial',
  lastName: 'owner',
  dateOfBirth: '1963-11-11',
  ssn: '123-54-6789',
  address: {
    address1: '123 Corrected St',
    city: 'Des Moines',
    stateProvinceRegion: 'IA',
    country: 'US'
    postalCode: '50309'
  }
};

dwolla
  .post(beneficialOwnerUrl, requestBody)
  .then(res => res.body.id); // => '07d59716-ef22-4fe6-98e8-f3190233dfb8'
```

</CodeGroup>

Check the beneficial owner's status again. The beneficial owner will either be in the `verified` or `document` state of verification.

### Handling `document` status

If a beneficial owner is not verified after being placed in `incomplete` status and submitting a second verification attempt, the only other state the beneficial owner can be in is `document`. If the beneficial owner has a status of `document`, they will need to upload additional pieces of information in order to verify their identity. Use the [create a document](/docs/api-reference/documents/create-a-document-for-beneficial-owner) endpoint when uploading a colored camera captured image of the identifying document. The document(s) will then be reviewed by Dwolla; this review may take anywhere from a few seconds up to 1-2 business days if manual verification is required to approve or reject.

You can provide the following best practices to the Customer in order to reduce the chances of a document being rejected:

- All 4 Edges of the document should be visible
- A dark/high contrast background should be used
- At least 90% of the image should be the document
- Should be at least 300dpi
- Capture image from directly above the document
- Make sure that the image is properly aligned, not rotated, tilted or skewed
- No flash to reduce glare
- No black and white documents
- No expired IDs

#### Determining verification `documents` needed

##### US persons

A colored camera captured image of the Beneficial Owner's identifying document can be specified as documentType: `license` (state issued driver's license), or `idCard` (U.S. government-issued photo id card). Examples include:

- Non-expired State Issued Driver's License/Identification Card
- Non-expired US Passport
- Federal Employment Authorization Card
- US Visa

##### Non-US persons

A colored camera captured image of the Beneficial Owner's identifying document can be specified as documentType: `passport`. Examples include:

- Non-expired Foreign Passport **\*Note:** Foreign Passports are only accepted when the individual does not have an ITIN or SSN and the user must alternatively enter the Passport number\*.

### Uploading a document

To upload a color photo of the document, you'll initiate a multipart form-data POST request from your backend server to the beneficial owners documents endpoint. The file must be either a .jpg, .jpeg, or .png. Files must be no larger than 10MB in size.

You'll also get a `beneficial_owner_verification_document_uploaded` event to let you know the document was successfully uploaded.

##### Request and Response

<CodeGroup>
  ```bash
  curl -X POST
  \ -H "Authorization: Bearer tJlyMNW6e3QVbzHjeJ9JvAPsRglFjwnba4NdfCzsYJm7XbckcR"
  \ -H "Accept: application/vnd.dwolla.v1.hal+json"
  \ -H "Cache-Control: no-cache"
  \ -H "Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW"
  \ -F "documentType=passport"
  \ -F "file=@foo.png"
  \ 'https://api-sandbox.dwolla.com/beneficial-owners/1de32ec7-ff0b-4c0c-9f09-19629e6788ce/documents'

...

HTTP/1.1 201 Created
Location: https://api-sandbox.dwolla.com/documents/11fe0bab-39bd-42ee-bb39-275afcc050d0

````

```php
No example for this language yet
````

```ruby
beneficial_owner_url = 'https://api-sandbox.dwolla.com/beneficial-owners/1DE32EC7-FF0B-4C0C-9F09-19629E6788CE'

file = Faraday::UploadIO.new('mclovin.jpg', 'image/jpeg')
document = app_token.post "#{beneficial_owner_url}/documents", file: file, documentType: 'license'
document.response_headers[:location] # => "https://api.dwolla.com/documents/fb919e0b-ffbe-4268-b1e2-947b44328a16"
```

```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
beneficial_owner_url = 'https://api-sandbox.dwolla.com/beneficial-owners/1DE32EC7-FF0B-4C0C-9F09-19629E6788CE'

document = app_token.post('%s/documents' % beneficial_owner_url, file = open('janedoe.jpg', 'rb'), documentType = 'license')
document.headers['location'] # => 'https://api-sandbox.dwolla.com/documents/fb919e0b-ffbe-4268-b1e2-947b44328a16'
```

```javascript
var beneficialOwnerUrl =
  "https://api-sandbox.dwolla.com/beneficial-owners/1DE32EC7-FF0B-4C0C-9F09-19629E6788CE";

var requestBody = new FormData();
body.append("file", fs.createReadStream("mclovin.jpg"), {
  filename: "mclovin.jpg",
  contentType: "image/jpeg",
  knownLength: fs.statSync("mclovin.jpg").size,
});
body.append("documentType", "license");

dwolla
  .post(`${beneficialOwnerUrl}/documents`, requestBody)
  .then(res => res.headers.get("location")); // => "https://api-sandbox.dwolla.com/documents/fb919e0b-ffbe-4268-b1e2-947b44328a16"
```

</CodeGroup>

### Update Beneficial Owner Information

Information can only be edited or updated when the Beneficial Owner has a status of `incomplete`.

If an individual beneficial owner with a status of `verified` needs to update their information, that beneficial owner will first need to be removed and re-added.

#### Request and Response

<CodeGroup>
  ```bash
  DELETE https://api-sandbox.dwolla.com/beneficial-owners/692486f8-29f6-4516-a6a5-c69fd2ce854c
  Accept: application/vnd.dwolla.v1.hal+json
  Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

...

{
"\_links": {
"self": {
"href": "https://api-sandbox.dwolla.com/beneficial-owners/0f394602-d714-4d77-9d58-3a3e8394bcdd",
"type": "application/vnd.dwolla.v1.hal+json",
"resource-type": "beneficial-owner"
}
},
"id": "0f394602-d714-4d77-9d58-3a3e8394bcdd",
"firstName": "B",
"lastName": "Owner",
"address": {
"address1": "123 Main St.",
"city": "New York",
"stateProvinceRegion": "NY",
"country": "US",
"postalCode": "10005"
},
"verificationStatus": "verified"
}

...

HTTP 200 OK

````

```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
beneficial_owner_url = 'https://api-sandbox.dwolla.com/beneficial-owners/692486f8-29f6-4516-a6a5-c69fd2ce854c'

app_token.delete beneficial_owner_url
````

```javascript
var beneficialOwnerUrl =
  "https://api-sandbox.dwolla.com/beneficial-owners/692486f8-29f6-4516-a6a5-c69fd2ce854c";

dwolla.delete(beneficialOwnerUrl);
```

```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
beneficial_owner_url = 'https://api-sandbox.dwolla.com/beneficial-owners/692486f8-29f6-4516-a6a5-c69fd2ce854c'

app_token.delete(beneficial_owner_url)
```

```php
<?php
$beneficialOwnersApi = new DwollaSwagger\BeneficialownersApi($apiClient);
$beneficialOwner = 'https://api-sandbox.dwolla.com/beneficial-owners/692486f8-29f6-4516-a6a5-c69fd2ce854c';
$deletedBeneficialOwner = $beneficialOwnersApi->deleteById($beneficialOwner);
?>
```

</CodeGroup>

After removal of a Beneficial Owner, they can be re-added and go through the verification process again. You can also remove a beneficial owner if they no longer own 25% or more of the business.

The successful creation and verification of a beneficial owner doesn't necessarily mean the business verified Customer is verified and ready to send or receive funds. The final step in creating a business verified Customer is to certify that all information provided is correct. Read on to view the procedures on how to certify your owners.

To learn how to certify beneficial owners to your Customer, read on to the next step.

# Step 4 - Certify Beneficial Ownership

In order for your business verified Customer to be eligible to send funds, the individual creating the business verified Customer account must certify beneficial owner(s). By certifying that all beneficial owner information is correct, the requirements imposed by the United States Federal customer due diligence rule and Dwolla will be successfully fulfilled.

Certification of beneficial owners should be included as part of the Customer account registration and immediately following the creation of the business Verified Customer and the addition of all owners (unless exempt).

#### How do I know what business structure is required to certify Beneficial Ownership?

| If my Customer's business structure is... | ...are they required to certify beneficial ownership? |
| ----------------------------------------- | ----------------------------------------------------- |
| Sole proprietorships                      | No (exempt)                                           |
| Unincorporated association                | No (exempt)                                           |
| Trust                                     | No (exempt)                                           |
| Corporation                               | Yes                                                   |
| Publicly traded corporations              | Yes                                                   |
| Non-profits                               | Yes                                                   |
| LLCs                                      | Yes                                                   |
| Partnerships, LP's, LLP's                 | Yes                                                   |

### Determining Certification needed

When a business verified Customer needs to be `certified`, Dwolla will return a link in the API response after [retrieving a Customer](/docs/api-reference/customers/retrieve-a-customer). If no certification link is returned, the Customer is either already `certified`, or is exempt from certification.

| Link name                    | Description                                                  |
| ---------------------------- | ------------------------------------------------------------ |
| certify-beneficial-ownership | Indicates that `certification` is required for this Customer |

##### Example response

```json
{
  "_links": {
    "self": {
      "href": "https://api-sandbox.dwolla.com/customers/41432759-6d65-42e5-a6be-400ddd103b78",
      "type": "application/vnd.dwolla.v1.hal+json",
      "resource-type": "customer"
    },
    "certify-beneficial-ownership": {
      "href": "https://api-sandbox.dwolla.com/customers/41432759-6d65-42e5-a6be-400ddd103b78/beneficial-ownership",
      "type": "application/vnd.dwolla.v1.hal+json",
      "resource-type": "beneficial-ownership"
    }
  },
  "id": "41432759-6d65-42e5-a6be-400ddd103b78",
  "firstName": "Account",
  "lastName": "Admin",
  "email": "accountAdmin@email.com",
  "type": "business",
  "status": "document",
  "created": "2018-05-10T19:59:22.643Z",
  "address1": "66 Walnut St",
  "city": "Des Moines",
  "state": "IA",
  "postalCode": "50309",
  "businessName": "Jane Corp",
  "controller": {
    "firstName": "Jim",
    "lastName": "Controller",
    "title": "CEO",
    "address": {
      "address1": "1749 18th st",
      "address2": "apt 12",
      "city": "Des Moines",
      "stateProvinceRegion": "IA",
      "country": "US",
      "postalCode": "50266"
    }
  },
  "businessClassification": "9ed3f670-7d6f-11e3-b1ce-5404a6144203",
  "businessType": "llc"
}
```

#### Certification Statuses

| certification_status | Transaction Restricted? | Description                                                                                                                                                                                                            |
| -------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| uncertified          | Yes - Cannot send funds | New business verified Customers that are not exempt are initially placed in an uncertified status.                                                                                                                     |
| recertify            | No, for up to 30 days   | Business verified Customers that are certified and change owner information, OR Business verified Customers that Dwolla needs to obtain more information from relating to beneficial owners are placed in this status. |
| certified            | No                      | Confirms the certification of beneficial owners.                                                                                                                                                                       |

## Certify ownership

To change the certification status of your business verified Customer account, you will want to POST to the beneficial ownership endpoint. By updating the certification status to `certified`, the Account Admin creating the business verified Customer is indicating that all information is correct. After the Account Admin certifies that the information provided is accurate and the information the Account Admin submitted has been verified through the identity verified process, your business verified Customer is now ready to transact within the Dwolla network.

<CodeGroup>
  ```bash
  POST https://api-sandbox.dwolla.com/customers/56502f7a-fa59-4a2f-8579-0f8bc9d7b9cc/beneficial-ownership
  Accept: application/vnd.dwolla.v1.hal+json
  Content-Type: application/vnd.dwolla.v1.hal+json
  Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

{
"status": "certified"
}

...

{
"\_links": {
"self": {
"href": "https://api-sandbox.dwolla.com/customers/56502f7a-fa59-4a2f-8579-0f8bc9d7b9cc/beneficial-ownership",
"type": "application/vnd.dwolla.v1.hal+json",
"resource-type": "beneficial-ownership"
}
},
"status": "certified"
}

````

```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
customer_url = 'https://api-sandbox.dwolla.com/customers/e52006c3-7560-4ff1-99d5-b0f3a6f4f909'
request_body = {
  :status => "certified"
}

app_token.post "#{customer_url}/beneficial-ownership", request_body
````

```javascript
var customerUrl = "https://api-sandbox.dwolla.com/customers/e52006c3-7560-4ff1-99d5-b0f3a6f4f909";
var requestBody = {
  status: "certified",
};

dwolla.post(`${customerUrl}/beneficial-ownership`, requestBody);
```

```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
customer_url = 'https://api-sandbox.dwolla.com/customers/e52006c3-7560-4ff1-99d5-b0f3a6f4f909'
request_body = {
    "status": "certified"
}

app_token.post('%s/beneficial-ownership' % customer_url, request_body)
```

```php
<?php
$customersApi = new DwollaSwagger\CustomersApi($apiClient);
$customerId = 'https://api-sandbox.dwolla.com/customers/e52006c3-7560-4ff1-99d5-b0f3a6f4f909';
$certifyCustomer = $customersApi->changeOwnershipStatus(['status' => 'certified' ], $customerId);
?>
```

</CodeGroup>

#### Certification Text Example

Example for certification is as follows:

```plaintext
"I,____ (name of Account Admin), hereby certify, to the best of my knowledge,
that the information provided above is complete and correct."
```

## Handling `recertify` status

If you are adding, removing, or updating information of beneficial owners tied to a business verified Customer account, the certification status will change to `recertify`.

Instances that you will see your `certified` business verified Customer change to `recertify` are as follows:

- Adding a beneficial owner
- Removing a beneficial owner
- Updating a beneficial owner in `incomplete` status

When a Customer has a `recertify` beneficial ownership status, they will have up to thirty days to update and verify their beneficial owners' information and update their status to `certified`. If the certification status isn't updated within this timeframe, the business verified Customer will have its `certification_status` changed to `uncertified`, leaving the Customer unable to transact.

# Frequently Asked Questions

#### Customer Eligibility

<Accordion title="Q: How do I determine if my Customer is fully verified and eligible to start transacting?">
  <p>
    You can determine the eligibility of the customer to start transacting in
    the Dwolla platform by the presence of the <code>send</code> and
    <code>receive</code> links in the customer resource.

    <br />

    <br />

    <code>send</code> - Denotes that the customer is eligible to start sending
    funds if they have a verified funding-source attached.

    <br />

    <br />

    <code>receive</code> - Denotes that the customer is eligible to receive
    funds into their Dwolla balance or an attached bank funding-source.
    <strong>Note:</strong> Until the following actions have been completed, any
    funds received by the Customer will remain in their Dwolla Balance unable to
    be withdrawn or sent to another Customer or Account:

    <ul>
      <li>
        <a href="/docs/business-verified-customer#add-beneficial-owners" target="_blank">
          Addition and verification of beneficial owners
        </a>

        {" "}

        (if applicable)
      </li>

      <li>
        <a href="/docs/business-verified-customer#certify-beneficial-ownership" target="_blank">
          Certification of beneficial ownership
        </a>
      </li>
    </ul>

    <br />

    <strong>Tip:</strong> You can use the MCP server to programmatically check these links via the API.

  </p>
</Accordion>

<Accordion title="Q: My Customer has a retry status. What activity would they be able to engage in while being in retry status, as it relates to the Dwolla Platform?">
  <ul>
    <li>Send funds - No</li>

    <li>
      Receive funds - Yes - Note that funds will only process to their balance
      and the transfer will stay <code>pending</code> until the Customer has
      been verified.
    </li>

    <li>Add and verify a bank funding source - Yes</li>
    <li>Add and verify a Beneficial Owner - Yes</li>

  </ul>
</Accordion>

<Accordion title="Q: My Customer has a document status. What activity would they be able to engage in while being in document status, as it relates to the Dwolla Platform?">
  <ul>
    <li>Send funds - No</li>

    <li>
      Receive funds - Yes - Note that funds will only process to their balance
      and the transfer will stay <code>pending</code> until the Customer has
      been verified.
    </li>

    <li>Add and verify a bank funding source - Yes</li>
    <li>Add and verify a Beneficial Owner - Yes</li>

  </ul>
</Accordion>

<Accordion title="Q: My Customer has a deactivated or suspended status. What activity would they be able to engage in while being in deactivated or suspended status, as it relates to the Dwolla Platform?">
  <ul>
    <li>Send funds - No</li>
    <li>Receive funds - No</li>
    <li>Add and verify a bank funding source - No</li>
    <li>Add and verify a Beneficial Owner - No</li>
  </ul>
</Accordion>

<Accordion title="Q: My Customer has a verified status, but is unable to send funds. Why is this?">
  <p>
    Your Customer has likely not completed the bank verification process. You
    can check to see the status of the funding source

    <a href="/docs/api-reference/funding-sources/list-customer-funding-sources">
      {" "}

      via the API
    </a>

    {" "}

    or by going into the
    <a href="https://www.dwolla.com/platform/dashboard">Dwolla dashboard.</a>

  </p>
</Accordion>

<Accordion title="Q: Can I change a Business Verified Customer type to an Unverified Customer type?">
  <p>
    No. Downgrade functionality is not supported for Dwolla Verified Customers.
  </p>
</Accordion>

<Accordion title="Q: My Customer has a document status. Can I submit more than one document via the API?">
  <p>
    Yes, although this is not necessary, nor recommended. Dwolla manually
    reviews all documents, so sending more documents than necessary may slow
    down the verification process for your Customers.
  </p>
</Accordion>

<Accordion title="Q: My end user is not a US resident, can they still create a Personal Verified Customer via the API to access my application?">
  <p>
    No. At this time, Dwolla will create Business Verified Customers when they
    have a proper business EIN or SSN (for Sole Proprietorships only).
  </p>
</Accordion>

#### Beneficial Owner Eligibility

<Accordion title="Q: My Business Verified Customer is `verified` and my Beneficial Owners are `verified` but they cannot send funds. Why is this?">
  <p>
    Your Customer will need to `certify` beneficial ownership information before your Customer will be eligible to send funds.
  </p>
</Accordion>

<Accordion title="Q: One of my Business Verified Customer's Beneficial Owners is not yet in a `verified` status. What is my Customer's eligibility for certain actions with Dwolla?">
  <ul>
    <li>Send funds - No</li>

    <li>
      Receive funds - Yes - Note that funds will only process to their balance
      and the transfer will stay `pending` until all of the
      Beneficial Owners have been verified and certified.
    </li>

    <li>Add and verify a bank funding source - Yes</li>

  </ul>
</Accordion>

<Accordion title="Q: When should my Beneficial Owner use `ssn`? When should they use the `passport`?">
  <ul>
    <li>
      If your Beneficial Owner is an individual from the United States with a
      US-issued SSN, your Beneficial Owner will sign up using `ssn`.
    </li>

    <li>
      If your Beneficial Owner is a non-US individual, they will use the{" "}
      `passport` object.
    </li>

  </ul>
</Accordion>
