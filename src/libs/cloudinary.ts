// app/actions/auth/cloudinary.ts
'use server'

import crypto from 'crypto';

interface CloudinaryResponse {
  secure_url?: string;
  error?: string;
}

export async function uploadToCloudinary(
  formData: FormData
): Promise<CloudinaryResponse> {
  try {
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    if (!file || !userId) {
      return { error: "File and userId are required" };
    }

    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return { error: "Please select a valid image file (JPEG, PNG, or GIF)" };
    }

    const maxSize = 200 * 1024; // 200KB
    if (file.size > maxSize) {
      return { error: "File size exceeds 200KB. Please choose a smaller image." };
    }

    // Generate timestamp and signature
    const timestamp = Math.round((new Date()).getTime() / 1000);
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    
    const publicId = `user_${userId}_profile`;
    
    // Generate signature
    const paramsToSign = {
      timestamp: timestamp,
      upload_preset: uploadPreset,
      public_id: publicId,
      overwrite: true
    };
    
    const signaturePayload = Object.entries(paramsToSign)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('&') + apiSecret;

    const signature = crypto
      .createHash('sha1')
      .update(signaturePayload)
      .digest('hex');

    // Create new FormData for Cloudinary
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append("file", file);
    cloudinaryFormData.append("api_key", process.env.CLOUDINARY_API_KEY || "");
    cloudinaryFormData.append("timestamp", timestamp.toString());
    cloudinaryFormData.append("signature", signature);
    cloudinaryFormData.append("upload_preset", uploadPreset || "");
    cloudinaryFormData.append("public_id", publicId);
    cloudinaryFormData.append("overwrite", "true");

    // Upload to Cloudinary
    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: cloudinaryFormData,
      }
    );

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      throw new Error(`Cloudinary API error: ${uploadResponse.status} ${errorText}`);
    }

    const uploadResult = await uploadResponse.json();

    if (uploadResult.secure_url) {
      return { secure_url: uploadResult.secure_url };
    } else {
      throw new Error("Unexpected Cloudinary response");
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    return { 
      error: error instanceof Error ? error.message : "An unexpected error occurred while uploading the image"
    };
  }
}