import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores",
    }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Za-z]/, { message: "Password must contain at least one letter" })
    .regex(/\d/, { message: "Password must contain at least one number" })
    .regex(/^[A-Za-z0-9]*$/, {
      message: "Password can only contain letters and numbers",
    }),
});

// Export the type for use in the form
export type LoginSchemaType = z.infer<typeof loginSchema>;