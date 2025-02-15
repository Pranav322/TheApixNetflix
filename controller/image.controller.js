const cloudinary = require('../config/cloudinary.config');
const streamifier = require('streamifier');

const imageController = {
  uploadImage: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "No image file provided"
        });
      }

      // Create stream from buffer
      let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
          let stream = cloudinary.uploader.upload_stream(
            {
              folder: "images",
              transformation: [
                { width: 1920, crop: "limit" }, // Resize for max width
                { quality: "auto" }             // Optimize quality
              ]
            },
            (error, result) => {
              if (result) {
                resolve(result);
              } else {
                reject(error);
              }
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      const result = await streamUpload(req);

      return res.status(200).json({
        success: true,
        data: {
          originalUrl: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          width: result.width,
          height: result.height,
        }
      });

    } catch (error) {
      console.error('Upload error:', error);
      return res.status(500).json({
        success: false,
        error: "Error uploading image"
      });
    }
  },

  deleteImage: async (req, res) => {
    try {
      const { publicId } = req.params;

      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: "image"
      });

      return res.status(200).json({
        success: true,
        message: "Image deleted successfully"
      });

    } catch (error) {
      console.error('Delete error:', error);
      return res.status(500).json({
        success: false,
        error: "Error deleting image"
      });
    }
  }
};

module.exports = imageController;
