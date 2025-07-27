import React from "react";
import SignUpForm from "./SignUpForm";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

const SignUpPage = async () => {
  const user = await getLoggedInUser();
  if(user) redirect ("/plaid-link")
  
  return (
    <section className="flex-center size-full max-sm:px-6">
      <SignUpForm />
    </section>
  );
};

export default SignUpPage;
