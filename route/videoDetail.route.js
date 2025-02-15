const express = require('express');
const router = express.Router();
const { addVideoDetail, getVideoById } = require('../controller/videoDetail.controller'); // Adjust the path to your controller file

// Route for adding video details
router.post('/add', addVideoDetail);

// Route for getting video details by movieId
router.get('/:movieId', getVideoById);

module.exports = router;
