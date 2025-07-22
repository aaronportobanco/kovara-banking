"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpSchema, SignUpSchemaType } from "@/schemas/signUpSchema";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import FormFieldInput from "../components/FormFieldInput";
import FormDatePicker from "./components/FormDatePicker";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { FormCountrySelect } from "./components/FormSelectCountry";
import { FormRegionSelect } from "./components/FormSelectRegion";

const SignUpForm = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  // Use the zodResolver to validate the form data against the schema
  const form = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      postalcode: "",
      dateofbirth: "",
      firstname: "",
      lastname: "",
      address: "",
      email: "",
      country: "",
      region: "",
      password: "",
      ssn: "",
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
            <div className="flex flex-col md:flex-row gap-4">
              <FormFieldInput
                control={form.control}
                name="firstname"
                label="First Name"
                type="text"
                autoComplete="on"
                minLength={3}
                maxLength={15}
                placeholder="Enter your first name"
              />
              <FormFieldInput
                control={form.control}
                name="lastname"
                label="Last Name"
                type="text"
                autoComplete="on"
                minLength={3}
                maxLength={15}
                placeholder="Enter your last name"
              />
            </div>

            <FormFieldInput
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
            <div className="flex flex-col md:flex-row gap-4">
              <FormCountrySelect
                control={form.control}
                placeholder="Select a state"
                description="Select your state of residence"
                name="country"
                label="State"
              />
              <FormRegionSelect
                control={form.control}
                name="region"
                placeholder="Select your city"
                countryField="country"
                label="City"
              />
            </div>

            <FormFieldInput
              control={form.control}
              name="postalcode"
              label="Postal Code"
              type="text"
              autoComplete="on"
              pattern={/^\d{5}(-\d{4})?$/}
              minLength={5}
              maxLength={10}
              placeholder="Enter your postal code"
            />
            <FormFieldInput
              control={form.control}
              name="ssn"
              label="SSN"
              type="text"
              autoComplete="on"
              pattern={/^\d{3}-\d{2}-\d{4}$/}
              maxLength={11}
              placeholder="Enter your social security number (SSN)"
            />
            <FormFieldInput
              control={form.control}
              name="email"
              label="Email"
              type="email"
              autoComplete="on"
              placeholder="Enter your email"
              description="e.g. user@gmail.com"
            />
            <FormFieldInput
              control={form.control}
              name="password"
              label="Password"
              type="password"
              autoComplete="off"
              minLength={8}
              maxLength={50}
              placeholder="Enter your password"
              description="At least 8 characters and must include letters and numbers"
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
