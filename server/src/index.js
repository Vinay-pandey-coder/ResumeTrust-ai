const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const errorHandler = require('./utils/errorHandler');

// 1. Setup & Environment
dotenv.config();
console.log("Check API Key:", process.env.GEMINI_API_KEY ? "Key Loaded ✅" : "Key Not Found ❌");

// 2. Database Connection
connectDB();

const app = express();

// ---------------------------------------------------------
// [MIDDLEWARES]
// ---------------------------------------------------------

// Security: Headers ko secure karta hai
app.use(helmet());

// Logging: Terminal mein requests ka status dikhayega (GET /api 200...)
app.use(morgan('dev'));

// Performance: Response data ko compress karke fast bhejta hai
app.use(compression());

// Spam Protection: Ek IP se 15 min mein max 50 requests
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, 
    message: { message: "Too many requests, please try again after 15 minutes." }
});
app.use('/api/', limiter);

// Standard Middlewares
app.use(cors());
app.use(express.json());

// ---------------------------------------------------------
// [ROUTES]
// ---------------------------------------------------------

app.get('/', (req, res) => {
    res.send('ResumeTrust-AI Backend is Running! 🚀');
});

app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);

// ---------------------------------------------------------
// [ERROR HANDLING]
// ---------------------------------------------------------

// Error Handler (Hamesha saare routes ke BAAD hona chahiye)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});