"use server";

import {
  AddFundingSourceParams,
  CreateFundingSourceOptions,
  NewDwollaCustomerParams,
  TransferParams,
} from "#/types";
import { Client } from "dwolla-v2";

/**
 * Retrieves the Dwolla environment from the environment variables.
 * This function ensures that the application is configured to run in a valid Dwolla environment.
 *
 * @returns {"production" | "sandbox"} The Dwolla environment.
 * @throws {Error} If the DWOLLA_ENV environment variable is not set to "sandbox" or "production".
 */
const getEnvironment = (): "production" | "sandbox" => {
  const environment = process.env.DWOLLA_ENV as string;

  switch (environment) {
    case "sandbox":
      return "sandbox";
    case "production":
      return "production";
    default:
      throw new Error("Dwolla environment should either be set to `sandbox` or `production`");
  }
};

/**
 * The Dwolla API client instance.
 * This client is configured with the environment and credentials from the environment variables.
 * It is used to make all API calls to the Dwolla service.
 */
const dwollaClient = new Client({
  environment: getEnvironment(),
  key: process.env.DWOLLA_KEY as string,
  secret: process.env.DWOLLA_SECRET as string,
});

/**
 * Creates a Dwolla Funding Source using a Plaid Processor Token.
 * This function links a bank account, previously authenticated with Plaid, to a Dwolla customer.
 * The funding source is what allows money to be moved to and from the bank account.
 *
 * @param {CreateFundingSourceOptions} options - The options required to create the funding source.
 * @param {string} options.customerId - The Dwolla customer ID to which the funding source will be attached.
 * @param {string} options.fundingSourceName - A descriptive name for the funding source (e.g., the bank's name).
 * @param {string} options.plaidToken - The Plaid processor token obtained after exchanging the public token.
 * @returns {Promise<string | null>} A promise that resolves to the URL of the newly created funding source.
 * The URL is extracted from the "location" header of the API response. Returns null if the header is not present.
 * @throws {Error} If the API call to create the funding source fails.
 */
// Create a Dwolla Funding Source using a Plaid Processor Token
export const createFundingSource = async (
  options: CreateFundingSourceOptions,
): Promise<string | null> => {
  try {
    return await dwollaClient
      .post(`customers/${options.customerId}/funding-sources`, {
        name: options.fundingSourceName,
        plaidToken: options.plaidToken,
      })
      .then(res => res.headers.get("location"));
  } catch (error) {
    throw new Error("Failed to create a funding source in Dwolla: " + error);
  }
};

/**
 * Creates an On-Demand Authorization for Dwolla.
 * On-demand authorizations are used to grant temporary permission for certain actions,
 * such as creating a funding source without requiring micro-deposit verification.
 * This is a necessary step before adding a funding source via a Plaid processor token.
 *
 * @returns {Promise<unknown>} A promise that resolves to the _links object from the Dwolla API response,
 * which contains the authorization link needed for subsequent API calls.
 * @throws {Error} If the API call to create the on-demand authorization fails.
 */
export const createOnDemandAuthorization = async (): Promise<object> => {
  try {
    const onDemandAuthorization = await dwollaClient.post("on-demand-authorizations");
    const authLink = onDemandAuthorization.body._links;
    return authLink;
  } catch (error) {
    throw new Error("Failed to create an on-demand authorization in Dwolla: " + error);
  }
};

/**
 * Creates a new customer in Dwolla.
 * A Dwolla customer represents an end-user of the application. A customer record is required
 * before you can perform actions like creating funding sources or initiating transfers for that user.
 *
 * @param {NewDwollaCustomerParams} newCustomer - An object containing the personal information of the new customer,
 * such as first name, last name, email, address, and type (which should be "personal").
 * @returns {Promise<string | null>} A promise that resolves to the URL of the newly created Dwolla customer.
 * This URL is the unique identifier for the customer in the Dwolla system. Returns null if the location header is not present.
 * @throws {Error} If the API call to create the customer fails.
 */
export const createDwollaCustomer = async (
  newCustomer: NewDwollaCustomerParams,
): Promise<string | null> => {
  try {
    return await dwollaClient
      .post("customers", newCustomer)
      .then(res => res.headers.get("location"));
  } catch (error) {
    throw new Error("Failed to create a Dwolla customer: " + error);
  }
};

/**
 * Initiates a transfer of funds between two Dwolla funding sources.
 * This function constructs and sends a transfer request to the Dwolla API.
 *
 * @param {TransferParams} params - The parameters for the transfer.
 * @param {string} params.sourceFundingSourceUrl - The URL of the funding source from which the money will be debited.
 * @param {string} params.destinationFundingSourceUrl - The URL of the funding source to which the money will be credited.
 * @param {string} params.amount - The amount of money to transfer, as a string (e.g., "100.50").
 * @returns {Promise<string | null>} A promise that resolves to the URL of the newly created transfer record.
 * This URL can be used to track the status of the transfer. Returns null if the location header is not present.
 * @throws {Error} If the API call to create the transfer fails.
 */
export const createTransfer = async ({
  sourceFundingSourceUrl,
  destinationFundingSourceUrl,
  amount,
}: TransferParams): Promise<string | null> => {
  try {
    const requestBody = {
      _links: {
        source: {
          href: sourceFundingSourceUrl,
        },
        destination: {
          href: destinationFundingSourceUrl,
        },
      },
      amount: {
        currency: "USD",
        value: amount,
      },
    };
    return await dwollaClient
      .post("transfers", requestBody)
      .then(res => res.headers.get("location"));
  } catch (error) {
    throw new Error("Failed to transfer funds in Dwolla: " + error);
  }
};

/**
 * A comprehensive function to add a new funding source to a Dwolla customer.
 * This function orchestrates the necessary steps:
 * 1. Creates an on-demand authorization token.
 * 2. Uses this token along with a Plaid processor token to create and link a new funding source.
 *
 * @param {AddFundingSourceParams} params - The parameters required to add the funding source.
 * @param {string} params.dwollaCustomerId - The ID of the Dwolla customer.
 * @param {string} params.processorToken - The processor token obtained from Plaid.
 * @param {string} params.bankName - The name of the bank, used as the funding source name.
 * @returns {Promise<string | null>} A promise that resolves to the URL of the newly created funding source.
 * @throws {Error} If any step in the process (creating authorization or the funding source) fails.
 */
export const addFundingSource = async ({
  dwollaCustomerId,
  processorToken,
  bankName,
}: AddFundingSourceParams): Promise<string | null> => {
  try {
    // create dwolla auth link
    const dwollaAuthLinks = await createOnDemandAuthorization();

    // add funding source to the dwolla customer & get the funding source url
    const fundingSourceOptions = {
      customerId: dwollaCustomerId,
      fundingSourceName: bankName,
      plaidToken: processorToken,
      _links: dwollaAuthLinks,
    };
    return await createFundingSource(fundingSourceOptions);
  } catch (error) {
    throw new Error("Failed to add a funding source in Dwolla: " + error);
  }
};
