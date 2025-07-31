import React from "react";
import SignInForm from "./SignInForm";

const SignInPage: () => Promise<JSX.Element> = async () => {
  return (
    <section className="flex-center size-full max-sm:px-6">
      <SignInForm />
    </section>
  );
};
export default SignInPage;
