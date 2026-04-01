// Multer for PDF Handling
const multer = require('multer');
const path = require('path');

// 1. Storage Setup: File kahan aur kis naam se save hogi
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads')); // 'uploads' folder mein save hogi
    },
    filename: (req, file, cb) => {
        // Naam: userId-timestamp.pdf (taaki unique rahe)
        cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// 2. File Filter: Sirf PDF allow karne ke liye [LOGIC]
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed!'), false);
    }
};

// 3. Multer Initialize
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Limit: 5MB max
});

module.exports = upload;