"use server";

/* eslint-disable @typescript-eslint/naming-convention */
import { CreateBankAccountProps, ExchangePublicTokenProps, User } from "#/types";
import {
  CountryCode,
  ProcessorTokenCreateRequest,
  ProcessorTokenCreateRequestProcessorEnum,
  Products,
} from "plaid";
import { plaidClient } from "../server/plaid";
import { encryptId, parseStringify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { addFundingSource } from "./dwolla.actions";
import { createAdminClient } from "../server/appwrite";
import { ID } from "node-appwrite";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  // APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,
} = process.env;

/**
 * Creates a Plaid Link token for a given user.
 * This token is used by the Plaid Link front-end component to initialize the linking process.
 * It is short-lived and user-specific.
 *
 * @param {User} user - The user object for whom the link token is being created.
 *                      The user's ID is used to associate the Plaid Item with the user.
 * @returns {Promise<{ linkToken: string }>} A promise that resolves to an object containing the `link_token`.
 *                         Note: The function signature is `Promise<void>`, but it actually returns a value.
 * @throws {Error} If the Plaid API call to create the link token fails.
 */
export const createLinkToken = async (user: User): Promise<{ linkToken: string }> => {
  try {
    const tokenParams = {
      user: {
        client_user_id: user.$id,
      },
      client_name: `${user.firstName} ${user.lastName}`,
      products: ["auth"] as Products[],
      language: "en",
      country_codes: ["US"] as CountryCode[],
    };

    const response = await plaidClient.linkTokenCreate(tokenParams);

    return parseStringify({ linkToken: response.data.link_token });
  } catch (error) {
    throw new Error(
      `Failed to create Plaid Link token: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};

/**
 * Creates a bank account document in the Appwrite database.
 * This function saves the bank's metadata, linking it to a user in our system.
 *
 * @param {CreateBankAccountProps} props - An object containing the necessary details for the bank account.
 * @param {string} props.bank_user_id - The Appwrite user ID of the account owner.
 * @param {string} props.bank_id - The Plaid Item ID, representing the connection to the financial institution.
 * @param {string} props.bank_account_id - The Plaid Account ID, representing the specific account.
 * @param {string} props.bank_access_token - The Plaid access token for this item.
 * @param {string} props.bank_funding_source_url - The Dwolla funding source URL.
 * @param {string} props.bank_sharable_id - A sharable ID for the bank account.
 * @returns {Promise<any>} A promise that resolves to a stringified version of the newly created bank account document.
 *                         Note: The function signature is `Promise<void>`, but it actually returns a value.
 * @throws {Error} If the database operation to create the document fails.
 */
export const createBankAccount = async ({
  userId,
  bankId,
  accountId,
  accessToken,
  fundingSourceUrl,
  shareableId,
}: CreateBankAccountProps): Promise<string> => {
  try {
    const { database } = await createAdminClient();

    const bankAccount = await database.createDocument(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      ID.unique(),
      {
        userId,
        bankId,
        accountId,
        accessToken,
        fundingSourceUrl,
        shareableId,
      },
    );

    return parseStringify(bankAccount);
  } catch (error) {
    throw new Error("Failed to create bank account: " + error);
  }
};

/**
 * Exchanges a Plaid public token for an access token and performs the full bank linking process.
 * This is a multi-step server action that:
 * 1. Exchanges the short-lived `publicToken` (from Plaid Link) for a long-lived `access_token`.
 * 2. Fetches account details from Plaid using the `access_token`.
 * 3. Creates a Plaid processor token for Dwolla integration.
 * 4. Creates a Dwolla funding source URL using the processor token.
 * 5. Persists the new bank account information (including tokens and IDs) to the Appwrite database.
 * 6. Revalidates the home page path to show the newly added bank account.
 *
 * @param {ExchangePublicTokenProps} props - The properties needed for the exchange.
 * @param {string} props.publicToken - The public token obtained from the Plaid Link on-success callback.
 * @param {User} props.user - The logged-in user object, containing their Dwolla customer ID.
 * @returns {Promise<{ publicTokenExchange: string }>} A promise that resolves to a stringified object indicating the process is complete.
 *                         Note: The function signature is `Promise<void>`, but it actually returns a value.
 * @throws {Error} If any step in the process fails (token exchange, Dwolla integration, database write).
 */
export const exchangePublicToken = async ({
  publicToken,
  user,
}: ExchangePublicTokenProps): Promise<string> => {
  try {
    // Exchange public token for access token and item ID
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    // Get account information from Plaid using the access token
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    const accountData = accountsResponse.data.accounts[0];

    // Create a processor token for Dwolla using the access token and account ID
    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
    };

    const processorTokenResponse = await plaidClient.processorTokenCreate(request);
    const processorToken = processorTokenResponse.data.processor_token;

    // Create a funding source URL for the account using the Dwolla customer ID, processor token, and bank name
    const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: accountData.name,
    });

    // If the funding source URL is not created, throw an error
    if (!fundingSourceUrl) throw Error;

    // Create a bank account using the user ID, item ID, account ID, access token, funding source URL, and shareableId ID
    await createBankAccount({
      userId: user.$id,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      shareableId: encryptId(accountData.account_id),
    });

    // Revalidate the path to reflect the changes
    revalidatePath("/");

    // Return a success message
    return parseStringify({
      publicTokenExchange: "complete",
    });
  } catch (error) {
    throw new Error(
      `Failed to exchange public token: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};
