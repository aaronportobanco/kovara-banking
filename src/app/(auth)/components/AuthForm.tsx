"use client";
import React from "react";
import Logo from "@/components/layout/Logo";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginSchemaType } from "@/schemas/loginSchema";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import InputField from "./formField";
import { Button } from "@/components/ui/button";

// This function will be called when the form is submitted and the data is valid
const onSubmit = async (data: LoginSchemaType) => {
  // Handle form submission logic here
  console.log("Form submitted with data:", data);
};

// This component will render the authentication form based on the type (sign-in or sign-up)
const AuthForm = ({ type }: { type: string }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [user, setUser] = React.useState(null);

  // Use the zodResolver to validate the form data against the schema
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const {
    formState: { isSubmitting, isValid },
  } = form;

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Logo className="px-0" />
        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            {user ? "Link Account" : type === "sign-in" ? "Sign Up" : "Log In"}
            <p className="text-16 font-normal text-gray-600">
              {user
                ? "Please create a new account to continue."
                : "Welcome back! Please log in to your account."}
            </p>
          </h1>
        </div>
      </header>
      {user ? (
        <div className="flex flex-col gap-4">PlaidLink</div>
      ) : (
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
              <InputField
                control={form.control}
                name="email"
                label="Email"
                placeholder="Ingresa tu correo electrónico"
              />
              <InputField
                control={form.control}
                name="password"
                label="Password"
                type="password"
                placeholder="Ingresa tu contraseña"
                description="Al menos 8 caracteres y debe incluir letras y numeros"
              />
              <Button type="submit" disabled={isSubmitting || !isValid}>
                Submit
              </Button>
            </form>
          </Form>
        </div>
      )}
    </section>
  );
};

export default AuthForm;
