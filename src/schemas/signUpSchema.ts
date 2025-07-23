import { z } from "zod";
import { MAX_AGE } from "../../constants";

export const SignUpSchema = z.object({
  firstname: z
    .string({ error: "First name must be a string" })
    .nonempty({ error: "First name is required" })
    .regex(/^[A-Za-z\s]+$/, {
      error: "First name can only contain letters and spaces",
    })
    .min(3, { error: "First name must be at least 3 characters long" })
    .max(50, { error: "First name must be at most 50 characters long" }),
  lastname: z
    .string({ error: "Last name must be a string" })
    .nonempty({ error: "Last name is required" })
    .regex(/^[A-Za-z\s]+$/, {
      error: "Last name can only contain letters and spaces",
    })
    .min(3, { error: "Last name must be at least 3 characters long" })
    .max(50, { error: "Last name must be at most 50 characters long" }),
  address: z
    .string()
    .nonempty({ error: "Address is required" })
    .min(10, { error: "Address must be at least 10 characters long" })
    .max(100, { error: "Address must be at most 100 characters long" }),
  email: z.email({
    error: (issue) =>
      issue.input === undefined || issue.input === null
        ? "Email is required"
        : "Invalid email format",
  }),
  password: z
    .string()
    .nonempty({ error: "Password is required" })
    .min(8, { error: "Password must be at least 8 characters long" })
    .max(50, { error: "Password must be at most 50 characters long" })
    .regex(/[A-Za-z]/, { error: "Password must contain at least one letter" })
    .regex(/\d/, { error: "Password must contain at least one number" })
    .regex(/^[A-Za-z0-9]*$/, {
      error: "Password can only contain letters and numbers",
    }),
  state: z.string().nonempty({ error: "State is required" }),
  city: z.string().nonempty({ error: "City is required" }),
  postalcode: z
    .string()
    .nonempty({ error: "Postal code is required" })
    .min(5, { error: "Postal code must be at least 5 characters long" })
    .max(10, { error: "Postal code must be at most 10 characters long" })
    .regex(/^\d{5}(-\d{4})?$/, {
      error: "It must be a valid postal code (e.g. 12345 or 12345-6789)",
    }),
  ssn: z
    .string()
    .nonempty({ error: "SSN is required" })
    .max(11, { error: "SSN must be at most 11 characters long" })
    .regex(/^\d{3}-\d{2}-\d{4}$/, {
      error: "It must be a valid SSN (e.g. 123-45-6789)",
    }),
  dateofbirth: z
    .string()
    .nonempty({ error: "Date of birth is required" })
    .min(10, { error: "Date of birth must be at least 10 characters long" })
    .max(10, { error: "Date of birth must be at most 10 characters long" })
    .refine(
      (str) => /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(str),
      {
        error: "Formato debe ser YYYY-MM-DD",
      }
    )
    .refine(
      (str) => {
        const date = new Date(str);
        return !isNaN(date.getTime());
      },
      {
        error: "Fecha inválida",
      }
    )
    .refine(
      (str) => {
        const birthDate = new Date(str);
        const today = new Date();
        return birthDate < today;
      },
      {
        error: "La fecha de nacimiento no puede ser en el futuro",
      }
    )
    .refine(
      (str) => {
        const birthDate = new Date(str);
        const today = new Date();
        const hundredYearsAgo = new Date(
          today.getFullYear() - MAX_AGE,
          today.getMonth(),
          today.getDate()
        );
        return birthDate > hundredYearsAgo;
      },
      {
        error: `La edad no puede ser mayor a ${MAX_AGE} años`,
      }
    ),
});

// Export the type for use in the form
export type SignUpSchemaType = z.infer<typeof SignUpSchema>;
