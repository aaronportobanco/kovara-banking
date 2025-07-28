"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginSchemaType } from "@/schemas/loginSchema";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import FormFieldInput from "../components/FormFieldInput";
import { Button } from "@/components/ui/button";
import { Github, Loader2 } from "lucide-react";
import { signIn } from "@/lib/actions/user.actions";
import Link from "next/link";
import { toast } from "sonner";
import { isRedirectError } from "next/dist/client/components/redirect-error";

const SignInForm = () => {
  const [isLoading, setIsLoading] = React.useState(false);

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

  // This function will be called when the form is submitted and the data is valid
  const onSubmit = async (data: LoginSchemaType) => {
    setIsLoading(true);

    try {
      await signIn(data);
      console.log("Sign In successful", data);
    } catch (error) {
      // We check if the error is the special redirect error. If it is, we re-throw it
      // so Next.js can handle the redirection.
      if (isRedirectError(error)) {
        throw error;
      }

      console.error("Error signing in:", error);
      toast.error("Sign In failed. Please check your credentials.", {
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
      </header>
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <FormFieldInput
              control={form.control}
              name="email"
              label="Email"
              type="email"
              autoComplete="on"
              placeholder="Ingresa tu correo electrónico"
              description="example: user@gmail.com"
            />
            <FormFieldInput
              control={form.control}
              name="password"
              label="Password"
              type="password"
              autoComplete="off"
              minLength={8}
              maxLength={50}
              placeholder="Ingresa tu contraseña"
            />
            <Button
              type="submit"
              disabled={isSubmitting || !isValid || isLoading}
              className="form-btn"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Log In
            </Button>
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
            <Button type="button" className="w-full" variant="outline">
              <Github /> Login with GitHub
            </Button>
            <footer className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                className="underline underline-offset-4 text-bankGradient"
              >
                Sign up
              </Link>
            </footer>
          </form>
        </Form>
      </div>
    </section>
  );
};

export default SignInForm;
