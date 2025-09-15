const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(uploadsDir, file.fieldname);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const filename = `${file.fieldname}-${uniqueSuffix}${extension}`;
    cb(null, filename);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'video/mp4': 'mp4',
    'video/avi': 'avi',
    'video/mov': 'mov',
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx'
  };

  if (allowedTypes[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed`), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 10 // Maximum 10 files per request
  }
});

// Specific upload configurations
const uploadIssueImages = upload.fields([
  { name: 'images', maxCount: 5 },
  { name: 'documents', maxCount: 3 }
]);

const uploadWorkOrderFiles = upload.fields([
  { name: 'progressImages', maxCount: 10 },
  { name: 'documents', maxCount: 5 },
  { name: 'beforeImages', maxCount: 5 },
  { name: 'afterImages', maxCount: 5 }
]);

const uploadCommunityWatchFiles = upload.fields([
  { name: 'images', maxCount: 5 },
  { name: 'videos', maxCount: 3 },
  { name: 'documents', maxCount: 2 }
]);

const uploadProfileImage = upload.single('profileImage');

// Error handling middleware for multer
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: 'File too large. Maximum size is 10MB per file.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        message: 'Too many files. Please reduce the number of files.'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        message: 'Unexpected field name for file upload.'
      });
    }
  }
  
  if (error.message.includes('File type')) {
    return res.status(400).json({
      message: error.message
    });
  }
  
  next(error);
};

// Utility function to delete uploaded files
const deleteUploadedFiles = (filePaths) => {
  if (Array.isArray(filePaths)) {
    filePaths.forEach(filePath => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
  } else if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// Utility function to get file URLs
const getFileUrls = (req, fieldName) => {
  const files = req.files?.[fieldName] || [];
  return files.map(file => ({
    url: `/uploads/${fieldName}/${file.filename}`,
    filename: file.filename,
    originalname: file.originalname,
    size: file.size,
    mimetype: file.mimetype
  }));
};

// Middleware to clean up files on error
const cleanupOnError = (req, res, next) => {
  const originalSend = res.send;
  res.send = function(data) {
    // If response is an error, clean up uploaded files
    if (res.statusCode >= 400) {
      if (req.files) {
        Object.values(req.files).forEach(fileArray => {
          if (Array.isArray(fileArray)) {
            fileArray.forEach(file => {
              deleteUploadedFiles(file.path);
            });
          } else {
            deleteUploadedFiles(fileArray.path);
          }
        });
      }
    }
    originalSend.call(this, data);
  };
  next();
};

module.exports = {
  upload,
  uploadIssueImages,
  uploadWorkOrderFiles,
  uploadCommunityWatchFiles,
  uploadProfileImage,
  handleUploadError,
  deleteUploadedFiles,
  getFileUrls,
  cleanupOnError
};
