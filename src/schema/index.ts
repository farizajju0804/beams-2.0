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
	  
	  code: z
	  .string()
	  .min(6, { message: 'Code must be atleast 6 digits' })
	  .max(6, { message: 'Code must be only 6 digits' })
	  .regex(/^\d+$/, { message: 'Code must contain only numbers' })
	  .optional()
	  .or(z.literal(''))
	
});

export const RegisterSchema = z.object({
	email: z.string().email({
	  message: "Email is required",
	}),
	password: z
	  .string()
	  .min(8, {
		message:
		  "Password must have at least 8 characters, that includes 1 Uppercase, 1 Lowercase, 1 Number and 1 Special character!",
	  })
	  .regex(/[A-Z]/, { message: "Must include an uppercase letter" })
	  .regex(/[a-z]/, { message: "Must include a lowercase letter" })
	  .regex(/[0-9]/, { message: "Must include a number" })
	  .regex(/[^a-zA-Z0-9]/, { message: "Must include a special character" })
  });

export const SecuritySchema = z.object({
	securityAnswer1: z.string().max(20, { message: "Security answer must be at most 20 characters" }),
	securityAnswer2: z.string().max(20, { message: "Security answer must be at most 20 characters" }),
});


export const ForgotEmailSchema = z.object({
	securityAnswer1: z.string().max(20, { message: "Security answer must be at most 20 characters" }),
	securityAnswer2: z.string().max(20, { message: "Security answer must be at most 20 characters" }),
	
});
export const FirstNameSchema = z.object({
	firstName: z.string().min(2, "First name must be at least 2 characters long"),
  });


export const SettingsSchema = z.object({
	firstName: z.string().min(2, "First name must be at least 2 characters long"),
	lastName: z.string().min(2, "Last name must be at least 2 characters long"),
	dob: z.date().optional().nullable(),
	grade: z.string().optional().nullable(),
	userType: z.enum(["STUDENT", "NON_STUDENT"]),
	email: z.string().email().optional(),
  });
  
  
export type SettingsFormData = z.infer<typeof SettingsSchema>;
  
export const ChangeEmailSchema = z.object({
  changeEmail: z.boolean(),
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




const baseSchema = z.object({
  userType: z.enum(["STUDENT", "NON_STUDENT"]),
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters"),
});

const studentSchema = baseSchema.extend({
  userType: z.literal("STUDENT"),
  grade: z.string().min(1, "Grade is required"),
  dob: z.date().optional(),
});

const nonStudentSchema = baseSchema.extend({
  userType: z.literal("NON_STUDENT"),
});

export const userSchema = z.discriminatedUnion("userType", [
  studentSchema,
  nonStudentSchema,
]);

export type UserFormData = z.infer<typeof userSchema>;
