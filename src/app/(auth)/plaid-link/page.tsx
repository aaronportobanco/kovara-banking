import React from "react";
import { getLoggedInUser } from "@/services/actions/user.actions";
import { redirect } from "next/navigation";

const PlaidLinkPage: () => Promise<React.ReactElement> = async () => {
  const user = await getLoggedInUser();

  // If the user is not logged in, render the sign-up form
  // This ensures that the plaid-link page is only accessible to unauthenticated users
  // and prevents authenticated users from accessing it.
  if (!user) redirect("/sign-up");

  return <div>PlaidLinkPage</div>;
};

export default PlaidLinkPage;
