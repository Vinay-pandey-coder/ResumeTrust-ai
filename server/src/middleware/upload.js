const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 1. Uploads folder setup (Thoda zyada reliable path)
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 2. Storage Engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // User ID aur Timestamp use karna best hai taaki files mix na ho
        cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// 3. File Filter (Strict PDF check)
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        // Error message thoda user-friendly rakhte hain
        cb(new Error('Invalid file type! Only PDF files are allowed.'), false);
    }
};

// 4. Multer Configuration with 2MB Limit
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024 // [UPDATED] 5MB se hata kar 2MB kar diya hai
    }
});

module.exports = upload;