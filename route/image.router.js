const express = require('express');
const multer = require('multer');
const imageController = require('../controller/image.controller');

const upload = multer(); // Use multer for multipart form data
const router = express.Router();

router.post('/upload', upload.single('image'), imageController.uploadImage);
router.delete('/delete/:publicId', imageController.deleteImage);

module.exports = router;

