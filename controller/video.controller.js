const cloudinary = require('../config/cloudinary.config');
const streamifier = require('streamifier');

const videoController = {
  uploadVideo: async (req, res) => {
    try {
      if (!req.files?.video || !req.files?.video[0]) {
        return res.status(400).json({
          success: false,
          error: "No video file provided"
        });
      }

      // Create stream from buffer for video
      let streamUpload = (buffer, options) => {
        return new Promise((resolve, reject) => {
          let stream = cloudinary.uploader.upload_stream(
            options,
            (error, result) => {
              if (result) {
                resolve(result);
              } else {
                reject(error);
              }
            }
          );
          streamifier.createReadStream(buffer).pipe(stream);
        });
      };

      // Upload main video
      const videoResult = await streamUpload(req.files.video[0].buffer, {
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
      });

      // Upload trailer if provided
      let trailerResult;
      if (req.files?.trailer && req.files?.trailer[0]) {
        trailerResult = await streamUpload(req.files.trailer[0].buffer, {
          resource_type: "video",
          folder: "trailers",
          eager: [
            { quality: "auto:low", format: 'mp4' }
          ]
        });
      }

      // Handle thumbnail upload
      let thumbnailUrl;
      if (req.files?.thumbnail && req.files?.thumbnail[0]) {
        const thumbnailResult = await streamUpload(req.files.thumbnail[0].buffer, {
          resource_type: "image",
          folder: "thumbnails",
          transformation: [
            { width: 320, crop: "scale" }
          ]
        });
        thumbnailUrl = thumbnailResult.secure_url;
      } else {
        // Use auto-generated thumbnail from video
        thumbnailUrl = cloudinary.url(videoResult.public_id, {
          resource_type: "video",
          format: "jpg",
          transformation: [
            { width: 320, crop: "scale" },
            { start_offset: "0" }
          ]
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          originalUrl: videoResult.secure_url,
          thumbnailUrl: thumbnailUrl,
          publicId: videoResult.public_id,
          duration: videoResult.duration,
          format: videoResult.format,
          eager: videoResult.eager, // Contains different quality versions
          trailer: trailerResult ? {
            url: trailerResult.secure_url,
            publicId: trailerResult.public_id
          } : null
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