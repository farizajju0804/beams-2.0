import * as z from "zod";

export const NewPasswordSchema = z.object({
	password: z
		.string()
		.trim()
		.min(1, { message: 'Password required!' })
		.min(8, { message: 'Password must have at least 8 characters!' })
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
	  .min(1, { message: 'Password required!' })
	  .min(8, { message: 'Password must have at least 8 characters!' }),
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
	  message: "Password must be of minimum of 8 characters",
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
	name: z.optional(z.string()),
	isTwoFactorEnabled : z.optional(z.boolean()),
	email : z.optional(z.string().email()),
	password : z.optional(z.string().min(8)),
	newPassword: z.optional(z.string().min(8, {
	  message: "Password must be of minimum of 8 characters",
	}).regex(/[A-Z]/, { message: "Must include an uppercase letter" })
	.regex(/[a-z]/, { message: "Must include a lowercase letter" })
	.regex(/[0-9]/, { message: "Must include a number" })
	.regex(/[^a-zA-Z0-9]/, { message: "Must include a special character" }),
)})

.refine((data) => {
	if(data.password && !data.newPassword){
		return false;
	}

	
    
	return true;
}, {
	message : "New Password is required!",
	path : ["newPassword"]
})

.refine((data) => {
	if(data.newPassword && !data.password){
		return false;
	}
	
    
	return true;
}, {
	message : "Password is required!",
	path : ["password"]
})
