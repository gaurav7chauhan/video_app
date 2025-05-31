import { v2 as cloudinary } from "cloudinary";
import fs from "fs"; // Node.js file system module

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return console.error("File path not found");

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // ✅ Cloud pe successfully upload hone ke baad local file delete karo
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export { uploadOnCloudinary };

/*
  Humne yeh utility isliye banayi hai kyunki hume images ya videos jaise media files
  ko kisi cloud storage mein store karna hota hai.
  Is case mein hum Cloudinary ka use kar rahe hain taaki media files safely upload ho jayein.
*/
