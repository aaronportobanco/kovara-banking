import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

/*
 * Plaid API client
 * This file sets up the Plaid API client configuration using environment variables
 * and exports the client instance for use in other parts of the application.
 * It uses the Plaid API library to create a client that can interact with the Plaid API.
 * The client is configured to use the sandbox environment for testing purposes.
 */
const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      "PLAID-SECRET": process.env.PLAID_SECRET,
    },
  },
});

/*
 * Create and export the Plaid API client instance
 * This instance can be used to make API calls to Plaid.
 * Ensure that the environment variables PLAID_CLIENT_ID and PLAID_SECRET are set.
 */
export const plaidClient = new PlaidApi(configuration);
