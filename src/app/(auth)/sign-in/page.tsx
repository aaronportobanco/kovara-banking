import React from "react";
import SignInForm from "./SignInForm";

const SignInPage: () => Promise<React.ReactElement> = async () => {
  return (
    <section className="flex-center size-full max-sm:px-6">
      <SignInForm />
    </section>
  );
};
export default SignInPage;
