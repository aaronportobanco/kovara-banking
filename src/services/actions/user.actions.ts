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
 * Registers a new user.
 * This server action handles the complete sign-up process including:
 * 1. Creating a Dwolla customer for payment processing.
 * 2. Creating an Appwrite authentication user.
 * 3. Storing user details in the Appwrite database.
 * 4. Creating and setting a session cookie to log the user in.
 *
 * @param {SignUpSchemaType} { password, ...userData } - The user's data for registration.
 * @returns {Promise<User>} A promise that resolves with the newly created user object.
 * @throws {Error} Throws a user-friendly error if any step of the sign-up process fails.
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

    cookies().set("appwrite-session", session.secret, {
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
    throw new Error("An unexpected error occurred during sign-up. Please try again.");
  }
};

/**
 * Retrieves the currently logged-in user's data from the database.
 * It verifies the active session and fetches the corresponding user document.
 *
 * @returns {Promise<User | null>} The full user object if a session is active, otherwise `null`.
 * @throws {Error} Throws an error for unexpected issues like data integrity problems or server errors.
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
 * Signs in a user.
 * Verifies credentials, creates a session, sets a session cookie, and returns the user data.
 *
 * @param {LoginSchemaType} { email, password } - The user's login credentials.
 * @returns {Promise<User>} A promise that resolves with the logged-in user's data.
 * @throws {Error} Throws an error for invalid credentials or other sign-in failures.
 */
export const signIn = async ({ email, password }: LoginSchemaType): Promise<User> => {
  try {
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    const user = await getLoggedInUser();

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
    throw new Error("An unexpected error occurred during sign-in. Please try again.");
  }
};

/**
 * Signs out the current user.
 * Deletes the Appwrite session and removes the client-side session cookie.
 *
 * @returns {Promise<void>} Redirects the user upon completion.
 * @throws {Error} Throws an error if sign-out fails unexpectedly.
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
    cookies().delete("appwrite-session");
    redirect("/sign-in");
  }
};
