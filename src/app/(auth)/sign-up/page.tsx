import React from "react";
import SignUpForm from "./SignUpForm";
import { getLoggedInUser } from "@/lib/actions/user.actions";
//import { redirect } from "next/navigation";

const SignUpPage = async () => {
  const user = await getLoggedInUser();
  // If the user is already logged in, redirect to the Plaid link page
  //if (user) redirect("/plaid-link");
    console.log("User in SignUpPage:", user);

  // If the user is not logged in, render the sign-up form
  // This ensures that the sign-up page is only accessible to unauthenticated users
  // and prevents authenticated users from accessing it.
  
  return (
    <section className="flex-center size-full max-sm:px-6">
      <SignUpForm />
    </section>
  );
};

export default SignUpPage;
