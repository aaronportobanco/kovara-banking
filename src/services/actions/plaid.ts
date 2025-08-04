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

export const createLinkToken = async (user: User): Promise<void> => {
  try {
    const tokensParams = {
      // need to update the keys in your tokensParams object to use snake_case
      // as required by the LinkTokenCreateRequest type (i.e., use client_name and country_codes).
      user: {
        client_user_id: user.$id,
      },
      client_name: user.name,
      products: ["auth"] as Products[],
      language: "en",
      country_codes: ["US"] as CountryCode[],
    };

    const response = await plaidClient.linkTokenCreate(tokensParams);
    return parseStringify({ linkToken: response.data.link_token });
  } catch (error) {
    // Handle error
    // eslint-disable-next-line no-console
    console.error("Error creating link token:", error);
    throw error;
  }
};

export const createBankAccount = async ({
  bank_user_id,
  bank_id,
  bank_account_id,
  bank_access_token,
  bank_funding_source_url,
  bank_sharable_id,
}: CreateBankAccountProps): Promise<void> => {
  try {
    // Create a bank account as a document in our DB
    const { database } = await createAdminClient();

    const bankAccount = await database.createDocument(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      ID.unique(),
      {
        bank_user_id,
        bank_id,
        bank_account_id,
        bank_access_token,
        bank_funding_source_url,
        bank_sharable_id,
      },
    );

    return parseStringify(bankAccount);
  } catch (error) {
    // Handle error
    // eslint-disable-next-line no-console
    console.error("Error creating bank account:", error);
    throw error;
  }
};

export const exchangePublicToken = async ({
  publicToken,
  user,
}: ExchangePublicTokenProps): Promise<void> => {
  try {
    // Exchange the public token for an access token and Item ID
    const response = await plaidClient.itemPublicTokenExchange({ public_token: publicToken });
    const bank_access_token = response.data.access_token;
    const itemId = response.data.item_id;

    // Get the account information from plaid
    // using the access token

    const accountsResponse = await plaidClient.accountsGet({
      access_token: bank_access_token,
    });

    const accountData = accountsResponse.data.accounts[0];

    // Create a processor token for Dwolla using the access token and account ID
    const request: ProcessorTokenCreateRequest = {
      access_token: bank_access_token,
      account_id: accountData.account_id,
      processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
    };

    const processorTokenResponse = await plaidClient.processorTokenCreate(request);
    const processorToken = processorTokenResponse.data.processor_token;

    // Create a funding source URL for the account using the Dwolla customer ID, processor token and bank name
    const bank_funding_source_url = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: accountData.name,
    });

    // If funding source URL is not created, throw an error
    if (!bank_funding_source_url) {
      throw new Error("Failed to create funding source URL");
    }

    // Create a new bank account
    await createBankAccount({
      bank_user_id: user.$id,
      bank_id: itemId,
      bank_account_id: accountData.account_id,
      bank_access_token,
      bank_funding_source_url,
      bank_sharable_id: encryptId(accountData.account_id),
    });

    // Revalidate the path to reflect the changes
    revalidatePath("/");

    // Return a success response
    return parseStringify({
      publicTokenExchange: "complete",
    });
  } catch (error) {
    // Handle error
    // eslint-disable-next-line no-console
    console.error("Error exchanging public token:", error);
    throw error;
  }
};
