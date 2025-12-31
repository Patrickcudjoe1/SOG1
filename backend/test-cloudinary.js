import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import connectCloudinary from "./config/cloudinary.js";

async function testCloudinary() {
  console.log("🧪 Testing Cloudinary Configuration...\n");

  // Test 1: Check environment variables
  console.log("1️⃣ Checking environment variables:");
  if (process.env.CLOUDINARY_URL) {
    console.log("   ✅ CLOUDINARY_URL is set");
    // Remove brackets if present for display
    const displayUrl = process.env.CLOUDINARY_URL.replace(/[<>]/g, '');
    const parts = displayUrl.split('@');
    if (parts.length === 2) {
      console.log(`   📋 Cloud Name: ${parts[1]}`);
    }
  } else if (process.env.CLOUDINARY_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_SECRET_KEY) {
    console.log("   ✅ Individual Cloudinary variables are set");
    console.log(`   📋 Cloud Name: ${process.env.CLOUDINARY_NAME}`);
  } else {
    console.log("   ❌ No Cloudinary environment variables found");
    console.log("   Please set CLOUDINARY_URL or individual variables in .env file");
    process.exit(1);
  }

  console.log("\n2️⃣ Testing Cloudinary connection:");
  try {
    const connected = await connectCloudinary();
    if (!connected) {
      console.log("   ❌ Failed to connect to Cloudinary");
      process.exit(1);
    }
  } catch (error) {
    console.error("   ❌ Error:", error.message);
    process.exit(1);
  }

  console.log("\n3️⃣ Testing Cloudinary API (ping):");
  try {
    const result = await cloudinary.api.ping();
    console.log("   ✅ Cloudinary API is responding");
    console.log(`   📊 Status: ${result.status}`);
  } catch (error) {
    console.error("   ❌ API test failed:", error.message);
    process.exit(1);
  }

  console.log("\n4️⃣ Testing image upload (using a test image):");
  try {
    // Upload a small test image (1x1 pixel transparent PNG in base64)
    const testImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    
    const uploadResult = await cloudinary.uploader.upload(testImage, {
      folder: "test",
      public_id: `test-${Date.now()}`,
      overwrite: true
    });
    
    console.log("   ✅ Image upload successful!");
    console.log(`   🔗 Uploaded URL: ${uploadResult.secure_url}`);
    console.log(`   📦 Public ID: ${uploadResult.public_id}`);
    
    // Clean up: Delete the test image
    await cloudinary.uploader.destroy(uploadResult.public_id);
    console.log("   🗑️  Test image deleted (cleanup)");
    
  } catch (error) {
    console.error("   ❌ Image upload test failed:", error.message);
    if (error.http_code) {
      console.error(`   📊 HTTP Code: ${error.http_code}`);
    }
    process.exit(1);
  }

  console.log("\n✅ All Cloudinary tests passed!");
  console.log("🎉 Cloudinary is properly configured and working!");
}

testCloudinary().catch(error => {
  console.error("\n❌ Test failed with error:", error);
  process.exit(1);
});

