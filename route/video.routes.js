const express = require('express');
const router = express.Router();
const videoController = require('../controller/video.controller');
const upload = require('../middleware/upload.middleware');

// Upload video route (public)
router.post('/upload', 
  upload.single('video'), 
  videoController.uploadVideo
);

// Delete video route (public)
router.delete('/:publicId', 
  videoController.deleteVideo
);

module.exports = router;