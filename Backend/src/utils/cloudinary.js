import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.error("❌ No file path provided.");
      return null; 
    }

    const normalizedPath = path.resolve(localFilePath); // ✅ Normalize path for Windows
    console.log("📂 Uploading file:", normalizedPath);

    const response = await cloudinary.uploader.unsigned_upload(
      normalizedPath,
      "public_resume_uploads", // your preset name
      {
        resource_type: "raw"
      }
    );

    console.log("✅ File uploaded:", response.url);

    // Delete local file safely
    if (fs.existsSync(normalizedPath)) {
      fs.unlinkSync(normalizedPath);
    } 

    return response;
  } catch (error) {
    console.error("❌ Cloudinary upload failed:", error.message);

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};

export { uploadCloudinary };
