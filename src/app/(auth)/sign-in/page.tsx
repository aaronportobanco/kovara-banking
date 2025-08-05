import React from "react";
import SignInForm from "./SignInForm";
import { getLoggedInUser } from "@/services/actions/user.actions";
import { redirect } from "next/navigation";

const SignInPage: () => Promise<React.ReactElement> = async () => {
  const user = await getLoggedInUser();

  if (user) {
    redirect("/");
  }

  return (
    <section className="flex-center size-full max-sm:px-6">
      <SignInForm />
    </section>
  );
};
export default SignInPage;
