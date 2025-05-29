import {z} from "zod"
import { emailSchema, nameSchema, passwordSchema } from "./common"

export const createUserSchema =z.object({
    body: z.object({
        name: nameSchema,
        email: emailSchema,
        password: passwordSchema,
        role: z.enum(['user', 'admin']).default('user')

    })
})


export const updateUserSchema = z.object({

    body: z.object({
        name: nameSchema.optional(),
        email: emailSchema.optional(),
        role: z.enum(["user", "admin"]).optional(),
        isActive: z.boolean().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field must be provided for update",
    })
})

export type CreateUserInput = z.infer<typeof createUserSchema>
export type updateUserInput = z.infer<typeof updateUserSchema>