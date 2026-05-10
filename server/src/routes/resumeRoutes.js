const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { analyzeResume, getHistory } = require('../controllers/resumeController');

// ---------------------------------------------------------
// [VALIDATION MIDDLEWARE]
// ---------------------------------------------------------
const validateAnalyze = [
    body('githubUsername')
        .notEmpty()
        .withMessage('GitHub username is required')
        .trim(),
    body('jdText')
        .optional()
        .isLength({ min: 10 })
        .withMessage('Job Description (JD) thoda bada likho bhai (min 10 chars)'),

    // Errors check karne wala logic
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array().map(err => err.msg)
            });
        }
        next();
    }
];

// ---------------------------------------------------------
// [ROUTES]
// ---------------------------------------------------------

// POST /api/resume/analyze
// Full Analysis (Resume + GitHub + JD Match)
router.post('/analyze', protect, upload.single('resume'), validateAnalyze, analyzeResume);

// GET /api/resume/history
// Get User's Past Analysis Results
router.get('/history', protect, getHistory);

module.exports = router;