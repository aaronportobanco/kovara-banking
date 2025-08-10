"use server";

import { ID, Query } from "node-appwrite";
import { CreateTransactionProps, GetTransactionsByBankIdProps } from "#/types";
import { createAdminClient } from "../server/appwrite";
import { parseStringify } from "@/lib/utils";

// Destructuring environment variables to access Appwrite database and transactions IDs.
const { APPWRITE_DATABASE_ID, APPWRITE_TRANSACTION_COLLECTION_ID } = process.env;

/**
 * Creates a new internal transaction record in the Appwrite database.
 *
 * This function is specifically designed to log internal transfers between user accounts
 * within the Kovara Banking application. It automatically sets the transaction channel
 * to "online" and category to "Transfer" while accepting all other transaction details
 * from the provided parameters. Each transaction receives a unique ID from Appwrite.
 *
 * @param {CreateTransactionProps} transaction - Complete transaction details for the internal transfer
 * @param {string} transaction.senderBankId - The Appwrite document ID of the sender's bank account
 * @param {string} transaction.receiverBankId - The Appwrite document ID of the receiver's bank account
 * @param {number} transaction.amount - The transfer amount in dollars (positive number)
 * @param {string} transaction.name - Description or purpose of the transaction
 * @param {string} transaction.email - Email address of the transaction recipient
 * @returns {Promise<Transaction>} The newly created transaction object with Appwrite metadata
 * @throws {Error} Throws error if database connection fails, validation errors, or document creation fails
 *
 * @example
 * ```typescript
 * const newTransfer = await createTransaction({
 *   senderBankId: "bank_123",
 *   receiverBankId: "bank_456",
 *   amount: 250.00,
 *   name: "Rent payment",
 *   email: "landlord@example.com"
 * });
 * console.log(`Transfer created with ID: ${newTransfer.$id}`);
 * ```
 */
export const createTransaction = async (transaction: CreateTransactionProps): Promise<unknown> => {
  try {
    const { database } = await createAdminClient();

    const newTransaction = await database.createDocument(
      APPWRITE_DATABASE_ID!,
      APPWRITE_TRANSACTION_COLLECTION_ID!,
      ID.unique(),
      {
        channel: "online",
        category: "transfer",
        ...transaction,
      },
    );

    return parseStringify(newTransaction);
  } catch (error) {
    throw new Error("An error occurred while creating the transaction: " + error);
  }
};

/**
 * Retrieves all transaction records associated with a specific bank account.
 *
 * This function performs comprehensive transaction retrieval by querying the Appwrite
 * database for transactions where the specified bank account appears as either the
 * sender or receiver. It combines both outgoing and incoming transactions to provide
 * a complete transaction history for the account. The results include transaction
 * metadata such as total count and all document details.
 *
 * @param {GetTransactionsByBankIdProps} params - Object containing bank account identification
 * @param {string} params.bankId - The Appwrite document ID of the bank account to query transactions for
 * @returns {Promise<{ total: number; documents: Transaction[]; }>}
 *   Object containing total transaction count and array of transaction documents with full details
 * @throws {Error} Throws error if database queries fail, bank ID is invalid, or access permissions are insufficient
 *
 * @example
 * ```typescript
 * const bankTransactions = await getTransactionsByBankId({ bankId: "bank_123" });
 * console.log(`Found ${bankTransactions.total} transactions`);
 * bankTransactions.documents.forEach(tx =>
 *   console.log(`${tx.name}: $${tx.amount} on ${tx.$createdAt}`)
 * );
 * ```
 */
export const getTransactionsByBankId = async ({
  bankId,
}: GetTransactionsByBankIdProps): Promise<unknown> => {
  try {
    const { database } = await createAdminClient();

    const senderTransactions = await database.listDocuments(
      APPWRITE_DATABASE_ID!,
      APPWRITE_TRANSACTION_COLLECTION_ID!,
      [Query.equal("senderBankId", bankId)],
    );

    const receiverTransactions = await database.listDocuments(
      APPWRITE_DATABASE_ID!,
      APPWRITE_TRANSACTION_COLLECTION_ID!,
      [Query.equal("receiverBankId", bankId)],
    );

    const transactions = {
      total: senderTransactions.total + receiverTransactions.total,
      documents: [...senderTransactions.documents, ...receiverTransactions.documents],
    };

    return parseStringify(transactions);
  } catch (error) {
    throw new Error("An error occurred while getting transactions: " + error);
  }
};
