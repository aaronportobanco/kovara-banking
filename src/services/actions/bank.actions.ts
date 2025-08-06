"use server";

import {
  CountryCode,
  /* ACHClass,
  TransferAuthorizationCreateRequest,
  TransferCreateRequest,
  TransferNetwork,
  TransferType, */
} from "plaid";

import { plaidClient } from "../server/plaid";
import * as Sentry from "@sentry/nextjs";
import { parseStringify } from "@/lib/utils";
//import { getTransactionsByBankId } from "./transaction.actions";
import {
  Account,
  Bank,
  GetAccountProps,
  GetAccountsProps,
  GetBankProps,
  GetBanksProps,
  GetInstitutionProps,
  GetTransactionsProps,
  Transaction,
} from "#/types";
import { createAdminClient } from "../server/appwrite";
import { Query } from "node-appwrite";
import { getTransactionsByBankId } from "./transactions.actions";

// Add proper return type interfaces
interface GetAccountsResponse {
  data: Account[];
  totalBanks: number;
  totalCurrentBalance: number;
}

interface GetAccountResponse {
  data: Account;
  transactions: Transaction[];
}

// Destructuring environment variables to access Appwrite database and collection IDs.
const { APPWRITE_DATABASE_ID, APPWRITE_BANK_COLLECTION_ID } = process.env;

/**
 * Retrieves all bank accounts associated with a specific user.
 *
 * This function fetches bank records from the Appwrite database, then for each bank:
 * - Retrieves detailed account information from Plaid using the stored access token
 * - Fetches institution details from Plaid
 * - Calculates aggregated financial data (total banks and current balance)
 *
 * @param {GetAccountsProps} params - Object containing user identification
 * @param {string} params.userId - The unique identifier of the user whose accounts to fetch
 * @returns {Promise<GetAccountsResponse>}
 *   Object containing array of account details, total number of linked banks, and sum of all current balances
 * @throws {Error} Throws error if database query fails or Plaid API calls encounter issues
 *
 * @example
 * ```typescript
 * const userAccounts = await getAccounts({ userId: "user123" });
 * console.log(`User has ${userAccounts.totalBanks} banks with total balance: $${userAccounts.totalCurrentBalance}`);
 * ```
 */
export const getAccounts = async ({ userId }: GetAccountsProps): Promise<GetAccountsResponse> => {
  try {
    // get banks from db
    const banks = await getBanks({ userId });

    const accounts = await Promise.all(
      banks?.map(async (bank: Bank) => {
        // get each account info from plaid
        const accountsResponse = await plaidClient.accountsGet({
          // eslint-disable-next-line @typescript-eslint/naming-convention
          access_token: bank.accessToken,
        });
        const accountData = accountsResponse.data.accounts[0];

        // get institution info from plaid
        const institution = await getInstitution({
          institutionId: accountsResponse.data.item.institution_id!,
        });

        // eslint-disable-next-line @typescript-eslint/naming-convention
        const institutionData = institution as { institution_id: string };

        const account: Account = {
          id: accountData.account_id,
          availableBalance: accountData.balances.available!,
          currentBalance: accountData.balances.current!,
          institutionId: institutionData.institution_id,
          name: accountData.name,
          officialName: accountData.official_name || accountData.name,
          mask: accountData.mask!,
          type: accountData.type as string,
          subtype: accountData.subtype! as string,
          appwriteItemId: bank.$id,
          sharableId: bank.sharableId || bank.$id, // Ensure sharableId is always a string
        };

        return account;
      }),
    );

    const totalBanks = accounts.length;
    const totalCurrentBalance = accounts.reduce((total, account) => {
      return total + account.currentBalance;
    }, 0);

    return parseStringify({ data: accounts, totalBanks, totalCurrentBalance });
  } catch (error) {
    throw new Error("An error occurred while getting the accounts: " + error);
  }
};

/**
 * Retrieves comprehensive details for a single bank account.
 *
 * This function provides a complete view of a bank account by:
 * - Fetching bank record from Appwrite database using the document ID
 * - Retrieving current account details and balances from Plaid
 * - Getting transaction history from both Plaid and internal transfer records
 * - Fetching institution information for display purposes
 * - Merging and sorting all transactions chronologically
 *
 * @param {GetAccountProps} params - Object containing account identification
 * @param {string} params.appwriteItemId - The Appwrite document ID of the bank record to fetch
 * @returns {Promise<GetAccountResponse>}
 *   Object containing detailed account information and chronologically sorted transaction history
 * @throws {Error} Throws error if bank record not found, Plaid API fails, or transaction retrieval fails
 *
 * @example
 * ```typescript
 * const accountDetails = await getAccount({ appwriteItemId: "bank_doc_123" });
 * console.log(`Account balance: $${accountDetails.data.currentBalance}`);
 * console.log(`Total transactions: ${accountDetails.transactions.length}`);
 * ```
 */
