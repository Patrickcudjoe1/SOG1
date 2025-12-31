import {v2 as cloudinary} from "cloudinary"

const connectCloudinary = async ()=>{
    try {
        // Check if CLOUDINARY_URL is provided (preferred method)
        if (process.env.CLOUDINARY_URL) {
            // Remove angle brackets if present (some users copy URLs with brackets)
            const cleanUrl = process.env.CLOUDINARY_URL.replace(/[<>]/g, '');
            // Cloudinary SDK can parse the URL directly
            cloudinary.config(cleanUrl);
        } 
        // Fallback to individual environment variables
        else if (process.env.CLOUDINARY_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_SECRET_KEY) {
            cloudinary.config({
                cloud_name: process.env.CLOUDINARY_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_SECRET_KEY
            });
        } 
        else {
            console.warn("⚠️  Cloudinary environment variables are missing. Cloudinary features will not work.");
            console.warn("   Please set either CLOUDINARY_URL or CLOUDINARY_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_SECRET_KEY");
            return false;
        }

        // Test the configuration by making a simple API call
        await cloudinary.api.ping();
        console.log("✅ Cloudinary connected successfully");
        return true;
    } catch (error) {
        console.error("❌ Error connecting to Cloudinary:", error.message);
        return false;
    }
}

export default connectCloudinary
