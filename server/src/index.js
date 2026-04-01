const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Environment variables load karne ke liye
dotenv.config();

const app = express();

// Middlewares
app.use(cors()); // Frontend se connection allow karne ke liye
app.use(express.json()); // JSON data ko samajhne ke liye

// Test Route (Check karne ke liye ki backend chal raha hai)
app.get('/', (req, res) => {
    res.send('ResumeTrust-AI Backend is Running! 🚀');
});

// Port define karna (.env se ya default 5000)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});