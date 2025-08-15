"use server";

import { ID, Query } from "node-appwrite";
import {
  CreateTransactionProps,
  GetTransactionsByBankIdProps,
  GetCurrentMonthFinancialsProps,
  CurrentMonthFinancials,
  Transaction,
} from "#/types";
import { createAdminClient } from "../server/appwrite";
import { parseStringify, getCurrentMonthDateRange, isTransactionInCurrentMonth } from "@/lib/utils";
import { getBanks } from "./bank.actions";

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

/**
 * Calculates the total income and expenses for a user in the current month.
 *
 * This function retrieves all bank accounts associated with a user and analyzes
 * their transactions to calculate comprehensive financial metrics for the current
 * calendar month. It processes both internal transfers (between user accounts)
 * and external transactions to provide accurate income and expense totals.
 *
 * The function categorizes transactions based on the user's perspective:
 * - **Income**: Money received by the user (appears as receiver in transactions)
 * - **Expenses**: Money sent by the user (appears as sender in transactions)
 *
 * @param {GetCurrentMonthFinancialsProps} params - Object containing user identification
 * @param {string} params.userId - The unique identifier of the user whose financial data to calculate
 * @returns {Promise<CurrentMonthFinancials>} Comprehensive financial summary for the current month including:
 *   - `totalIncome`: Sum of all money received (positive number)
 *   - `totalExpenses`: Sum of all money sent (positive number)
 *   - `netAmount`: Net financial position (income - expenses)
 *   - `transactionCount`: Breakdown of transaction counts by type
 *   - `period`: Date range and period information for the calculation
 * @throws {Error} Throws error if user has no bank accounts, database queries fail, or access permissions are insufficient
 *
 * @example
 * ```typescript
 * const monthlyFinancials = await getCurrentMonthFinancials({ userId: "user123" });
 * console.log(`Current month summary for ${monthlyFinancials.period.month} ${monthlyFinancials.period.year}:`);
 * console.log(`Total Income: $${monthlyFinancials.totalIncome.toFixed(2)}`);
 * console.log(`Total Expenses: $${monthlyFinancials.totalExpenses.toFixed(2)}`);
 * console.log(`Net Amount: $${monthlyFinancials.netAmount.toFixed(2)}`);
 * console.log(`Transactions: ${monthlyFinancials.transactionCount.total} total`);
 * ```
 */
export const getCurrentMonthFinancials = async ({
  userId,
}: GetCurrentMonthFinancialsProps): Promise<CurrentMonthFinancials> => {
  try {
    // Get user's bank accounts
    const userBanks = await getBanks({ userId });

    if (!userBanks || userBanks.length === 0) {
      throw new Error("User has no connected bank accounts");
    }

    // Get current month date range
    const monthPeriod = getCurrentMonthDateRange();

    // Initialize totals
    let totalIncome = 0;
    let totalExpenses = 0;
    let incomeTransactionCount = 0;
    let expenseTransactionCount = 0;

    // Process transactions for each bank account
    for (const bank of userBanks) {
      const bankTransactionsResult = (await getTransactionsByBankId({
        bankId: bank.$id,
      })) as { total: number; documents: Transaction[] };

      const transactions = bankTransactionsResult.documents;

      // Filter transactions for current month and categorize
      for (const transaction of transactions) {
        // Check if transaction is in current month
        const transactionDate = transaction.date || transaction.$createdAt;
        if (!isTransactionInCurrentMonth(transactionDate)) {
          continue;
        }

        const amount = Math.abs(Number(transaction.amount) || 0);

        // Determine if this is income or expense from user's perspective
        // If user's bank is the receiver, it's income
        // If user's bank is the sender, it's expense
        if (transaction.receiverBankId === bank.$id) {
          totalIncome += amount;
          incomeTransactionCount++;
        } else if (transaction.senderBankId === bank.$id) {
          totalExpenses += amount;
          expenseTransactionCount++;
        }
      }
    }

    const result: CurrentMonthFinancials = {
      totalIncome,
      totalExpenses,
      netAmount: totalIncome - totalExpenses,
      transactionCount: {
        income: incomeTransactionCount,
        expenses: expenseTransactionCount,
        total: incomeTransactionCount + expenseTransactionCount,
      },
      period: {
        startDate: monthPeriod.startDate,
        endDate: monthPeriod.endDate,
        month: monthPeriod.month,
        year: monthPeriod.year,
      },
    };

    return parseStringify(result);
  } catch (error) {
    throw new Error("An error occurred while calculating current month financials: " + error);
  }
};
