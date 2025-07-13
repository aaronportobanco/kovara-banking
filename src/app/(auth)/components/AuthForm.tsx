import React from "react";
import Logo from "@/components/layout/Logo";

const AuthForm = ({ type }: { type: string }) => {
  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Logo />
      </header>
    </section>
  );
};

export default AuthForm;