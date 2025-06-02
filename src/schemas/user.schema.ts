import { z } from "zod";
import { emailSchema, nameSchema, passwordSchema } from "./common";

// Create User
export const createUserSchema = z.object({
  body: z.object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    role: z.enum(['user', 'admin']).default('user'),
  }),
});

// Update User
export const updateUserSchema = z.object({
  params: z.object({
    id: z.string(), // Add params so UpdateUserInput has both body and id
  }),
  body: z.object({
    name: nameSchema.optional(),
    email: emailSchema.optional(),
    role: z.enum(["user", "admin"]).optional(),
    isActive: z.boolean().optional(),
      password: passwordSchema.optional(),  // <-- Add this line
  }).refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  }),
});

// Get User by ID
export const getUserByIdSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

// Delete User
export const deleteUserSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

// Search Users
export const searchUsersSchema = z.object({
  query: z.object({
    name: z.string().optional(),
  }),
});

// ✅ Export types
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type GetUserByIdInput = z.infer<typeof getUserByIdSchema>;
export type DeleteUserInput = z.infer<typeof deleteUserSchema>;
export type SearchUsersInput = z.infer<typeof searchUsersSchema>;
