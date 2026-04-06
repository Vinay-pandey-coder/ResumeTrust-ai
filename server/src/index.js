const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cron = require('node-cron'); // [NEW] Cron import

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const errorHandler = require('./utils/errorHandler');
const Analysis = require('./models/Analysis'); // [NEW] Model import cleanup ke liye

dotenv.config();
console.log("Check API Key:", process.env.GEMINI_API_KEY ? "Key Loaded ✅" : "Key Not Found ❌");

connectDB();

const app = express();
app.set('trust proxy', 1);

// ---------------------------------------------------------
// [NEW] MONGODB AUTO-CLEANUP (Every Sunday at Midnight)
// ---------------------------------------------------------
cron.schedule('0 0 * * 0', async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  try {
    const result = await Analysis.deleteMany({ createdAt: { $lt: thirtyDaysAgo } });
    console.log(`Cleanup Task: Deleted ${result.deletedCount} records older than 30 days.`);
  } catch (err) {
    console.error("Cleanup Error:", err);
  }
});

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://resume-trust-ai.vercel.app',
    'https://resume-trust-ai-wccy.vercel.app',
    process.env.CLIENT_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(express.json());
app.use(morgan('dev'));
app.use(compression());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests, please try again after 15 minutes." }
});
app.use('/api/', limiter);

app.get('/', (req, res) => {
  res.send('ResumeTrust-AI Backend is Running! 🚀');
});

app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});