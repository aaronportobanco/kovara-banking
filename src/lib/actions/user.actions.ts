import { ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../server/appwrite";
import { cookies } from "next/headers";
import { SignUpSchemaType } from "@/schemas/signUpSchema";
import { parseStringify } from "../utils";

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
export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    return await account.get();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
}
