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
  senderBank: z
    .string({ error: "Sender bank must be a string" })
    .nonempty({ error: "Sender bank is required" })
    .min(4, { error: "Sender bank must be at least 4 characters long" })
    .trim(),
  sharableId: z
    .string({ error: "Sharable ID must be a string" })
    .nonempty({ error: "Sharable ID is required" })
    .min(8, { error: "Sharable ID must be at least 8 characters long" })
    .trim(),
  note: z.string().max(200, { error: "Note must be at most 200 characters long" }).trim(),
  amount: z
    .string()
    .nonempty({ error: "Amount is required" })
    .min(1, { error: "Amount must be at least 1 digits long" }),
});

// Export the type for use in the form
export type TransferSchemaType = z.infer<typeof transferSchema>;
