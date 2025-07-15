import { z } from "zod";

export const signInShema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const signUpSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
  terms: z.boolean(),
  role: z.enum(["user", "operator"]).default("user"),
});

export const saveOperatorSchema = z.object({
  // Logo fields
  logoUrl: z.string(),
  logoPath: z.string(),
  logoFilename: z.string(),
  logoMimeType: z.string(),
  logoSize: z.number(),

  // core fields
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),

  description: z.string().optional(),
  address: z.string().optional(),
  website: z.string().url("Invalid URL").optional(),
  socialMediaLinks: z
    .object({
      facebook: z.string().url("Invalid URL").optional(),
      instagram: z.string().url("Invalid URL").optional(),
      twitter: z.string().url("Invalid URL").optional(),
    })
    .optional(),
});
