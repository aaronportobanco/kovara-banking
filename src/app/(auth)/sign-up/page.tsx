import React from "react";
import SignUpForm from "./SignUpForm";
import { getLoggedInUser } from "@/services/actions/user.actions";
import { redirect } from "next/navigation";

const SignUpPage: () => Promise<JSX.Element> = async () => {
  const user = await getLoggedInUser();

  // If the user is already logged in, redirect to the Plaid link page
  if (user) redirect("/plaid-link");

  return (
    <section className="flex-center size-full max-sm:px-6">
      <SignUpForm />
    </section>
  );
};

export default SignUpPage;
