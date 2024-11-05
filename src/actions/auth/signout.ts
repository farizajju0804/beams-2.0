// app/actions/signOutUser.js
"use server";
import { signOut } from "@/auth";

/**
 * Signs out the current user using the signOut method.
 * The `signOut` function is called with redirect set to false to prevent immediate redirection.
 * The function returns an object with a success property when the user is signed out.
 * 
 * @returns {Object} - Returns { success: true } after successful sign out.
 */
export async function signOutUser() {
  console.log('clicked');
  
  // Calls the signOut function to log out the user
  const result = await signOut({redirectTo : "/auth/login"});
  
  // console.log('signout called');
  
  return result
  // return { success: true }; // Return success confirmation
}
