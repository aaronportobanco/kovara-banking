/* eslint-disable no-console */
"use server";

import { ID, Query } from "node-appwrite";
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
 * @param {SignUpSchemaType} userData - The user's data for registration (name, email, password, etc.).
 * @returns {Promise<SignUpSchemaType>} A promise that resolves with the data of the new user saved in the database.
 * @throws {Error} Throws an error if Dwolla customer creation, user creation, or session creation fails.
 */
export const signUp = async ({
  password,
  ...userData
}: SignUpSchemaType): Promise<SignUpSchemaType> => {
  const { email, firstName, lastName } = userData; // Destructure for clarity

  let newUserAccount;

  try {
    // Create a Dwolla customer for the new user
    const dwollaCustomerUrl = await createDwollaCustomer({
      ...userData,
      type: "personal",
    });

    // If the Dwolla customer creation fails, it will throw an error
    if (!dwollaCustomerUrl) {
      throw new Error("Error creating Dwolla customer");
    }

    // Get Appwrite admin client for server-side operations
    const { account, database } = await createAdminClient();

    // Create a new user account in Appwrite
    newUserAccount = await account.create(ID.unique(), email, password, `${firstName} ${lastName}`);
    if (!newUserAccount) {
      throw new Error("Error creating user");
    }

    // Extract the Dwolla customer ID from the URL
    const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

    if (!APPWRITE_DATABASE_ID || !APPWRITE_USER_COLLECTION_ID) {
      throw new Error("APPWRITE_DATABASE_ID or APPWRITE_USER_COLLECTION_ID is not set");
    }

    // Create a new document in the users collection with all user data
    const newUser = await database.createDocument(
      APPWRITE_DATABASE_ID!,
      APPWRITE_USER_COLLECTION_ID!,
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
    Sentry.captureException(error);
    console.error("Error during sign up:", error);
    throw new Error("An error occurred during sign up.");
  }
};

/**
 * Gets the data of the currently logged-in user.
 * It uses the session cookie to authenticate with Appwrite and fetch the account details.
 *
 * @returns {Promise<UserAccount | null>} A promise that resolves with the user's account object
 * if logged in, or `null` if there is no active session or an error occurs.
 */
export async function getLoggedInUser(): Promise<User | null> {
  try {
    const { account } = await createSessionClient();
    const result = await account.get();

    const user = await getUserInfo({ userId: result.$id });

    return parseStringify(user);
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const getUserInfo = async ({ userId }: GetUserInfoProps) => {
  try {
    const { database } = await createAdminClient();

    const user = await database.listDocuments(APPWRITE_DATABASE_ID!, APPWRITE_USER_COLLECTION_ID!, [
      Query.equal("userId", [userId]),
    ]);

    return parseStringify(user.documents[0]);
  } catch (error) {
    console.log(error);
  }
};

/**
 * Signs in an existing user.
 * It verifies the credentials (email and password) with Appwrite, creates a new session,
 * and sets a secure, httpOnly session cookie to keep the user authenticated.
 * Finally, it redirects the user to the main page.
 *
 * @param {LoginSchemaType} { email, password } - Object with the user's email and password.
 * @returns {Promise<void>} Does not return any value. Redirects the user or throws an error.
 * @throws {Error} Throws an error if the credentials are incorrect or if session creation fails.
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

    // Redirect the user to the homepage after successful sign-in
    redirect("/");

    return parseStringify(user);
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error during sign in:", error);
    throw new Error("Invalid email or password");
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
    // Delete the session cookie from the browser
    const cookieStore = await cookies();
    cookieStore.delete("appwrite-session");
    // Delete the session from Appwrite's side
    await account.deleteSession("current");
    // Redirect the user to the sign-in page
    redirect("/sign-in");
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
