const logger = require('./logger');

/**
 * Global Error Handling Middleware
 * Iska kaam hai poore app mein kahin bhi error aaye toh use handle karna
 */
const errorHandler = (err, req, res, next) => {
    // Agar status code pehle se set nahi hai toh 500 (Server Error) maano
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    // ---------------------------------------------------------
    // [ADVANCED LOGGING]: Winston se error ki puri details log karna
    // ---------------------------------------------------------
    logger.error({
        message: err.message,
        stack: err.stack,        // Kahan error aaya (file & line number)
        url: req.originalUrl,    // Kaunsa route fail hua
        method: req.method,      // POST/GET kya tha
        ip: req.ip,              // Kisne request bheji
        timestamp: new Date().toISOString()
    });

    // Final JSON Response jo Frontend ko milega
    res.status(statusCode).json({
        success: false,
        message: err.message,
        // Security: Production mein stack trace hide kar dete hain
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = errorHandler;