"use server";

import {
  AddFundingSourceParams,
  CreateFundingSourceOptions,
  NewDwollaCustomerParams,
  TransferParams,
} from "#/types";
import { Client } from "dwolla-v2";

/**
 * Determines and validates the Dwolla environment configuration.
 *
 * This function reads the DWOLLA_ENV environment variable and ensures it's set to
 * a valid value. The environment determines which Dwolla API endpoints are used:
 * - "sandbox": For development and testing with simulated transactions
 * - "production": For live transactions with real money movement
 *
 * @returns {"production" | "sandbox"} The validated Dwolla environment setting
 * @throws {Error} Throws error if DWOLLA_ENV is not set to "sandbox" or "production"
 *
 * @example
 * ```typescript
 * const env = getEnvironment();
 * console.log(`Using Dwolla ${env} environment`);
 * ```
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
 * Pre-configured Dwolla API client instance.
 *
 * This client is initialized with environment-specific settings and API credentials
 * from environment variables. It serves as the primary interface for all Dwolla
 * API operations including customer creation, funding source management, and
 * money transfers. The client automatically handles authentication and request
 * formatting for the Dwolla API.
 */
const dwollaClient = new Client({
  environment: getEnvironment(),
  key: process.env.DWOLLA_KEY as string,
  secret: process.env.DWOLLA_SECRET as string,
});

