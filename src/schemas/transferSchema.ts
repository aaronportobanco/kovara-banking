import { z } from "zod";

export const transferSchema = z.object({
  email: z
    .email({
      error: issue =>
        issue.input === undefined || issue.input === null
          ? "Email is required"
          : "Invalid email format",
    })
    .trim(),
  sourceAccount: z
    .string({ error: "Source account must be a string" })
    .nonempty({ error: "Source account is required" })
    .min(4, { error: "Source account must be at least 4 characters long" })
    .trim(),
  recipientAccount: z
    .string({ error: "Recipient account must be a string" })
    .nonempty({ error: "Recipient account is required" })
    .min(8, { error: "Recipient account must be at least 8 characters long" })
    .trim(),
  note: z
    .string({ error: "Note must be a string" })
    .max(200, { error: "Note must be at most 200 characters long" })
    .trim()
    .optional(),
  amount: z
    .number({
      error: issue =>
        issue.input === undefined || issue.input === null
          ? "Amount is required"
          : "Amount must be a integer number",
    })
    .min(4, { error: "Amount must be at least 4 digits long" }),
});

// Export the type for use in the form
export type TransferSchemaType = z.infer<typeof transferSchema>;
