import React from "react";
import { getLoggedInUser } from "@/services/actions/user.actions";
import { redirect } from "next/navigation";
import PlaidLink from "./PlaidLink";

const PlaidLinkPage: () => Promise<React.ReactElement> = async () => {
  const userLoggedIn = await getLoggedInUser();

  // If the user is not logged in, render the sign-up form
  // This ensures that the plaid-link page is only accessible to authenticated users
  // and prevents unauthenticated users from accessing it.
  if (!userLoggedIn) redirect("/sign-up");

  return <PlaidLink user={userLoggedIn} variant="primary" />;
};

export default PlaidLinkPage;
