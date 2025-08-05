---
applyTo: "**"
---

# Introduction to Auth

#### Instantly retrieve account information to set up pay-by-bank payments via ACH and more

(An image of "Link an account")

(An image of "Fetch account info")

(An image of "Initiate a payment")

Get started with Auth

[API Reference](https://plaid.com/docs/api/products/auth/index.html.md) [Quickstart](https://plaid.com/docs/quickstart/index.html.md)

Auth allows you to request a user's checking, savings, or cash management account and routing number, making it easy for you to initiate credits or debits via ACH, wire transfer, or equivalent international networks. For example, your app might allow users to accumulate a credit balance that they can cash out to a bank account, or it might allow users to pay you using their bank account information (pay by bank). With Auth, a user can provide this information in a frictionless way, simply by authenticating into their bank account.

For an all-in-one solution that includes payment processor functionality, see [Transfer](https://plaid.com/docs/transfer/index.html.md) (US-only). If you are not using Transfer, Auth must be used with a third-party payment processor to move money: either a [Plaid Partner](https://plaid.com/docs/auth/partnerships/index.html.md) or another third party. For more information, see [Using a Payments Service](https://plaid.com/docs/auth/index.html.md#using-a-payments-service) .

Auth can only be used with debitable checking, savings, or cash management accounts. Credit-type accounts, including credit cards, cannot receive payments directly via electronic interbank transfers, and Auth data cannot be used to set up credit card payments. Auth can not be used to connect debit cards; instead, you can make a transfer directly from the user's bank account, saving you money over using the debit card network.

[Prefer to learn by watching? Get an overview of how Auth works in just 3 minutes!](https://www.youtube.com/watch?v=2ZsANOjVjIs)

Auth is commonly used in combination with other Plaid APIs that reduce risk and support compliance, such as [Balance](https://plaid.com/docs/balance/index.html.md) (to verify accounts have sufficient funds), [Signal](https://plaid.com/docs/signal/index.html.md) (to calculate the risk of ACH returns with ML-powered analysis), and [Identity](https://plaid.com/docs/identity/index.html.md) (to verify ownership information on the account).

For account funding use cases, see [Identity Verification](https://plaid.com/docs/identity-verification/index.html.md) for an end-to-end KYC compliance solution with optional AML capabilities.

#### Auth integration process

Below is a high level overview of the Auth integration process. For a more detailed walkthrough, see [Add auth to your app](https://plaid.com/docs/auth/add-to-app/index.html.md) or (if applicable) the docs for the specific [partner](https://plaid.com/docs/auth/partnerships/index.html.md) you are using.

Embedded Link for pay-by-bank applications

If your use case involves the end user choosing between paying via a credit card and paying via a bank account, it is strongly recommended to use the [Embedded experience](https://plaid.com/docs/link/embedded-institution-search/index.html.md) for Link to increase uptake of pay-by-bank.

1.  Create a Link token by calling [/link/token/create](https://plaid.com/docs/api/link/index.html.md#linktokencreate) with `auth` in the `products` parameter.
2.  Initialize Link with the Link token from the previous step. For more details, see [Link](https://plaid.com/docs/link/index.html.md) .
    - For Link configuration recommendations, see [Optimizing the Link UI for Auth](https://plaid.com/docs/auth/index.html.md#optimizing-the-link-ui-for-auth) .
3.  Once the user has successfully completed the Link flow, exchange the `public_token` for an `access_token`.
4.  If using a Plaid partner for payment processing, ensure the partner is enabled on your [Plaid Dashboard](https://dashboard.plaid.com/developers/integrations) , then call [/processor/token/create](https://plaid.com/docs/api/processors/index.html.md#processortokencreate) or [/processor/stripe/bank_account_token/create](https://plaid.com/docs/api/processors/index.html.md#processorstripebank_account_tokencreate) to obtain a token that you will provide to the partner to enable funds transfers. For more detailed instructions, including a full walkthrough, see [Auth payment partners](https://plaid.com/docs/auth/partnerships/index.html.md) .
5.  If not using a Plaid partner, call [/auth/get](https://plaid.com/docs/api/products/auth/index.html.md#authget) to obtain the account and routing number, then provide these fields to your payment processing system.
6.  Listen for the [PENDING_DISCONNECT](https://plaid.com/docs/api/items/index.html.md#pending_disconnect) webhook. If you receive it, send the Item through [update mode](https://plaid.com/docs/link/update-mode/index.html.md) . If update mode is not completed for the Item within 7 days of webhook receipt, consent will expire, which may lead to the account and routing number becoming invalid, as described in the next step.
7.  Listen for the [USER_PERMISSION_REVOKED](https://plaid.com/docs/api/items/index.html.md#user_permission_revoked) and [USER_ACCOUNT_REVOKED](https://plaid.com/docs/api/items/index.html.md#user_permission_revoked) webhooks. These webhooks indicate that you must send the Item through [update mode](https://plaid.com/docs/link/update-mode/index.html.md) to refresh consent. Attempting to use the account and routing number for transactions without successfully completing update mode may result in ACH returns.
    - If the Item is at PNC, after sending the Item through update mode, you must _also_ call [/auth/get](https://plaid.com/docs/api/products/auth/index.html.md#authget) , [/processor/token/create](https://plaid.com/docs/api/processors/index.html.md#processortokencreate) , or [/processor/stripe/bank_account_token/create](https://plaid.com/docs/api/processors/index.html.md#processorstripebank_account_tokencreate) , as relevant to your use case, to get a new set of routing and account numbers. As a best practice, it is recommended you do this _every_ time you send a PNC Item through update mode when using Auth. For more details, see [PNC TAN expiration](https://plaid.com/docs/auth/index.html.md#pnc-tan-expiration) .
8.  Listen for the [AUTH: DEFAULT_UPDATE](https://plaid.com/docs/api/products/auth/index.html.md#default_update) \] webhook. This webhook indicates that the routing and/or account number for an account on the Item has changed. Call [/auth/get](https://plaid.com/docs/api/products/auth/index.html.md#authget) , [/processor/token/create](https://plaid.com/docs/api/processors/index.html.md#processortokencreate) , or [/processor/stripe/bank_account_token/create](https://plaid.com/docs/api/processors/index.html.md#processorstripebank_account_tokencreate) on that Item, as applicable for your integration, and use only the new numbers or processor token.
9.  (Optional) To enable and configure additional Auth verification flows, such as micro-deposit verification or database verification, use the [Account Verification Dashboard](https://dashboard.plaid.com/account-verification) .

#### Using a payments service

Looking for bank-to-bank transfer capabilities and don't have a payment processor yet? Check out [Transfer](https://plaid.com/docs/transfer/index.html.md) (US only) for a money movement solution with built-in payment processing capabilities.

When using Auth, you will send Auth data to a payments service to initiate an interbank transfer; Plaid does not function as the payment processor. While Plaid is processor-agnostic and allows you to work with any partner you want, one easy way to make transfers is to work with a payments platform that partners with Plaid, such as Dwolla or Stripe. Working with these partners, you will not call the [/auth/get](https://plaid.com/docs/api/products/auth/index.html.md#authget) endpoint, so you will not obtain a user's bank account information. Instead, you will call [/processor/token/create](https://plaid.com/docs/api/processors/index.html.md#processortokencreate) or [/processor/stripe/bank_account_token/create](https://plaid.com/docs/api/processors/index.html.md#processorstripebank_account_tokencreate) to obtain a Plaid token that you will provide to the partner and that allows them to make these Plaid API calls as needed. For detailed instructions on how to set up Auth with a Plaid partner, as well as a list of supported funds transfer partners, see [Auth Partnerships](https://plaid.com/docs/auth/partnerships/index.html.md) .

If you choose to use a payments provider who is not a Plaid partner, you will need to obtain bank account numbers and codes using [/auth/get](https://plaid.com/docs/api/products/auth/index.html.md#authget) . Given the sensitive nature of this information, we recommend that you consult the [Open Finance Data Security Standard](https://ofdss.org/) for security best practices. We also recommend that you do not store account numbers. You can integrate with one of Plaid's [Data Security partners](https://plaid.com/partner-directory/) to process and share tokenized bank account numbers instead of raw bank account numbers. Contact your Account Manager to learn more about these partnerships.

#### Account Verification Dashboard

Using the [Account Verification Dashboard](https://dashboard.plaid.com/account-verification) , you can customize the Auth flow to increase conversion, enabling features like micro-deposit-based verification and database verification for end users who cannot or do not want to log into their bank accounts. You can also customize when these features are presented to users. The Account Verification Dashboard also allows you to reduce account takeover fraud by incorporating [Identity Match](https://plaid.com/docs/identity/index.html.md#identity-match) directly into the Link flow.

For more information on the Auth flows you can enable via the Account Verification Dashboard, see [Micro-deposit and database verification flows](https://plaid.com/docs/auth/coverage/index.html.md) .

You can also use the [Dashboard](https://dashboard.plaid.com/account-verification) to view the status of any completed, Auth-enabled Link session.

(An image of "Session status showing Link Session ID with identity match status and auth method in Account Verification Dashboard.")

The Dashboard [Account Verification analytics page](https://dashboard.plaid.com/account-verification/analytics) shows a breakdown of Auth conversion analytics by [connection method](https://plaid.com/docs/auth/coverage/index.html.md) .

(An image of "image of Account Verification analytics")

#### Optimizing the Link UI for Auth

By default, only checking, savings, and cash management accounts will appear when using Auth, and institutions that do not support these accounts will not appear in the Institution Select pane.

The following Link configuration options are commonly used with Auth:

- [Account select](https://plaid.com/docs/link/customization/index.html.md#account-select) : The "Account Select: Enabled for one account" setting configures the Link UI so that the end user may only select a single account. If you are not using this setting, you will need to build your own UI to let your end user select which linked account they want to use to send or receive funds.
- [Embedded Institution Search](https://plaid.com/docs/link/embedded-institution-search/index.html.md) : This presentation mode shows the Link institution search screen embedded directly into your UI, before the end user has interacted with Link. Embedded Institution Search increases end user uptake of pay-by-bank payment methods and is strongly recommended when implementing Auth as part of a pay-by-bank use case where multiple different payment methods are supported.

#### Pay by bank optimization

If you have a pay-by-bank use case, see [Increasing pay-by-bank adoption](https://plaid.com/docs/auth/pay-by-bank-ux/index.html.md) for tips on how to reduce your transaction fees by increasing the uptake of customers choosing to pay by bank.

#### Tokenized account numbers

Institutions that interface with Plaid via an OAuth portal may return a tokenized account number (TAN) in the Auth response. These TANs are standard account and routing numbers that can be utilized by any ACH processor, and will be reconciled by the issuing bank on settlement. Each app a user connects to will receive a unique TAN, rather than the user's exact account number. TANs allow either the end-user or the institution itself to more rigorously monitor and even sever a specific app's ability to transfer funds. These account numbers behave differently from regular account numbers in a number of important ways.

To determine if a tokenized account number is being used, use the `is_tokenized_account_number` field in the [/auth/get](https://plaid.com/docs/api/products/auth/index.html.md#authget) or [/processor/auth/get](https://plaid.com/docs/api/processor-partners/index.html.md#processorauthget) response. Currently, only Chase, PNC, and US Bank use tokenized account numbers.

Only the `numbers.ach.account` field can be set as a TAN (excluding brokerage or international specific numbers results). TANs are only valid for the ACH and RTP payment rails - they may not be used for wire transfers or physical checks. TANs may not be supported by your third-party fraud and account verification databases and vendors.

Institutions that use TANs do not always expose them to end users; to avoid confusion, in user-facing UIs, always display the account mask rather than the account number, as end users will not recognize the issued TAN.

If a user revokes access to their account (such as via the Chase Security center or [my.plaid.com](https://my.plaid.com/) ), the TAN will become invalid and any attempt to make a transfer using that TAN will fail with an R04 return code. To avoid returns, listen for the [USER_PERMISSION_REVOKED](https://plaid.com/docs/api/items/index.html.md#user_permission_revoked) and [USER_ACCOUNT_REVOKED](https://plaid.com/docs/api/items/index.html.md#user_account_revoked) webhooks and do not use an account number, processor token, or Stripe bank account token associated with an Item or account where access has been revoked. Instead, send the end user through [update mode](https://plaid.com/docs/link/update-mode/index.html.md) to restore the Item and then call the Auth endpoint again.

At US Bank, TANs do not become invalid, even after Item deletion or revocation.

Because account numbers alone cannot reliably be used to uniquely identify TAN-enabled accounts across different Item instances, Plaid provides a [persistent_account_id](https://plaid.com/docs/api/accounts/index.html.md#accounts-get-response-accounts-persistent-account-id) field for this purpose. This field is only available at institutions that use TANs.

If a Chase [duplicate Item](https://plaid.com/docs/link/duplicate-items/index.html.md) is created, the old Item will be invalidated, but the TAN on the new Item will remain the same. The TAN will only change if the user revokes access.

If multiple Items in your app correspond to the same account (for example, in the case of a joint bank account with multiple owners), each Item will typically have a different TAN.

TANs will always be accompanied by a routing number. The TAN must be used with the routing number returned by the API. If used with a different routing number, even one associated with the same bank, the transfer may fail.

In Sandbox, the Auth product results will have the `is_tokenized_account_number` boolean set to true if the Chase (`ins_56`), PNC (`ins_13`), US Bank (`ins_127990`), or the Platypus OAuth Bank (`ins_127287`) `institution_id` is set in the [/sandbox/public_token/create](https://plaid.com/docs/api/sandbox/index.html.md#sandboxpublic_tokencreate) request body or the respective FIs are selected from the Sandbox Link pane.

##### PNC TAN expiration

At PNC, any Item initialized with Auth after October 2024 will have a [consent_expiration_time](https://plaid.com/docs/api/products/auth/index.html.md#auth-get-response-item-consent-expiration-time) set to 1 year from the date that the user last provided consent, with the first expirations to occur in October 2025. When the Item's consent expires, the TAN will expire as well and cannot be used to make ACH transfers. This applies regardless of how you are accessing the account numbers: via [/auth/get](https://plaid.com/docs/api/products/auth/index.html.md#authget) , via the Transfer product, or via processor tokens.

You can renew consent on the Item by sending the user through [update mode](https://plaid.com/docs/link/update-mode/index.html.md) . If the Item has less than six months of valid consent remaining, the end user will automatically be asked to renew consent when entering the update mode flow. To override this behavior, set `update.reauthorization_enabled` to `true` or `false` during the [/link/token/create](https://plaid.com/docs/api/link/index.html.md#linktokencreate) call used to create the Link token for update mode.

If the Item's consent had already expired when you sent the Item through update mode, you must call [/auth/get](https://plaid.com/docs/api/products/auth/index.html.md#authget) , `/processor/token/get`, or [/processor/stripe/bank_account_token/create](https://plaid.com/docs/api/processors/index.html.md#processorstripebank_account_tokencreate) to obtain a new TAN after completing update mode, as the old TAN will not be re-activated.

In addition, if the user has multiple depository accounts at PNC, then when going through the OAuth portion of the update mode flow, it's possible that they may de-select the PNC account that they originally shared with you and select a different PNC account instead. If this happens, the TAN of the account they originally shared will be invalidated. For this reason, it is recommended to call [/auth/get](https://plaid.com/docs/api/products/auth/index.html.md#authget) , `/processor/token/get`, or [/processor/stripe/bank_account_token/create](https://plaid.com/docs/api/processors/index.html.md#processorstripebank_account_tokencreate) _every_ time you send a PNC Item through update mode.

Note that there is no additional fee for these API calls, since Auth uses a one-time fee billing model; you are only charged for your first Auth call to each Item.

PNC TAN expiration does not apply to Items initialized with Auth prior to October 2024, as these Items use real account numbers rather than TANs.

#### Updates to Auth data

Because routing and account numbers are inherently persistent, Plaid does not check for updates to Auth data for existing Items except in special circumstances, such as a bank changing its routing numbers due to a system change or merger. Plaid will also check for updated Auth data if a new user account is added to an Item via [update mode](https://plaid.com/docs/link/update-mode/index.html.md#using-update-mode-to-request-new-accounts) .

#### United States (ACH) Auth data

The United States uses the Automated Clearing House (ACH) system for funds transfers, which uses account and routing numbers. Banks also have a second routing number, known as the wire transfer routing number. Wire transfers can be used to receive international payments and can be faster than ACH transfers, but often involve a fee. Plaid Auth can only provide wire transfer routing numbers for institutions in the US.

For a detailed, comprehensive guide to ACH transfers and payments, see Plaid's [Modern Guide to ACH](https://plaid.com/solutions/ACH-guide/) .

```json
"numbers": {
  "ach": [
    {
      "account": "1111222233330000",
      "account_id": "bWG9l1DNpdc8zDk3wBm9iMkW3p1mVWCVKVmJ6",
      "routing": "011401533",
      "wire_routing": "021000021"
    }
  ],
  "bacs": [],
  "eft": [],
  "international": []
}
```

#### Auth data for other countries

##### Canada (EFT)

In Canada, the routing number is in a different format than US routing numbers and broken into two pieces: the transit number (also known as the branch number), followed by the institution number. Canada uses Electronic Funds Transfer (EFT); [VoPay](https://plaid.com/docs/auth/partnerships/vopay/index.html.md) is a Plaid partner that can be used to process EFT transfers.

```json
"numbers": {
  "eft": [
    {
      "account": "111122220000",
      "account_id": "qVZ3Bwbo5wFmoVneZxMksBvN6vDad6idkndAB",
      "branch": "01533",
      "institution": "114"
    }
  ],
  ...
}
```

##### Europe (SEPA transfers)

For funds transfers in Europe, also consider the [Payment Initiation API](https://plaid.com/docs/payment-initiation/index.html.md) , which allows end-to-end payments directly, without having to integrate an additional payment processor.

In the European Economic Area member states (which includes Euro zone nations, as well as the United Kingdom), institutions use a Bank Identifier Code (BIC), also known as a SWIFT code. Each bank account has an International Bank Account Number (IBAN), which is used along with the BIC for funds transfers. Many bank accounts also have internal, non-IBAN account numbers that cannot be used for funds transfers. The funds transfer system is known as the Shared European Payment Area (SEPA), and it supports SEPA credit transfer, SEPA instant credit transfer, and SEPA direct debit.

```json
"numbers": {
  "international": [
    {
      "account_id": "blgvvBlXw3cq5GMPwqB6s6q4dLKB9WcVqGDGo",
      "bic": "IE64BOFI90583812345678",
      "iban": "IE64BOFI90583812345678"
    }
    ...
  ]
}
```

##### United Kingdom (BACS)

For funds transfers in the UK, also consider the [Payment Initiation API](https://plaid.com/docs/payment-initiation/index.html.md) , which allows end-to-end payments directly, without having to integrate an additional payment processor.

The UK uses the SEPA system as well as the Bankers Automated Clearing System (BACS). Payments within the BACS system cannot be made outside the UK and take several days to process. BACS payments are typically used for recurring direct debit payments, such as payroll. UK bank accounts will typically have both a BACS sort code and an IBAN and support both BACS transfers and SEPA transfers.

```json
"numbers": {
  "bacs": [
    {
      "account": "80000000",
      "account_id": "blgvvBlXw3cq5GMPwqB6s6q4dLKB9WcVqGDGo",
      "sort_code": "040004"
    }
  ],
  "international": [
    {
      "account_id": "blgvvBlXw3cq5GMPwqB6s6q4dLKB9WcVqGDGo",
      "bic": "MONZGB21XXX",
      "iban": "GB23MONZ04000480000000"
    }
  ]
  ...
}
```

#### Sample app code

For a real-life example of an app that incorporates Auth, see the Node-based [Plaid Pattern Account Funding](https://github.com/plaid/pattern-account-funding) sample app. Pattern Account Funding is a sample account funding app that fetches Auth data in order to set up funds transfers. The Auth code can be found in [items.js](https://github.com/plaid/pattern-account-funding/blob/master/server/routes/items.js#L81-L135) .

#### Testing Auth

Plaid provides a [GitHub repo](https://github.com/plaid/sandbox-custom-users) with test data for testing Auth in Sandbox, helping you test configuration options beyond those offered by the default Sandbox user. For more information on configuring custom Sandbox data, see [Configuring the custom user account](https://plaid.com/docs/sandbox/user-custom/index.html.md#configuring-the-custom-user-account) .

For details on testing Auth with more complex Auth flows such as micro-deposit-based Auth, first familiarize yourself with [Adding Institution Coverage](https://plaid.com/docs/auth/coverage/index.html.md) , then see [Test in Sandbox](https://plaid.com/docs/auth/coverage/testing/index.html.md) .

#### Auth pricing

Auth is billed on a [one-time fee model](https://plaid.com/docs/account/billing/index.html.md#one-time-fee) . To view the exact pricing you may be eligible for, [apply for Production access](https://dashboard.plaid.com/overview/production) or [contact Sales](https://plaid.com/contact/) . For more details about pricing and billing models, see [Plaid billing](https://plaid.com/docs/account/billing/index.html.md) .

#### Next steps

Now that you understand Auth, [add Auth to your app](https://plaid.com/docs/auth/add-to-app/index.html.md) , or see [Move Money with Auth partners](https://plaid.com/docs/auth/partnerships/index.html.md) to see specific instructions for configuring Auth with Plaid partners.

If you're ready to launch to Production, see the Launch Center.

#### Launch Center

See next steps to launch in Production

[Launch](https://dashboard.plaid.com/developers/launch-center)
