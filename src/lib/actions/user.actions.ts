"use server";

import { ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../server/appwrite";
import { cookies } from "next/headers";
import { SignUpSchemaType } from "@/schemas/signUpSchema";
import { parseStringify } from "../utils";
import { LoginSchemaType } from "@/schemas/loginSchema";
import { redirect } from "next/navigation";
import { UserAccount } from "#/types";


/*
 * This function is responsible for signing up a new user.
 * It takes user data as input, creates a new user account
 * in Appwrite, and sets a session cookie for the user.
 * It uses the SignUpSchemaType to ensure the data conforms to the expected structure.
 * It handles errors by logging them and re-throwing for further handling if needed.
 */
export const signUp = async (userData: SignUpSchemaType) => {
  try {
    const { account } = await createAdminClient();
    const { email, password, firstname, lastname } = userData; // Destructure for clarity

    const newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstname} ${lastname}`
    );
    const session = await account.createEmailPasswordSession(email, password);

    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(newUserAccount); // Return the new user account data
  } catch (error) {
    console.error("Error during sign up:", error);
    throw error; // Re-throw the error for further handling if needed
  }
};

/*
 * Build a utility function to get the logged in user from Appwrite.
 * This function will be used in our components and routes
 * to check if a user is logged in, and access the user's details.
 */
export async function getLoggedInUser(): Promise<UserAccount | null> {
  try {
    const { account } = await createSessionClient();
    const user = await account.get();
    return parseStringify(user);
  } catch (error) {
    console.error("Error fetching logged in user:", error);
    // Handle the error appropriately, e.g., return null or throw an error
    return null;
  }
}

/*
 * This function is responsible for signing in a user.
 * It takes email and password as input, creates a session
 * for the user in Appwrite, and returns the session data.
 * It sets a cookie with the session secret for authentication.
 * It uses the createSessionClient to ensure the session is created
 * in the context of the user.
 * It uses the LoginSchemaType to ensure the data conforms to the expected structure.
 * It handles errors by logging them and re-throwing for further handling if needed.
 */
export const signIn = async ({ email, password }: LoginSchemaType) => {
  try {
    const { account } = await createAdminClient();

    const session = await account.createEmailPasswordSession(email, password);

    // Set the session cookie for the user
    // This cookie will be used for subsequent requests to authenticate the user
    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    redirect("/");
  } catch (error) {
    console.error("Error during sign in:", error);
    throw error; // Re-throw the error for further handling if needed
  }
};

/*
 * This function is responsible for signing out the current user.
 * It deletes the session from Appwrite and removes the session cookie.
 * It uses the createSessionClient to ensure the session is deleted
 * in the context of the user.
 */
export const signOut = async () => {
  try {
    const { account } = await createSessionClient();
    (await cookies()).delete("appwrite-session");
    await account.deleteSession("current");
    redirect("/sign-in")
  } catch (error) {
    console.error("Error during sign out:", error);
    return null;
  }
};
