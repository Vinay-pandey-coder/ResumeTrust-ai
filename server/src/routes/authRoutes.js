// Authentication API Endpoints
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// ---------------------------------------------------------
// [PRIVATE ROUTES]
// ---------------------------------------------------------

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile (Token required)
 * @access  Private
 */
router.get('/me', protect, (req, res) => {
    // Agar token sahi hai, toh logged-in user ka data dikhega
    res.json(req.user); 
});

// ---------------------------------------------------------
// [PUBLIC ROUTES]
// ---------------------------------------------------------

/**
 * @route   POST /api/auth/register
 * @desc    Naya account banane ke liye
 * @access  Public
 */
router.post('/register', register);

/**
 * @route   POST /api/auth/login
 * @desc    Login karke JWT Token lene ke liye
 * @access  Public
 */
router.post('/login', login);

module.exports = router;