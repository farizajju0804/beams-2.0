// app/actions/signOutUser.js
"use server";
import { signOut } from "@/auth";

 // This directive allows the function to be a server action


export async function signOutUser() {
  console.log('clicked')
  await signOut({ redirect: false });
  console.log('signout called')
  return { success: true };
}