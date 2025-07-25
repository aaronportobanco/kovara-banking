import { createSessionClient } from "../server/appwrite";

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