/**
 * Creates a funding source in Dwolla using a Plaid processor token.
 *
 * This function establishes a connection between a bank account (authenticated
 * through Plaid) and a Dwolla customer account. The funding source enables
 * money movement to and from the linked bank account. The Plaid processor token
 * contains the necessary bank account information and authorization to create
 * the funding source without requiring micro-deposit verification.
 *
 * @param {CreateFundingSourceOptions} options - Configuration for creating the funding source
 * @param {string} options.customerId - The Dwolla customer ID to attach the funding source to
 * @param {string} options.fundingSourceName - Descriptive name for the funding source (typically bank name)
 * @param {string} options.plaidToken - Plaid processor token containing bank account authorization
 * @param {object} options._links - Dwolla authorization links from on-demand authorization
 * @returns {Promise<string | null>} URL of the newly created funding source, or null if creation fails
 * @throws {Error} Throws error if Dwolla API call fails or invalid parameters provided
 *
 * @example
 * ```typescript
 * const fundingSourceUrl = await createFundingSource({
 *   customerId: "customer_123",
 *   fundingSourceName: "Chase Checking Account",
 *   plaidToken: "processor_token_456",
 *   _links: authorizationLinks
 * });
 * console.log(`Funding source created: ${fundingSourceUrl}`);
 * ```
 */
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
 * Creates an on-demand authorization token for Dwolla operations.
 *
 * On-demand authorizations provide temporary permission for specific Dwolla
 * operations that require additional security verification. This is particularly
 * necessary when creating funding sources via third-party processors like Plaid,
 * as it bypasses the standard micro-deposit verification process. The authorization
 * contains security links that must be included in subsequent funding source
 * creation requests.
 *
 * @returns {Promise<object>} Authorization object containing _links with security tokens
 * @throws {Error} Throws error if Dwolla API call fails or authorization cannot be created
 *
 * @example
 * ```typescript
 * const authLinks = await createOnDemandAuthorization();
 * // Use authLinks in funding source creation
 * console.log("Authorization created successfully");
 * ```
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
 * Creates a new customer account in the Dwolla system.
 *
 * This function registers a new end-user in Dwolla's platform, creating a customer
 * profile that can hold funding sources and participate in money transfers. The
 * customer record includes personal information required for KYC (Know Your Customer)
 * compliance and fraud prevention. Once created, the customer can link bank accounts
 * and send/receive money through the Dwolla network.
 *
 * @param {NewDwollaCustomerParams} newCustomer - Complete customer information for registration
 * @param {string} newCustomer.firstName - Customer's legal first name
 * @param {string} newCustomer.lastName - Customer's legal last name
 * @param {string} newCustomer.email - Customer's email address for notifications
 * @param {string} newCustomer.type - Customer type, should be "personal" for individual accounts
 * @param {string} newCustomer.address1 - Primary street address
 * @param {string} newCustomer.city - City of residence
 * @param {string} newCustomer.state - State or province (two-letter code)
 * @param {string} newCustomer.postalCode - ZIP or postal code
 * @param {string} newCustomer.dateOfBirth - Date of birth in YYYY-MM-DD format
 * @param {string} newCustomer.ssn - Social Security Number (for US customers)
 * @returns {Promise<string | null>} URL of the newly created customer record, or null if creation fails
 * @throws {Error} Throws error if required information is missing or Dwolla API call fails
 *
 * @example
 * ```typescript
 * const customerUrl = await createDwollaCustomer({
 *   firstName: "John",
 *   lastName: "Doe",
 *   email: "john@example.com",
 *   type: "personal",
 *   address1: "123 Main St",
 *   city: "New York",
 *   state: "NY",
 *   postalCode: "10001",
 *   dateOfBirth: "1990-01-01",
 *   ssn: "123-45-6789"
 * });
 * console.log(`Customer created: ${customerUrl}`);
 * ```
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
 * Initiates a money transfer between two Dwolla funding sources.
 *
 * This function creates a transfer request in the Dwolla network to move money
 * from one funding source to another. The transfer includes the source (sender),
 * destination (receiver), and amount in USD. Dwolla processes the transfer
 * according to ACH network rules, which typically take 1-3 business days to
 * complete. The function returns a transfer URL that can be used to track
 * the transfer status and retrieve transfer details.
 *
 * @param {TransferParams} params - Transfer configuration and details
 * @param {string} params.sourceFundingSourceUrl - Dwolla URL of the sender's funding source
 * @param {string} params.destinationFundingSourceUrl - Dwolla URL of the receiver's funding source
 * @param {string} params.amount - Transfer amount in USD (e.g., "100.50")
 * @returns {Promise<string | null>} URL of the created transfer record for status tracking, or null if creation fails
 * @throws {Error} Throws error if funding source URLs are invalid or transfer cannot be created
 *
 * @example
 * ```typescript
 * const transferUrl = await createTransfer({
 *   sourceFundingSourceUrl: "https://api.dwolla.com/funding-sources/source_123",
 *   destinationFundingSourceUrl: "https://api.dwolla.com/funding-sources/dest_456",
 *   amount: "250.00"
 * });
 * console.log(`Transfer initiated: ${transferUrl}`);
 * ```
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
 * Orchestrates the complete process of adding a funding source to a Dwolla customer.
 *
 * This comprehensive function handles the multi-step process required to link
 * a bank account (authenticated via Plaid) to a Dwolla customer. The process
 * involves creating the necessary authorization tokens and then establishing
 * the funding source connection. This enables the customer to send and receive
 * money through their linked bank account within the Dwolla network.
 *
 * The function performs these operations:
 * 1. Creates an on-demand authorization for secure funding source creation
 * 2. Uses the authorization and Plaid processor token to create the funding source
 * 3. Returns the funding source URL for future money transfer operations
 *
 * @param {AddFundingSourceParams} params - Complete funding source configuration
 * @param {string} params.dwollaCustomerId - The Dwolla customer ID to add the funding source to
 * @param {string} params.processorToken - Plaid processor token containing bank account authorization
 * @param {string} params.bankName - Name of the bank for display and identification purposes
 * @returns {Promise<string | null>} URL of the newly created funding source, or null if any step fails
 * @throws {Error} Throws error if authorization creation or funding source creation fails
 *
 * @example
 * ```typescript
 * const fundingSourceUrl = await addFundingSource({
 *   dwollaCustomerId: "customer_123",
 *   processorToken: "processor_sandbox_abc123",
 *   bankName: "Chase Bank"
 * });
 * console.log(`Bank account linked: ${fundingSourceUrl}`);
 * ```
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
