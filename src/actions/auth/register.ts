"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { RegisterSchema } from "@/schema";
import db from "@/libs/db";
import { getUserByEmail } from "./getUserByEmail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalids Fields!" };
  }

  const { name, email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (existingUser)
    return { error: "User already exists, Try Different Email!" };

  const hashedPassword = await bcrypt.hash(password, 10);
  await db.user.create(
    {
        data: {
            email: email,
            password: hashedPassword,
            name: name,
        }
    }
  )


  // TODO: send verification email token
  return { success: "User Created" };
};