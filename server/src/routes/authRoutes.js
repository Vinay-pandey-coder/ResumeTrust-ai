const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Private Routes
router.get('/me', protect, getMe);

// Public Routes
router.post('/register', register);
router.post('/login', login);

module.exports = router;