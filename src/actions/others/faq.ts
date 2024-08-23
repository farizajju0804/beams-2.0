'use server'
import { db } from "@/libs/db";

export const getAllFAQs = async () => {
  try {
    const faqs = await db.fAQ.findMany({
      orderBy: { createdAt: 'desc' },
    });

    if (!faqs || faqs.length === 0) {
      throw new Error("No FAQs found");
    }

    return faqs;
  } catch (error) {
    throw new Error(`Error fetching FAQs: ${(error as Error).message}`);
  }
};