"use server";

import { AppwriteException, ID, Query } from "node-appwrite";
import * as Sentry from "@sentry/nextjs";
import { createAdminClient, createSessionClient } from "../server/appwrite";
import { cookies } from "next/headers";
import { extractCustomerIdFromUrl, parseStringify } from "@/lib/utils";
import { LoginSchemaType } from "@/schemas/loginSchema";
import { redirect } from "next/navigation";
import { GetUserInfoProps, User } from "#/types";
import { createDwollaCustomer } from "./dwolla.actions";
import { SignUpSchemaType } from "@/schemas/signUpSchema";

// Destructuring environment variables to access Appwrite database and collection IDs.
const { APPWRITE_DATABASE_ID, APPWRITE_USER_COLLECTION_ID } = process.env;

/**
 * Registers a new user in the Kovara Banking system.
 *
 * This function handles the complete user registration process by orchestrating
 * multiple services and database operations. It creates accounts across different
 * platforms and establishes user authentication. The process includes:
 * - Creating a Dwolla customer account for payment processing capabilities
 * - Setting up Appwrite authentication account with secure credentials
 * - Storing comprehensive user profile data in the database
 * - Establishing an authenticated session with secure cookie management
 *
 * @param {SignUpSchemaType} userData - Complete user registration data validated by Zod schema
 * @param {string} userData.password - User's chosen password for authentication
 * @param {string} userData.email - User's email address (must be unique)
 * @param {string} userData.firstName - User's first name
 * @param {string} userData.lastName - User's last name
 * @param {string} userData.address1 - Primary address line
 * @param {string} userData.city - City of residence
 * @param {string} userData.state - State or province
 * @param {string} userData.postalCode - ZIP or postal code
 * @param {string} userData.dateOfBirth - Date of birth in YYYY-MM-DD format
 * @param {string} userData.ssn - Social Security Number (encrypted/secured)
 * @returns {Promise<User>} Newly created user object with all profile data and system IDs
 * @throws {Error} Throws specific error messages for duplicate accounts, Dwolla failures, or system issues
 *
 * @example
 * ```typescript
 * const newUser = await signUp({
 *   email: "john@example.com",
 *   password: "securePassword123",
 *   firstName: "John",
 *   lastName: "Doe",
 *   address1: "123 Main St",
 *   city: "New York",
 *   state: "NY",
 *   postalCode: "10001",
 *   dateOfBirth: "1990-01-01",
 *   ssn: "123-45-6789"
 * });
 * console.log(`User created with ID: ${newUser.$id}`);
 * ```
 */
