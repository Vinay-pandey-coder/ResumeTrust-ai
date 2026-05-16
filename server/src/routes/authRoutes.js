const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile, deleteAccount } = require('../controllers/authController'); // [NEW] updateProfile, deleteAccount add kiye
const { protect } = require('../middleware/auth');
const passport = require('passport');

// Private Routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);     // [NEW] Profile update
router.delete('/account', protect, deleteAccount);  // [NEW] Account delete

// Public Routes
router.post('/register', register);
router.post('/login', login);

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