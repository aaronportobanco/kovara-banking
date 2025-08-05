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
 * Registers a new user in the application.
 * This function is responsible for:
 * 1. Creating a customer in Dwolla for payment processing. This is the first step to ensure data validity before creating an app user.
 * 2. Creating a user account in Appwrite Authentication.
 * 3. Saving user data and references to Appwrite and Dwolla in the database.
 * 4. Starting a session for the new user and setting a session cookie.
 *
 * @param {SignUpSchemaType} { password, ...userData } - The user's data for registration, with the password separated for processing.
 * @returns {Promise<SignUpSchemaType>} A promise that resolves with the data of the new user saved in the database.
 * @throws {Error} Throws an error if Dwolla customer creation, user creation, or session creation fails.
 */
export const signUp = async ({
  password,
  ...userData
}: SignUpSchemaType): Promise<SignUpSchemaType> => {
  const { email, firstName, lastName } = userData; // Destructure for clarity

  try {
    // Create a Dwolla customer for the new user
    const dwollaCustomerUrl = await createDwollaCustomer({
      ...userData,
      type: "personal",
    });

    if (!dwollaCustomerUrl) {
      // Specific error for Dwolla failure
      throw new Error("Failed to create Dwolla customer.");
    }

    // Get Appwrite admin client for server-side operations
    const { account, database } = await createAdminClient();

    // Create a new user account in Appwrite
    const newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`,
    );

    // Extract the Dwolla customer ID from the URL
    const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

    if (!APPWRITE_DATABASE_ID || !APPWRITE_USER_COLLECTION_ID) {
      throw new Error("Database configuration is missing.");
    }

    // Create a new document in the users collection with all user data
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

    // Create a session for the new user to log them in immediately
    const session = await account.createEmailPasswordSession(email, password);

    // Set the session cookie in the browser
    const cookieStore = await cookies();
    cookieStore.set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(newUser); // Return the new user account data
  } catch (error) {
    // More specific error handling
    if (error instanceof AppwriteException && error.code === 409) {
      // 409 Conflict: User with the same email already exists
      throw new Error("An account with this email already exists.");
    }

    Sentry.captureException(error);
    // Provide a more informative generic error
    throw new Error("An unexpected error occurred during sign-up. Please try again.");
  }
};
/**
 * Gets the complete data of the currently logged-in user from the database.
 * It first gets the session user from Appwrite Auth, then uses the user ID
 * to fetch the full user document from the database collection.
 *
 * @returns {Promise<User | null>} A promise that resolves with the full user object
 * from the database if logged in, or `null` if no session is active.
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
  } catch (error) {
    // Check if the error is the specific "session not found" error from Appwrite.
    // A 401 Unauthorized code is the standard signal for no active session.
    if (error instanceof AppwriteException && error.code === 401) {
      // This is an EXPECTED case: the user is simply not logged in.
      // We do NOT log this to Sentry. We return null as intended.
      return null;
    }

    // For all other errors (network issues, server errors, data integrity issues),
    // it's an UNEXPECTED problem. We log it and re-throw it.
    Sentry.captureException(error);

    // Re-throwing the error is crucial. It allows the calling code (e.g., a page component)
    // to know that something went wrong and display an appropriate error message
    // instead of just assuming the user is logged out.
    throw new Error("An unexpected error occurred while verifying your session.");
  }
}

/**
 * Fetches user information from the Appwrite database collection.
 * Queries the user collection for a document matching the provided userId.
 *
 * @param {GetUserInfoProps} { userId } - The user's ID from Appwrite Authentication.
 * @returns {Promise<User | null>} A promise that resolves with the user document from the database.
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
    throw new Error("Failed to retrieve user information from the database.");
  }
};

/**
 * Signs in an existing user and returns their data.
 * It verifies credentials with Appwrite, creates a session, sets a session cookie,
 * and then fetches the full user data.
 *
 * @param {LoginSchemaType} { email, password } - Object with the user's email and password.
 * @returns {Promise<LoginSchemaType>} A promise that resolves with the logged-in user's data.
 * @throws {Error} Throws an error if credentials are incorrect or session creation fails.
 */
export const signIn = async ({ email, password }: LoginSchemaType): Promise<LoginSchemaType> => {
  try {
    // Use admin client to create a session for the user
    const { account } = await createAdminClient();

    // Create a session for the user with the provided email and password
    const session = await account.createEmailPasswordSession(email, password);

    // Set the session cookie for the user
    // This cookie will be used for subsequent requests to authenticate the user
    const cookieStore = await cookies();
    cookieStore.set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    const user = await getLoggedInUser();

    // Return the user data first, then handle redirect on the client side if needed
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
    throw new Error("An unexpected error occurred during sign-in." + error);
  }
};

/**
 * Signs out the current user.
 * It deletes the active session in Appwrite and removes the session cookie from the browser.
 * Finally, it redirects the user to the sign-in page.
 *
 * @returns {Promise<void>} Does not return any value. Redirects the user or throws an error.
 * @throws {Error} Throws an error if signing out fails.
 */
export const signOut = async (): Promise<void> => {
  try {
    // Get the session client to interact with the current user's session
    const { account } = await createSessionClient();
    // Attempt to delete the session from Appwrite's side
    await account.deleteSession("current");
  } catch (error) {
    // If the error is anything OTHER than "user is not logged in" (401),
    // it's an unexpected problem. We should log it and re-throw.
    if (!(error instanceof AppwriteException && error.code === 401)) {
      Sentry.captureException(error);
      throw new Error("An unexpected error occurred during sign-out." + error);
    }
    // If it IS the 401 error, we can safely ignore it.
    // The user is already logged out on the server, which is our goal.
  } finally {
    // This block ALWAYS runs, ensuring the client-side is cleaned up.
    // Delete the session cookie from the browser
    const cookieStore = await cookies();
    cookieStore.delete("appwrite-session");
    // Redirect the user to the sign-in page
    redirect("/sign-in");
  }
};