export const getAccount = async ({
  appwriteItemId,
}: GetAccountProps): Promise<GetAccountResponse> => {
  try {
    // get bank from db
    const bankData = (await getBank({ documentId: [appwriteItemId] })) as Bank[];

    if (!bankData || bankData.length === 0) {
      throw new Error("Bank not found");
    }

    const bank = bankData[0];

    // Validate access token exists
    if (!bank.accessToken) {
      throw new Error("Bank access token not found");
    }

    // get account info from plaid
    const accountsResponse = await plaidClient.accountsGet({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      access_token: bank.accessToken,
    });
    const accountData = accountsResponse.data.accounts[0];

    // get transfer transactions from appwrite
    const transferTransactionsData = await getTransactionsByBankId({
      bankId: bank.$id,
    });

    const transferTransactions = (
      transferTransactionsData as { documents: Transaction[] }
    ).documents.map((transferData: Transaction) => ({
      id: transferData.$id,
      name: transferData.name!,
      amount: transferData.amount!,
      date: transferData.$createdAt,
      paymentChannel: transferData.channel,
      category: transferData.category,
      type: transferData.senderBankId === bank.$id ? "debit" : "credit",
    }));

    // get institution info from plaid
    const institution = await getInstitution({
      institutionId: accountsResponse.data.item.institution_id!,
    });

    // Get the latest transactions from Plaid with error handling
    let transactions: Transaction[] = [];
    try {
      transactions = (await getTransactions({
        accessToken: bank.accessToken,
      })) as Transaction[];
    } catch (transactionError) {
      console.error("Failed to fetch Plaid transactions:", transactionError);
      Sentry.captureException(transactionError);
      // Continue without Plaid transactions - we still have transfer transactions
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const institutionData = institution as { institution_id: string };

    const account: Account = {
      id: accountData.account_id,
      availableBalance: accountData.balances.available!,
      currentBalance: accountData.balances.current!,
      institutionId: institutionData.institution_id,
      name: accountData.name,
      officialName: accountData.official_name || accountData.name,
      mask: accountData.mask!,
      type: accountData.type as string,
      subtype: accountData.subtype! as string,
      appwriteItemId: bank.$id,
      sharableId: bank.sharableId || bank.$id,
    };

    // sort transactions by date such that the most recent transaction is first
    const allTransactions = [...transactions, ...transferTransactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    return parseStringify({
      data: account,
      transactions: allTransactions,
    });
  } catch (error) {
    Sentry.captureException(error);
    throw new Error("An error occurred while getting the account: " + error);
  }
};

/**
 * Retrieves financial institution details from Plaid.
 *
 * This function fetches comprehensive information about a financial institution
 * including name, logo, colors, and other metadata used for display purposes.
 * The data is retrieved using Plaid's institutions API with US country code.
 *
 * @param {GetInstitutionProps} params - Object containing institution identification
 * @param {string} params.institutionId - The Plaid institution ID to fetch details for
 * @returns {Promise<Institution>} Institution object containing name, logo, colors, and other metadata
 * @throws {Error} Throws error if institution ID is invalid or Plaid API call fails
 *
 * @example
 * ```typescript
 * const institution = await getInstitution({ institutionId: "ins_1" });
 * console.log(`Bank name: ${institution.name}`);
 * ```
 */
export const getInstitution = async ({ institutionId }: GetInstitutionProps): Promise<unknown> => {
  try {
    const institutionResponse = await plaidClient.institutionsGetById({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      institution_id: institutionId,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      country_codes: ["US"] as CountryCode[],
    });

    const intitution = institutionResponse.data.institution;

    return parseStringify(intitution);
  } catch (error) {
    throw new Error("An error occurred while getting the accounts:" + error);
  }
};

/**
 * Retrieves transaction history for a bank account using Plaid's sync API.
 *
 * This function uses Plaid's transactionsSync endpoint to efficiently fetch
 * new and updated transactions. It handles pagination automatically by
 * continuing to make requests while `has_more` is true. The function transforms
 * raw Plaid transaction data into a standardized format for the application.
 *
 * @param {GetTransactionsProps} params - Object containing access credentials
 * @param {string} params.accessToken - The Plaid access token for the specific bank account
 * @returns {Promise<Transaction[]>} Array of standardized transaction objects with id, name, amount, date, etc.
 * @throws {Error} Throws error if access token is invalid or Plaid API encounters issues
 *
 * @example
 * ```typescript
 * const transactions = await getTransactions({ accessToken: "access_token_123" });
 * transactions.forEach(tx => console.log(`${tx.name}: $${tx.amount}`));
 * ```
 */
export const getTransactions = async ({ accessToken }: GetTransactionsProps): Promise<unknown> => {
  let hasMore = true;
  let transactions: unknown = [];

  try {
    // Validate access token
    if (!accessToken) {
      throw new Error("Access token is required");
    }

    // Iterate through each page of new transaction updates for item
    while (hasMore) {
      const response = await plaidClient.transactionsSync({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        access_token: accessToken,
      });

      const data = response.data;

      transactions = response.data.added.map(transaction => ({
        id: transaction.transaction_id,
        name: transaction.name,
        paymentChannel: transaction.payment_channel,
        type: transaction.payment_channel,
        accountId: transaction.account_id,
        amount: transaction.amount,
        pending: transaction.pending,
        category: transaction.category ? transaction.category[0] : "",
        date: transaction.date,
        image: transaction.logo_url,
      }));

      hasMore = data.has_more;
    }

    return parseStringify(transactions);
  } catch (error) {
    // Log more detailed error information
    console.error("Plaid transactions error:", {
      error: error,
      accessToken: accessToken ? "***exists***" : "missing",
    });

    Sentry.captureException(error, {
      tags: {
        function: "getTransactions",
        service: "plaid",
      },
      extra: {
        hasAccessToken: !!accessToken,
        errorMessage: error instanceof Error ? error.message : String(error),
      },
    });

    throw new Error("An error occurred while getting the transactions: " + error);
  }
};

/**
 * Retrieves all bank records associated with a specific user from Appwrite database.
 *
 * This function queries the Appwrite database to fetch all bank accounts
 * that belong to a particular user. It's typically used as a helper function
 * by other functions that need to iterate over a user's connected banks.
 *
 * @param {GetBanksProps} params - Object containing user identification
 * @param {string} params.userId - The unique identifier of the user whose banks to fetch
 * @returns {Promise<Bank[]>} Array of bank records containing access tokens, shareable IDs, and metadata
 * @throws {Error} Throws error if database query fails or user has no accessible banks
 *
 * @example
 * ```typescript
 * const userBanks = await getBanks({ userId: "user123" });
 * console.log(`User has ${userBanks.length} connected banks`);
 * ```
 */
export const getBanks = async ({ userId }: GetBanksProps): Promise<Bank[]> => {
  try {
    const { database } = await createAdminClient();

    const banks = await database.listDocuments(
      APPWRITE_DATABASE_ID!,
      APPWRITE_BANK_COLLECTION_ID!,
      [Query.equal("userId", [userId])],
    );

    return parseStringify(banks.documents);
  } catch (error) {
    throw new Error("An error occurred while getting the banks: " + error);
  }
};

/**
 * Retrieves a specific bank record from Appwrite database by document ID.
 *
 * This function fetches a single bank record using its Appwrite document ID.
 * It's used when you need to access a specific bank's details, including
 * the access token required for Plaid API calls.
 *
 * @param {GetBankProps} params - Object containing bank identification
 * @param {string[]} params.documentId - Array containing the Appwrite document ID of the bank to fetch
 * @returns {Promise<Bank[]>} Array of bank records (typically containing one element)
 * @throws {Error} Throws error if document ID is invalid or database query fails
 *
 * @example
 * ```typescript
 * const banks = await getBank({ documentId: ["bank_doc_123"] });
 * const bank = banks[0];
 * console.log(`Bank access token: ${bank.accessToken}`);
 * ```
 */
export const getBank = async ({ documentId }: GetBankProps): Promise<Bank[]> => {
  try {
    const { database } = await createAdminClient();

    const bank = await database.listDocuments(APPWRITE_DATABASE_ID!, APPWRITE_BANK_COLLECTION_ID!, [
      Query.equal("$id", documentId),
    ]);

    return parseStringify(bank.documents);
  } catch (error) {
    throw new Error("An error occurred while getting the bank: " + error);
  }
};
