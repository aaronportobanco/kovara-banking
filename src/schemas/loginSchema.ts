import { z } from "zod";

export const loginSchema = z.object({
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
});

// Export the type for use in the form
export type LoginSchemaType = z.infer<typeof loginSchema>;
