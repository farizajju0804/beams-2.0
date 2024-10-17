// Importing PrismaClient from the Prisma package to interact with the database
import { PrismaClient } from "@prisma/client";

// Declaring a global variable to store the PrismaClient instance.
// This helps to avoid multiple instances in development, which could lead to resource issues.
declare global {
  var prisma: PrismaClient | undefined; // 'prisma' is either a PrismaClient instance or undefined
}

// Exporting a singleton PrismaClient instance.
// If `globalThis.prisma` exists (already initialized), we reuse it; otherwise, a new PrismaClient is created.
export const db = globalThis.prisma || new PrismaClient();

// In development, assign the PrismaClient instance to `globalThis.prisma` to ensure that
// the same instance is reused across hot-reloads in development mode.
if (process.env.NODE_ENV !== "production") globalThis.prisma = db;




