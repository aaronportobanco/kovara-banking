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
    .min(1, { error: "Source account must be at least 1 character long" })
    .trim(),
  recipientAccount: z
    .string({ error: "Recipient account must be a string" })
    .nonempty({ error: "Recipient account is required" })
    .min(1, { error: "Recipient account must be at least 1 character long" })
    .trim(),
  note: z
    .string({ error: "Note must be a string" })
    .max(200, { error: "Note must be at most 200 characters long" })
    .optional(),
  amount: z
    .number({
      error: issue =>
        issue.input === undefined || issue.input === null
          ? "Amount is required"
          : "Amount must be a integer number",
    })
    .min(0, { error: "Amount must be positive" }),
});

// Export the type for use in the form
export type TransferSchemaType = z.infer<typeof transferSchema>;