export const signUp = async ({ password, ...userData }: SignUpSchemaType): Promise<User> => {
  const { email, firstName, lastName } = userData;

  let dwollaCustomerUrl;
  try {
    // 1. Create a Dwolla customer. This is a critical first step.
    dwollaCustomerUrl = await createDwollaCustomer({
      ...userData,
      type: "personal",
    });

    if (!dwollaCustomerUrl) {
      // This error is specific and indicates a problem with the Dwolla integration.
      throw new Error("Error creating Dwolla customer.");
    }

    // 2. Create Appwrite user account & database document
    const { account, database } = await createAdminClient();

    const newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`,
    );

    if (!APPWRITE_DATABASE_ID || !APPWRITE_USER_COLLECTION_ID) {
      throw new Error("Database configuration is missing.");
    }

    const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

    const newUser = await database.createDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_USER_COLLECTION_ID,
      ID.unique(),
      {
        ...userData,
        userId: newUserAccount.$id,
        dwollaCustomerId,
        dwollaCustomerUrl,
      },
    );

    // 3. Create session and set cookie
    const session = await account.createEmailPasswordSession(email, password);

    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(newUser);
  } catch (error) {
    // Specific error for existing user conflicts.
    if (error instanceof AppwriteException && error.code === 409) {
      throw new Error("An account with this email already exists.");
    }

    // Log any other unexpected errors to Sentry.
    Sentry.captureException(error);

    // Provide a generic, user-friendly error message.
    throw new Error("An unexpected error occurred during sign-up. Please try again." + error);
  }
};

/**
 * Retrieves the currently authenticated user's complete profile data.
 *
 * This function verifies the active session using the session cookie and fetches
 * the corresponding user document from the database. It handles both the authentication
 * verification and data retrieval in a single operation. The function is designed
 * to handle cases where the session exists but the user document might be missing
 * (indicating a data integrity issue).
 *
 * @returns {Promise<User | null>} Complete user profile object if authenticated, null if no active session
 * @throws {Error} Throws error for data integrity issues or unexpected system failures
 *
 * @example
 * ```typescript
 * const currentUser = await getLoggedInUser();
 * if (currentUser) {
 *   console.log(`Welcome back, ${currentUser.firstName}!`);
 * } else {
 *   console.log("No user is currently logged in");
 * }
 * ```
 */
export async function getLoggedInUser(): Promise<User | null> {
  try {
    const { account } = await createSessionClient();
    const result = await account.get();

    const user = await getUserInfo({ userId: result.$id });

    // This handles a potential data integrity issue where an auth user exists
    // but their corresponding database document does not.
    if (!user) {
      throw new Error(`Data integrity issue: User document not found for auth ID ${result.$id}`);
    }

    return parseStringify(user);
  } catch {
    // When no user is logged in, Appwrite throws an error.
    // We catch it and return null, which is the expected behavior.
    // We don't need to log this to Sentry as it's not an application error.
    return null;
  }
}

/**
 * Fetches user profile information from the Appwrite database by user ID.
 *
 * This function queries the user collection to retrieve a complete user document
 * based on the Appwrite Authentication user ID. It's primarily used as a helper
 * function by other authentication-related operations. The function handles cases
 * where no user document exists for a given authentication ID.
 *
 * @param {GetUserInfoProps} params - Object containing user identification
 * @param {string} params.userId - The Appwrite Authentication user ID to look up
 * @returns {Promise<User | null>} User document with profile data, or null if not found
 * @throws {Error} Throws error for database connection issues or query failures
 *
 * @example
 * ```typescript
 * const userProfile = await getUserInfo({ userId: "auth_user_123" });
 * if (userProfile) {
 *   console.log(`User: ${userProfile.firstName} ${userProfile.lastName}`);
 * }
 * ```
 */
export const getUserInfo = async ({ userId }: GetUserInfoProps): Promise<User | null> => {
  try {
    const { database } = await createAdminClient();

    const user = await database.listDocuments(APPWRITE_DATABASE_ID!, APPWRITE_USER_COLLECTION_ID!, [
      Query.equal("userId", [userId]),
    ]);

    // Handle the expected case where no document is found for the given userId.
    if (user.documents.length === 0) {
      return null;
    }

    return parseStringify(user.documents[0]) as User;
  } catch (error) {
    // This is an unexpected error (e.g., Appwrite is down, network issue).
    // We log it to Sentry and re-throw so the calling function knows something went wrong.
    Sentry.captureException(error);
    throw new Error("Failed to retrieve user information from the database." + error);
  }
};

/**
 * Authenticates a user and establishes a secure session.
 *
 * This function handles the complete sign-in process by verifying user credentials
 * against Appwrite's authentication system and creating a secure session. Upon
 * successful authentication, it sets an HTTP-only session cookie and retrieves
 * the user's profile data. The function includes comprehensive error handling
 * for both expected authentication failures and unexpected system errors.
 *
 * @param {LoginSchemaType} credentials - User login credentials validated by Zod schema
 * @param {string} credentials.email - User's registered email address
 * @param {string} credentials.password - User's password for authentication
 * @returns {Promise<User>} Complete user profile data upon successful authentication
 * @throws {Error} Throws specific errors for invalid credentials or system failures
 *
 * @example
 * ```typescript
 * try {
 *   const user = await signIn({
 *     email: "john@example.com",
 *     password: "userPassword123"
 *   });
 *   console.log(`Successfully logged in: ${user.firstName}`);
 * } catch (error) {
 *   console.error("Login failed:", error.message);
 * }
 * ```
 */
export const signIn = async ({ email, password }: LoginSchemaType): Promise<User> => {
  try {
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    const user = await getUserInfo({ userId: session.userId });

    if (!user) {
      // This case should ideally not happen if session creation succeeds.
      // It indicates a potential data sync issue.
      throw new Error("User data not found after login.");
    }

    return parseStringify(user);
  } catch (error) {
    // Differentiate between expected user errors and unexpected system errors.
    if (error instanceof AppwriteException && error.code === 401) {
      // This is an EXPECTED case: the user provided invalid credentials.
      // We do NOT log this to Sentry. We throw a user-friendly error.
      throw new Error("Invalid email or password.");
    }

    // For all other errors, it's an UNEXPECTED problem.
    Sentry.captureException(error);
    throw new Error("An unexpected error occurred during sign-in. Please try again." + error);
  }
};

/**
 * Signs out the current user and cleans up session data.
 *
 * This function handles the complete logout process by terminating the server-side
 * session in Appwrite and removing the client-side session cookie. It includes
 * robust error handling to ensure client-side cleanup occurs even if server-side
 * session deletion fails. Upon completion, the user is automatically redirected
 * to the sign-in page. The function is designed to be fail-safe, prioritizing
 * user security by always clearing client-side state.
 *
 * @returns {Promise<void>} Redirects to sign-in page upon completion, never returns normally
 * @throws {Error} Logs unexpected errors to Sentry but continues with logout process
 *
 * @example
 * ```typescript
 * // User will be redirected after this call
 * await signOut();
 * // This code will not execute due to redirect
 * ```
 */
export const signOut = async (): Promise<void> => {
  try {
    const { account } = await createSessionClient();
    await account.deleteSession("current");
  } catch (error) {
    // If the error is anything OTHER than "user is not logged in" (401),
    // it's an unexpected problem. We should log it to Sentry.
    if (!(error instanceof AppwriteException && error.code === 401)) {
      Sentry.captureException(error);
      // We don't re-throw here because the primary goal is to clear the client
      // state and redirect, which happens in `finally`.
    }
    // If it IS the 401 error, we can safely ignore it.
    // The user is already logged out on the server, which is our goal.
  } finally {
    // This block ALWAYS runs, ensuring the client-side is cleaned up.
    (await cookies()).delete("appwrite-session");
    redirect("/sign-in");
  }
};
