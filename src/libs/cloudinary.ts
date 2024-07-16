export const getCloudUrl = async () => {
 
    return `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_ID}/image/upload`;
  };
  