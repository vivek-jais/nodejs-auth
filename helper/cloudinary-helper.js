const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.path);

    return{
        url: result.secure_url,
        publicId: result.public_id
    }

  } catch (error) {
    console.error("error wile uploading file", error);
    throw new Error("Erroer while uploading file to cloudinary!..");
  }
};

module.exports = { uploadToCloudinary };
