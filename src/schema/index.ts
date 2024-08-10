import * as z from "zod";

export const NewPasswordSchema = z.object({
	password: z
		.string()
		.trim()
		.min(1, { message: 'Password must have at least 8 characters, that includes 1 Uppercase, 1 Lowercase, 1 Number and 1 Special character!' })
		.min(8, { message: 'Password must have at least 8 characters, that includes 1 Uppercase, 1 Lowercase, 1 Number and 1 Special character!' })
		.regex(/[A-Z]/, { message: "Must include an uppercase letter" })
		.regex(/[a-z]/, { message: "Must include a lowercase letter" })
		.regex(/[0-9]/, { message: "Must include a number" })
		.regex(/[^a-zA-Z0-9]/, { message: "Must include a special character" }),
});

export const ResetSchema = z.object({
	email: z
		.string()
		.trim()
		.min(1, { message: 'Email required!' })
		.email({ message: 'Invalid email!' })
});

export const LoginSchema = z.object({
	email: z
	  .string()
	  .trim()
	  .min(1, { message: 'Email is required!' })
	  .email({ message: 'Invalid email!' }),
	password: z
	  .string()
	  .trim()
	  .min(1, { message: 'Password must have at least 8 characters, that includes 1 Uppercase, 1 Lowercase, 1 Number and 1 Special character!' })
	  .min(8, { message: 'Password must have at least 8 characters, that includes 1 Uppercase, 1 Lowercase, 1 Number and 1 Special character!' }),
	  
	code: z.optional(z.string())
});

export const RegisterSchema = z.object({
	name: z.string().min(1, {
	  message: "Name is required",
	}),
	email: z.string().email({
	  message: "Email is required",
	}),
	password: z.string().min(8, {
	  message: "Password must have at least 8 characters, that includes 1 Uppercase, 1 Lowercase, 1 Number and 1 Special character!",
	}).regex(/[A-Z]/, { message: "Must include an uppercase letter" })
	.regex(/[a-z]/, { message: "Must include a lowercase letter" })
	.regex(/[0-9]/, { message: "Must include a number" })
	.regex(/[^a-zA-Z0-9]/, { message: "Must include a special character" }),
});

export const SecuritySchema = z.object({
	securityAnswer1: z.string().max(20, { message: "Security answer must be at most 20 characters" }),
	securityAnswer2: z.string().max(20, { message: "Security answer must be at most 20 characters" }),
});


export const ForgotEmailSchema = z.object({
	securityAnswer1: z.string().max(20, { message: "Security answer must be at most 20 characters" }),
	securityAnswer2: z.string().max(20, { message: "Security answer must be at most 20 characters" }),
});



export const SettingsSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
});

export const ChangeEmailSchema = z.object({
  newEmail: z.string().email(),
});

export const ChangePasswordSchema = z.object({
  password: z.string()
    .min(8, { message: 'Password must have at least 8 characters' })
    .regex(/[A-Z]/, { message: "Must include an uppercase letter" })
    .regex(/[a-z]/, { message: "Must include a lowercase letter" })
    .regex(/[0-9]/, { message: "Must include a number" })
    .regex(/[^a-zA-Z0-9]/, { message: "Must include a special character" }),
  newPassword: z.string()
    .min(8, { message: 'Password must have at least 8 characters' })
    .regex(/[A-Z]/, { message: "Must include an uppercase letter" })
    .regex(/[a-z]/, { message: "Must include a lowercase letter" })
    .regex(/[0-9]/, { message: "Must include a number" })
    .regex(/[^a-zA-Z0-9]/, { message: "Must include a special character" }),
});
