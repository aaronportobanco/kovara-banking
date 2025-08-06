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

// Destructuring environment variables to access Appwrite database and transactions IDs.
const { APPWRITE_DATABASE_ID, APPWRITE_BANK_COLLECTION_ID } = process.env;

/**
 * Creates a Plaid Link token for user bank account connection initialization.
 *
 * This function generates a short-lived, user-specific token that enables the
 * Plaid Link frontend component to securely initialize the bank account linking
 * process. The token contains user identification and configuration settings
 * that determine which financial institutions and account types are available
 * during the linking flow. The token is configured for US-based institutions
 * and authentication-only access.
 *
 * @param {User} user - Complete user object containing identification and profile data
 * @param {string} user.$id - The Appwrite user ID used as the unique client identifier
 * @param {string} user.firstName - User's first name for display in Link flow
 * @param {string} user.lastName - User's last name for display in Link flow
 * @returns {Promise<{ linkToken: string }>} Object containing the Link token for frontend initialization
 * @throws {Error} Throws error if Plaid API call fails or user information is invalid
 *
 * @example
 * ```typescript
 * const tokenResponse = await createLinkToken(currentUser);
 * console.log(`Link token: ${tokenResponse.linkToken}`);
 * // Use token in Plaid Link component initialization
 * ```
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
 * Creates a bank account record in the Appwrite database.
 *
 * This function persists bank account metadata to the Kovara Banking database,
 * establishing the relationship between a user and their connected financial
 * institution. The record includes all necessary identifiers and tokens required
 * for future account operations, transaction retrieval, and money transfers.
 * This data serves as the bridge between Plaid account information and Dwolla
 * funding sources within the application's ecosystem.
 *
 * @param {CreateBankAccountProps} params - Complete bank account information for database storage
 * @param {string} params.userId - The Appwrite user ID of the account owner
 * @param {string} params.bankId - The Plaid Item ID representing the bank connection
 * @param {string} params.accountId - The Plaid Account ID for the specific bank account
 * @param {string} params.accessToken - The Plaid access token for API operations
 * @param {string} params.fundingSourceUrl - The Dwolla funding source URL for transfers
 * @param {string} params.shareableId - Encrypted shareable identifier for the account
 * @returns {Promise<string>} Stringified bank account document with Appwrite metadata
 * @throws {Error} Throws error if database operation fails or required parameters are missing
 *
 * @example
 * ```typescript
 * const bankAccount = await createBankAccount({
 *   userId: "user_123",
 *   bankId: "item_456",
 *   accountId: "account_789",
 *   accessToken: "access_token_abc",
 *   fundingSourceUrl: "https://api.dwolla.com/funding-sources/xyz",
 *   shareableId: "encrypted_id_def"
 * });
 * console.log(`Bank account created: ${bankAccount}`);
 * ```
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
      APPWRITE_DATABASE_ID!,
      APPWRITE_BANK_COLLECTION_ID!,
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
 * Orchestrates the complete bank account linking process from Plaid public token.
 *
 * This comprehensive function handles the entire flow of connecting a user's bank
 * account to the Kovara Banking system. It coordinates multiple APIs and services
 * to establish a complete banking integration. The process involves exchanging
 * tokens, retrieving account details, creating payment processing capabilities,
 * and persisting all necessary data for future operations.
 *
 * The multi-step process includes:
 * 1. Exchanging the temporary public token for a permanent access token
 * 2. Retrieving detailed account information from Plaid
 * 3. Creating a processor token for Dwolla integration
 * 4. Establishing a Dwolla funding source for money transfers
 * 5. Persisting the complete bank account record in the database
 * 6. Refreshing the application state to reflect the new account
 *
 * @param {ExchangePublicTokenProps} params - Token exchange and user information
 * @param {string} params.publicToken - The public token from Plaid Link success callback
 * @param {User} params.user - Complete user object with Dwolla customer information
 * @param {string} params.user.dwollaCustomerId - Dwolla customer ID for funding source creation
 * @param {string} params.user.$id - Appwrite user ID for database association
 * @returns {Promise<string>} Stringified success object indicating completion
 * @throws {Error} Throws error if any step fails: token exchange, API calls, or database operations
 *
 * @example
 * ```typescript
 * const result = await exchangePublicToken({
 *   publicToken: "public_token_from_link",
 *   user: currentUser
 * });
 * console.log("Bank account successfully linked:", result);
 * // User can now view their account and make transfers
 * ```
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
