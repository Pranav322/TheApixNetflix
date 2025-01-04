const cloudinary = require('../config/cloudinary.config');
const streamifier = require('streamifier');

const videoController = {
  uploadVideo: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "No video file provided"
        });
      }

      // Create stream from buffer
      let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
          let stream = cloudinary.uploader.upload_stream(
            {
              resource_type: "video",
              folder: "videos",
              eager: [
                { quality: "auto:low", format: 'mp4' },    // 360p
                { quality: "auto", format: 'mp4' },        // 480p
                { quality: "auto:good", format: 'mp4' },   // 720p
                { quality: "auto:best", format: 'mp4' }    // 1080p
              ],
              eager_async: true,
              transformation: [
                { width: 1920, crop: "limit" },           // Max width
                { quality: "auto" }                        // Auto quality
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

      // Extract thumbnail URL
      const thumbnailUrl = cloudinary.url(result.public_id, {
        resource_type: "video",
        format: "jpg",
        transformation: [
          { width: 320, crop: "scale" },
          { start_offset: "0" }
        ]
      });

      return res.status(200).json({
        success: true,
        data: {
          originalUrl: result.secure_url,
          thumbnailUrl: thumbnailUrl,
          publicId: result.public_id,
          duration: result.duration,
          format: result.format,
          eager: result.eager, // Contains different quality versions
        }
      });

    } catch (error) {
      console.error('Upload error:', error);
      return res.status(500).json({
        success: false,
        error: "Error uploading video"
      });
    }
  },

  deleteVideo: async (req, res) => {
    try {
      const { publicId } = req.params;
      
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: "video"
      });

      return res.status(200).json({
        success: true,
        message: "Video deleted successfully"
      });

    } catch (error) {
      console.error('Delete error:', error);
      return res.status(500).json({
        success: false,
        error: "Error deleting video"
      });
    }
  }
};

module.exports = videoController;