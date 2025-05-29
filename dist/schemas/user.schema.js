"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
const common_1 = require("./common");
exports.createUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: common_1.nameSchema,
        email: common_1.emailSchema,
        password: common_1.passwordSchema,
        role: zod_1.z.enum(['user', 'admin']).default('user')
    })
});
exports.updateUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: common_1.nameSchema.optional(),
        email: common_1.emailSchema.optional(),
        role: zod_1.z.enum(["user", "admin"]).optional(),
        isActive: zod_1.z.boolean().optional(),
    })
        .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field must be provided for update",
    })
});
