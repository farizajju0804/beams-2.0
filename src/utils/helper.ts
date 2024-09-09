import bcrypt from "bcryptjs"; // Importing bcrypt for password hashing

/**
 * Function to salt and hash a password.
 * 
 * @param {any} password - The plain-text password to be hashed.
 * @returns {string} - The salted and hashed password.
 */
export function saltAndHashPassword(password: any) {
  const saltRounds = 10; // Number of rounds for salt generation, affects security and performance
  const salt = bcrypt.genSaltSync(saltRounds); // Synchronously generate a salt with the specified rounds
  const hash = bcrypt.hashSync(password, salt); // Synchronously hash the password using the generated salt
  return hash; // Return the resulting hashed password as a string
}
