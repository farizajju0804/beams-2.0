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
	identifier: z
		.string()
		.trim()
		.min(1, { message: 'Email or Username is required!' }),
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
	username: z.string().min(1, {
	  message: "Username is required",
	}),
	securityQuestion: z.string().min(1, {
	  message: "Security question is required",
	}),
	securityAnswer: z.string().min(1, {
	  message: "Security answer is required",
	}),
});

export const ForgotUsernameEmailSchema = z.object({
	securityQuestion: z.string().min(1, { message: "Security question is required!" }),
	securityAnswer: z.string().min(1, { message: "Security answer is required!" }),
  });
