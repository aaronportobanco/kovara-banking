"use client";
import React from "react";
import Logo from "@/components/layout/Logo";

const AuthForm = ({ type }: { type: string }) => {
  const [user, setUser] = React.useState(null);
  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Logo className="px-0" />
        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            {user ? "Link Account" : type === "sign-in" ? "Sign In" : "Sign Up"}
            <p className="text-16 font-normal text-gray-600">
              {user
                ? "Link to your account to get started"
                : "Create a new account and enjoy"}
            </p>
          </h1>
        </div>
      </header>
    </section>
  );
};

export default AuthForm;
