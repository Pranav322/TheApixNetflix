const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if ((file.fieldname === 'video' || file.fieldname === 'trailer') && 
      file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else if (file.fieldname === 'thumbnail' && file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type for ${file.fieldname}!`), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 4096 * 1024 * 1024, // 4GB
  },
  fileFilter: fileFilter
});

// Export middleware that handles video, thumbnail and trailer
module.exports = upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
  { name: 'trailer', maxCount: 1 }
]);