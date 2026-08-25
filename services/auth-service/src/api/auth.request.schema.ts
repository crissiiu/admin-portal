import { z } from "zod";

const passwordSchema = z.string().min(8).regex(/[A-Za-z]/).regex(/[0-9]/);
const phoneSchema = z.string().trim().min(6).max(32);
const tenantIdSchema = z.string().trim().min(1);

export const defaultAddressSchema = z
  .object({
    fullName: z.string().trim().min(1).max(160),
    phoneNumber: phoneSchema,
    addressLine: z.string().trim().min(1).max(255),
    line2: z.string().trim().max(255).optional(),
    provinceCode: z.number().int().positive(),
    provinceName: z.string().trim().min(1).max(120),
    provinceCodename: z.string().trim().min(1).max(160).optional(),
    provinceDivisionType: z.string().trim().min(1).max(80).optional(),
    wardCode: z.number().int().positive(),
    wardName: z.string().trim().min(1).max(160),
    wardCodename: z.string().trim().min(1).max(180).optional(),
    wardDivisionType: z.string().trim().min(1).max(80).optional(),
    countryCode: z.literal("VN").default("VN"),
    postalCode: z.string().trim().max(32).optional(),
    administrativeVersion: z.literal("VN_2025_07").default("VN_2025_07")
  })
  .strict();

const customerBaseSchema = z
  .object({
    tenantId: tenantIdSchema,
    name: z.string().trim().min(2).max(160),
    phoneNumber: phoneSchema,
    defaultAddress: defaultAddressSchema
  })
  .strict();

export const customerRegisterEmailSchema = customerBaseSchema
  .extend({
    email: z.email().transform((value) => value.toLowerCase()),
    password: passwordSchema
  })
  .strict();

export const customerRegisterPhoneSchema = customerBaseSchema
  .extend({
    password: passwordSchema
  })
  .strict();

export const customerRegisterGoogleSchema = customerBaseSchema
  .extend({
    idToken: z.string().min(1)
  })
  .strict();

export const customerLoginEmailSchema = z
  .object({
    tenantId: tenantIdSchema,
    email: z.email().transform((value) => value.toLowerCase()),
    password: z.string().min(1)
  })
  .strict();

export const customerLoginPhoneSchema = z
  .object({
    tenantId: tenantIdSchema,
    phoneNumber: phoneSchema,
    password: z.string().min(1)
  })
  .strict();

export const customerLoginGoogleSchema = z
  .object({
    tenantId: tenantIdSchema,
    idToken: z.string().min(1)
  })
  .strict();

export const tenantLoginSchema = z
  .object({
    tenantId: tenantIdSchema,
    identifier: z.string().trim().min(1),
    password: z.string().min(1)
  })
  .strict();

export const platformLoginSchema = z
  .object({
    identifier: z.string().trim().min(1),
    password: z.string().min(1)
  })
  .strict();

export const phoneVerificationRequestSchema = z
  .object({
    tenantId: tenantIdSchema,
    phoneNumber: phoneSchema,
    purpose: z.enum(["register", "reset_password"]).default("register")
  })
  .strict();

export const phoneVerificationVerifySchema = phoneVerificationRequestSchema
  .extend({
    code: z.string().trim().min(4).max(12)
  })
  .strict();

export const forgotPasswordSchema = z
  .object({
    tenantId: tenantIdSchema.optional(),
    identifier: z.string().trim().min(1)
  })
  .strict();

export const resetPasswordSchema = forgotPasswordSchema
  .extend({
    token: z.string().min(1),
    newPassword: passwordSchema
  })
  .strict();

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: passwordSchema
  })
  .strict();

export const refreshSchema = z
  .object({
    refreshToken: z.string().min(1).optional()
  })
  .strict();

export const tenantUserCreateSchema = z
  .object({
    tenantId: tenantIdSchema,
    name: z.string().trim().min(2).max(160),
    email: z.email().transform((value) => value.toLowerCase()),
    phoneNumber: phoneSchema,
    password: passwordSchema,
    roles: z.array(z.string().min(1)).min(1)
  })
  .strict();

export const platformUserCreateSchema = z
  .object({
    name: z.string().trim().min(2).max(160),
    email: z.email().transform((value) => value.toLowerCase()),
    phoneNumber: phoneSchema,
    password: passwordSchema,
    roles: z.array(z.string().min(1)).min(1)
  })
  .strict();
