"use server";

import { Client, Account, Databases, Users } from "node-appwrite";
import { cookies } from "next/headers";

/*
 * This function is responsible for creating a new Appwrite client instance
 * and returning an object with methods to interact with the Appwrite account service.
 * this gonna valide the session cookie and return the account object if the session is valid.
 * If the session is invalid, it will throw an error.
 */

export async function createSessionClient(): Promise<{ account: Account }> {
  // Create a new Appwrite client instance with the endpoint and project ID
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

  const session = (await cookies()).get("appwrite-session");
  if (!session || !session.value) {
    throw new Error("No session");
  }

  client.setSession(session.value); // Attach the session cookie to the client

  return {
    get account() {
      return new Account(client);
    },
  };
}

/*
 * Create a new Appwrite client instance with admin privileges
 * This client will be used to manage users, databases, and other resources.
 * It uses the API key for admin access, which provides full control over the Appwrite project.
 * This is useful for administrative tasks such as user management, database operations, etc.
 */

export async function createAdminClient(): Promise<{
  account: Account;
  database: Databases;
  users: Users;
}> {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
    // Set the API key for admin access, providing all the functionality
    // to manage users, projects, and other resources.
    .setKey(process.env.NEXT_APPWRITE_KEY!);

  return {
    get account() {
      return new Account(client);
    },

    get database() {
      return new Databases(client);
    },
    get users() {
      return new Users(client);
    },
  };
}
