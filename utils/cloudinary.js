const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload an image to Cloudinary.
 * @param {string} image The image URL or base64-encoded string.
 * @returns {Promise<string>} The secure URL of the uploaded image.
*/


const uploadImage = async (image) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: 'properties',  // Optional: Organize images in this folder
      transformation: [
        { width: 800, height: 600, crop: 'limit' }, // Optional: Resize and crop
      ],
    });
    return uploadResponse.secure_url;
  } catch (error) {
    throw new Error('Cloudinary upload failed: ' + error.message);
  }
};

module.exports = { uploadImage };
