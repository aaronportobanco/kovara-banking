---
applyTo: "**"
---

Link overview 
==============

#### Use Link to connect to your users' financial accounts with the Plaid API 

(An image of "Plaid Link UI workflow: Select bank, enter credentials, and confirm successful account connection with sample customer.")

\=\*=\*=\*=

#### Introduction to Link 

Plaid Link is the client-side component that your users will interact with in order to link their accounts to Plaid and allow you to access their accounts via the Plaid API.

Plaid Link handles all aspects of the login and authentication experience, including credential validation, multi-factor authentication, error handling, and sending account linking confirmation emails. For institutions that use OAuth, Link also manages the OAuth handoff flow, bringing the user to their institution to log in, and then returning them to the Plaid Link experience within your app. Link is supported via SDKs for all modern browsers and platforms, including [web](https://plaid.com/docs/link/web/index.html.md) , [iOS](https://plaid.com/docs/link/ios/index.html.md) , [Android](https://plaid.com/docs/link/android/index.html.md) , as well as via [React Native](https://plaid.com/docs/link/react-native/index.html.md) , along with community-supported wrappers for [Flutter](https://github.com/jorgefspereira/plaid_flutter) , [Angular](https://github.com/mike-roberts/ngx-plaid-link) , and [Vue](https://github.com/jclaessens97/vue-plaid-link/) .

For webview-based integrations or integrations that don't have a frontend, Plaid also provides a drop-in [Hosted Link](https://plaid.com/docs/link/hosted-link/index.html.md) integration mode.

To try Link, see [Plaid Link Demo](https://plaid.com/demo/) .

Link is the only available method for connecting accounts in Production and is mandatory for all Plaid integrations. In the Sandbox test environment, Link can optionally be bypassed for testing purposes via [/sandbox/public\_token/create](https://plaid.com/docs/api/sandbox/index.html.md#sandboxpublic_tokencreate) .

Want to build a Plaid-powered application using Link directly in your browser? The [Plaid Basics interactive tutorial](https://plaid.com/tutorials/basics/) can walk you through the process.

\=\*=\*=\*=

#### Initializing Link 

Link is initialized by passing the `link_token` to Link. The exact implementation details for passing the `link_token` will vary by platform. For detailed instructions, see the page for your specific platform: [web](https://plaid.com/docs/link/web/index.html.md) , [iOS](https://plaid.com/docs/link/ios/index.html.md) , [Android](https://plaid.com/docs/link/android/index.html.md) , [React Native](https://plaid.com/docs/link/react-native/index.html.md) , [mobile webview](https://plaid.com/docs/link/webview/index.html.md) , or [Plaid-hosted](https://plaid.com/docs/link/hosted-link/index.html.md) .

For recommendations on configuring the `link_token` for your use case, see [Choosing how to initialize products](https://plaid.com/docs/link/initializing-products/index.html.md) .

\=\*=\*=\*=

#### Link flow overview 

Most Plaid products use Link to generate `public_tokens`. The diagram below shows a model of how Link is used to obtain a `public_token`, which can then be exchanged for an `access_token`, which is used to authenticate requests to the Plaid API.

Note that some products (including Identity Verification, Monitor, Document Income, and Payroll Income) do not use a `public_token` or `access_token`. For those products, you will call product endpoints once the end user has completed Link; see product-specific documentation for details on the flow.

**The Plaid flow** begins when your user wants to connect their bank account to your app.

(An image of "Step diagram")

**1**Call [/link/token/create](https://plaid.com/docs/api/link/index.html.md#linktokencreate) to create a `link_token` and pass the temporary token to your app's client.

(An image of "Step 1 diagram")

**2**Use the `link_token` to open Link for your user. In the [onSuccess callback](https://plaid.com/docs/link/web/index.html.md#onsuccess) , Link will provide a temporary `public_token`. This token can also be obtained on the backend via \`/link/token/get\`.

(An image of "Step 2 diagram")

**3**Call [/item/public\_token/exchange](https://plaid.com/docs/api/items/index.html.md#itempublic_tokenexchange) to exchange the `public_token` for a permanent `access_token` and `item_id` for the new `Item`.

(An image of "Step 3 diagram")

**4**Store the `access_token` and use it to make product requests for your user's `Item`.

(An image of "Step 4 diagram")

In code, this flow is initiated by creating a `link_token` and using it to initialize Link. The `link_token` can be configured with the Plaid products you will be using and the countries you will need to support.

Once the user has logged in via Link, Link will issue a `public_token`. You can obtain the `public_token` through either the frontend or the backend:

*   On the frontend: From the client-side `onSuccess` callback returned by Link after a successful session. For more details on this method, see the Link frontend documentation for your specific platform.
*   On the backend: From the [/link/token/get](https://plaid.com/docs/api/link/index.html.md#linktokenget) endpoint or opt-in `SESSION_FINISHED` webhook after the Link session has been completed successfully. For more details on this method, see the [Hosted Link](https://plaid.com/docs/link/hosted-link/index.html.md) documentation.

The `public_token` can then be exchanged for an `access_token` via [/item/public\_token/exchange](https://plaid.com/docs/api/items/index.html.md#itempublic_tokenexchange) .

\=\*=\*=\*=

#### Supporting OAuth 

Some institutions use an OAuth authentication flow, in which Plaid Link redirects the end user to their bank's website or mobile app to authenticate. To learn how to connect to an institution that uses OAuth, see the [OAuth guide](https://plaid.com/docs/link/oauth/index.html.md) .

\=\*=\*=\*=

#### Customizing Link 

You can customize parts of Link's flow, including some text elements, the institution select view, and the background color, and enable additional features like the Account Select view straight from the [Dashboard](https://dashboard.plaid.com/link) . You can preview your changes in realtime and then publish them instantly once you're ready to go live. For more details, see [Link customization](https://plaid.com/docs/link/customization/index.html.md) .

To help you take advantage of the options available for customizing and configuring Link, Plaid offers a [best practices guide](https://plaid.com/docs/link/best-practices/index.html.md) with recommendations for how to initialize and configure Link within your app.

Link's appearance will also automatically change if the institution selected is not in a healthy state. For more details, see [Institution status in Link](https://plaid.com/docs/link/institution-status/index.html.md) .

\=\*=\*=\*=

#### Returning user flows 

The returning user flow allows you to enable a faster Plaid Link experience for your users who already use Plaid. To learn more, see [Returning user experience](https://plaid.com/docs/link/returning-user/index.html.md) .

\=\*=\*=\*=

#### Error-handling flows 

If your application will access an Item on a recurring basis, rather than just once, it should support [update mode](https://plaid.com/docs/link/update-mode/index.html.md) . Update mode allows you to refresh an Item if it enters an error state, such as when a user changes their password or MFA information. For more information, see [Updating an Item](https://plaid.com/docs/link/update-mode/index.html.md) .

It's also recommended to have special handling for when a user attempts to link the same Item twice. Requesting access tokens for duplicate Items can lead to higher bills and end-user confusion. To learn more, see [preventing duplicate Items](https://plaid.com/docs/link/duplicate-items/index.html.md) .

Occasionally, Link itself can enter an error state if the user takes over 30 minutes to complete the Link process. For information on handling this flow, see [Handling invalid Link tokens](https://plaid.com/docs/link/handle-invalid-link-token/index.html.md) .

\=\*=\*=\*=

#### Optimizing Link conversion 

How you configure Link can have a huge impact on the percentage of users who successfully complete the Link flow. To ensure you're maximizing conversion, see [Best practices for Link conversion](https://plaid.com/docs/link/best-practices/index.html.md) .

\=\*=\*=\*=

#### Troubleshooting 

Since all your users will go through Link, it's important to build as robust an integration as possible. For details on dealing with common problems, see the [Troubleshooting](https://plaid.com/docs/link/troubleshooting/index.html.md) section.

\=\*=\*=\*=

#### Link updates 

Plaid periodically updates Link to add new functionality and improve conversion. These changes will be automatically deployed. Any test suites and business logic in your app should be robust to the possibility of changes to the user-facing Link flow.

Users of Plaid's SDKs for React, React Native, iOS, and Android should regularly update to ensure support for the latest client platforms and Plaid functionality.