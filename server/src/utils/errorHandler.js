const logger = require('./logger');

/**
 * Global Error Handling Middleware
 * Iska kaam hai poore app mein kahin bhi error aaye toh use handle karna
 */
const errorHandler = (err, req, res, next) => {
    // Default Status Code
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    // ---------------------------------------------------------
    // [NEW] MULTER SIZE LIMIT HANDLING
    // ---------------------------------------------------------
    if (err.code === 'LIMIT_FILE_SIZE') {
        statusCode = 400; // Bad Request
        message = 'File size is too large! Maximum limit is 2MB.';
    }

    // ---------------------------------------------------------
    // [NEW] MULTER GENERIC ERRORS (Like Wrong File Type)
    // ---------------------------------------------------------
    if (err.message === 'Invalid file type! Only PDF files are allowed.') {
        statusCode = 400;
    }

    // ---------------------------------------------------------
    // [ADVANCED LOGGING]: Winston se error ki puri details log karna
    // ---------------------------------------------------------
    logger.error({
        message: message,
        stack: err.stack,        // Kahan error aaya (file & line number)
        url: req.originalUrl,    // Kaunsa route fail hua
        method: req.method,      // POST/GET kya tha
        ip: req.ip,              // Kisne request bheji
        timestamp: new Date().toISOString()
    });

    // Final JSON Response jo Frontend ko milega
    res.status(statusCode).json({
        success: false,
        message: message,
        // Security: Production mein stack trace hide kar dete hain
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = errorHandler;