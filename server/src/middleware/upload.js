const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// 1. Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Storage Setup: Ab file server ke bajaye seedha Cloudinary jayegi
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'resumes', // Cloudinary mein 'resumes' folder ban jayega
        allowed_formats: ['pdf'], // Sirf PDF allow kar rahe hain
        public_id: (req, file) => {
            // Unique Naam: userId-timestamp
            return `${req.user._id}-${Date.now()}`;
        }
    },
});

// 3. File Filter (Optional but good for extra safety)
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed!'), false);
    }
};

// 4. Multer Initialize
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

module.exports = upload;