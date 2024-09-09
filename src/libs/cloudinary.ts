/**
 * Asynchronously generates the Cloudinary URL for image upload.
 * 
 * This function constructs the Cloudinary API URL based on the Cloudinary ID stored in environment variables.
 * It is commonly used to handle image uploads by providing the correct API endpoint.
 * 
 * @returns {Promise<string>} - A promise that resolves to the Cloudinary image upload URL.
 */
export const getCloudUrl = async () => {
  // Constructs the Cloudinary URL using the Cloudinary ID from environment variables
  return `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_ID}/image/upload`;
};
