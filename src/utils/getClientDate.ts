// utils/getClientDate.ts (Client-side utility)
"use client";

export function getClientDate() {
  console.log(new Date().toLocaleDateString("en-CA"))
  return new Date().toLocaleDateString("en-CA"); 
}
