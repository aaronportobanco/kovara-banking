"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpSchema, SignUpSchemaType } from "@/schemas/signUpSchema";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import InputField from "../components/FormFieldInput";
import FormDatePicker from "../components/FormDatePicker";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";

const SignUpForm = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  // Use the zodResolver to validate the form data against the schema
  const form = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      address: "",
    },
    mode: "onChange",
  });

  const {
    formState: { isSubmitting, isValid },
  } = form;

  // This function will be called when the form is submitted and the data is valid
  const onSubmit = async (data: SignUpSchemaType) => {
    // Handle form submission logic here
    setIsLoading(true);
    // Simula una llamada a API (ej. 3 segundos)
    await new Promise((res) => setTimeout(res, 3000));
    console.log("Form submitted with data:", data);
    setIsLoading(false);
    form.reset();
  };

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Create a new account</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Please, enter your details and join us
          </p>
        </div>
      </header>
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <InputField
              control={form.control}
              name="firstname"
              label="First Name"
              type="text"
              autoComplete="on"
              minLength={3}
              maxLength={15}
              placeholder="Enter your first name"
            />
            <InputField
              control={form.control}
              name="lastname"
              label="Last Name"
              type="text"
              autoComplete="on"
              minLength={3}
              maxLength={15}
              placeholder="Enter your last name"
            />
             <InputField
              control={form.control}
              name="address"
              label="Address"
              type="text"
              autoComplete="on"
              minLength={3}
              maxLength={100}
              placeholder="Enter your address"
            />
            <FormDatePicker
              control={form.control}
              name="dateofbirth"
              label="Date of Birth"
              placeholder="Select your date of birth"
              pattern={/^\d{4}-\d{2}-\d{2}$/}
              minLength={10}
              maxLength={10}
            />
            <Button
              type="submit"
              disabled={isSubmitting || !isValid || isLoading}
              className="form-btn"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Sign Up
            </Button>
            <footer className="text-center text-sm">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="underline underline-offset-4 text-bankGradient"
              >
                Log In
              </Link>
            </footer>
          </form>
        </Form>
      </div>
    </section>
  );
};

export default SignUpForm;
