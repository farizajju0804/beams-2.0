// actions/shortUrl.ts
'use server'

import { db } from "@/libs/db";



// Generate a random short path
const generateShortPath = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({length: 6}, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
};

export async function createShortUrl(fullUrl: string, metadata: {
  title: string;
  description: string;
  imageUrl?: string;
  type?: string;
}) {

  try {
    // Check if URL already exists
    let shortUrl = await db.shortUrl.findFirst({
      where: { fullUrl }
    });

    // If not, create new short URL
    if (!shortUrl) {
      shortUrl = await db.shortUrl.create({
        data: {
          shortPath: generateShortPath(),
          fullUrl,
          title: metadata.title,
          description: metadata.description,
          imageUrl: metadata.imageUrl,
          type: metadata.type || 'website'
        }
      });
    }

    return `${shortUrl.shortPath}`;
  } catch (error) {
    console.error('Error creating short URL:', error);
    return fullUrl; // Fallback to full URL if shortening fails
  }
}