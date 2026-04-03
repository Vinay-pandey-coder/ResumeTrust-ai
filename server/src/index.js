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
app.set('trust proxy', 1);

// ---------------------------------------------------------
// [CORS & SECURITY MIDDLEWARES]
// ---------------------------------------------------------

// Standard CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    process.env.CLIENT_URL  // ← ye add karo
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Use CORS first to handle all preflight (OPTIONS) requests correctly
app.use(cors(corsOptions));

// Security Headers
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" } // Allow resources to be loaded cross-origin
}));

// Standard Middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use(compression());

// Spam Protection: Ek IP se 15 min mein max 100 requests (increased limit for dev/analysis)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { message: "Too many requests, please try again after 15 minutes." }
});
app.use('/api/', limiter);


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