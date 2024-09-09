// Import necessary utilities from external libraries
import { ClassValue, clsx } from "clsx"; // `clsx` is used to conditionally join class names together
import { twMerge } from "tailwind-merge"; // `twMerge` is used to intelligently merge Tailwind CSS class names

/**
 * Utility function `cn` that combines and merges CSS class names.
 * 
 * This function is designed to handle class names dynamically, particularly for working with Tailwind CSS.
 * It leverages `clsx` to join multiple class names conditionally and `twMerge` to resolve conflicting Tailwind class names.
 * 
 * @param {...ClassValue[]} inputs - The class names to be combined. These can include strings, arrays, or conditional objects.
 * 
 * @returns {string} - A single string of merged class names, with conflicts resolved (especially for Tailwind CSS).
 */
export function cn(...inputs: ClassValue[]) {
  // First, clsx processes the inputs and conditionally joins class names
  // Then, twMerge resolves conflicting Tailwind classes (like `p-4` and `p-6`)
  return twMerge(clsx(inputs));
}
