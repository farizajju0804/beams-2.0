import * as z from "zod";

export const NewPasswordSchema = z.object({
	password: z
		.string()
		.trim()
		.min(1, { message: 'Password required!' })
		.min(8, { message: 'Password must have at least 8 characters!' }),
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
		.min(1, { message: 'Email required!' })
		.email({ message: 'Invalid email!' }),
	password: z
		.string()
		.trim()
		.min(1, { message: 'Password required!' })
		.min(8, { message: 'Password must have at least 8 characters!' }),
});
export const RegisterSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(8, {
    message: "Password must be of minimum of 8 characters",
  }),
});