const winston = require('winston');
const path = require('path');

const transports = [];

// 1. Console transport hamesha rahega (Dev aur Prod dono ke liye)
transports.push(
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    })
);

// 2. Sirf agar hum Local (Development) par hain, tabhi FILE mein log karenge
if (process.env.NODE_ENV !== 'production') {
    transports.push(
        new winston.transports.File({ 
            filename: path.join(__dirname, '../../logs/error.log'), 
            level: 'error' 
        })
    );
}

const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'error', 
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.json()
    ),
    transports: transports,
});

module.exports = logger;