const winston = require('winston');
const path = require('path');

// Logger configuration
const logger = winston.createLogger({
    level: 'error', // Sirf errors aur usse upar ki cheezein record karega
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.json() // Logs JSON format mein honge (Standard)
    ),
    transports: [
        // 1. Errors ko 'logs/error.log' file mein save karega
        new winston.transports.File({ 
            filename: path.join(__dirname, '../../logs/error.log'), 
            level: 'error' 
        }),
        // 2. Development ke waqt console par bhi dikhayega
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ],
});

module.exports = logger;