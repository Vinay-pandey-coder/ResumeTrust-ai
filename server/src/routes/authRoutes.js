const express = require('express');
const router = express.Router();
const { 
    register, 
    login, 
    getMe, 
    updateProfile, 
    deleteAccount,
    forgotPassword,  // [NEW]
    verifyOtp,       // [NEW]
    resetPassword    // [NEW]
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const passport = require('passport');

// Private Routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.delete('/account', protect, deleteAccount);

// Public Routes
router.post('/register', register);
router.post('/login', login);

// [NEW] Forgot Password Routes — Public
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

// ---------------------------------------------------------
// [NEW] GitHub OAuth Routes
// ---------------------------------------------------------

// Step 1: GitHub login page pe bhejo
router.get('/github', passport.authenticate('github', {
    scope: ['user:email']
}));

// Step 2: GitHub callback — verified username ke saath frontend pe bhejo
router.get('/github/callback',
    passport.authenticate('github', {
        failureRedirect: `${process.env.CLIENT_URL}/register?error=github_failed`
    }),
    (req, res) => {
        const githubUser = req.user;
        console.log(`🎉 GitHub callback success: ${githubUser.githubUsername}`);

        res.redirect(
            `${process.env.CLIENT_URL}/register?` +
            `github_username=${githubUser.githubUsername}&` +
            `github_name=${encodeURIComponent(githubUser.name)}&` +
            `github_verified=true`
        );
    }
);

module.exports = router;