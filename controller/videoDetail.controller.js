const VideoDetail = require('../model/video.model'); // Adjust the path to your model file

// Add Video Detail Function
const addVideoDetail = async (req, res) => {
    try {
        const { movieId, originalUrl, publicId, secureUrl, duration, format, thumbnailUrl, resolutions } = req.body;

        // Ensure movieId and originalUrl are provided
        if (!movieId || !originalUrl) {
            return res.status(400).json({ success: false, message: "movieId and originalUrl are required" });
        }

        const videoDetail = new VideoDetail({
            movieId,
            originalUrl,
            publicId,
            secureUrl,
            duration,
            format,
            thumbnailUrl,
            resolutions,
        });

        await videoDetail.save();

        res.status(201).json({ success: true, message: "Video detail added successfully", data: videoDetail });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to add video detail", error: error.message });
    }
};

// Get Video by ID Function
const getVideoById = async (req, res) => {
    try {
        const { movieId } = req.params;

        // Validate movieId
        if (!movieId) {
            return res.status(400).json({ success: false, message: "movieId is required" });
        }

        // Find video detail by movieId
        const videoDetail = await VideoDetail.findOne({ movieId });

        if (!videoDetail) {
            return res.status(404).json({ success: false, message: "Video detail not found" });
        }

        res.status(200).json({ success: true, message: "Video detail retrieved successfully", data: videoDetail });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to retrieve video detail", error: error.message });
    }
};

// Export both functions
module.exports = {
    addVideoDetail,
    getVideoById,
};
