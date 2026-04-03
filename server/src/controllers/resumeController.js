const fs = require('fs').promises;
const { extractText } = require('../services/pdfService');
const { fetchGitHubData } = require('../services/githubService');
const { analyzeProfile } = require('../services/openAiService');
const Analysis = require('../models/Analysis');

// @desc    Analyze Resume, GitHub & Match with JD
// @route   POST /api/resume/analyze
exports.analyzeResume = async (req, res, next) => {
    try {
        const { githubUsername, jdText } = req.body;
        const currentUser = req.user;

        // 1. Basic Validation
        if (!req.file || !githubUsername) {
            return res.status(400).json({ 
                success: false, 
                message: 'Resume and GitHub username are required' 
            });
        }

        // ---------------------------------------------------------
        // [SECURITY LOGIC]
        // ---------------------------------------------------------
        if (!currentUser.isRecruiter) {
            if (githubUsername.toLowerCase() !== currentUser.githubHandle.toLowerCase()) {
                if (req.file) await fs.unlink(req.file.path).catch(() => {});
                return res.status(403).json({
                    success: false,
                    message: "Security Alert: You can only analyze your own registered GitHub profile!"
                });
            }
        }

        console.log(`Analysis started for: ${githubUsername} by ${currentUser.name}`);

        // 2. Local PDF se text nikalna
        const resumeText = await extractText(req.file.path);

        // 3. GitHub se data lana
        const githubData = await fetchGitHubData(githubUsername);

        // 4. AI se analysis karwana
        const analysis = await analyzeProfile(resumeText, githubData, jdText);

        // 5. Database mein save karna
        const newAnalysis = new Analysis({
            userId: req.user.id,
            githubUsername,
            jdText: jdText || "General Audit (No JD provided)",
            resumePath: 'deleted_after_analysis',
            trustScore: analysis.trustScore,
            atsScore: analysis.atsScore || 0,
            summary: analysis.analysisSummary,
            skillsMatched: analysis.skillsMatched,
            missingSkills: analysis.missingSkills || [],
            recommendations: analysis.recommendations || [],
            redFlags: analysis.redFlags
        });

        await newAnalysis.save();

        // 6. PDF delete karna
        if (req.file) {
            await fs.unlink(req.file.path).catch(() => {});
            console.log("Temporary Resume File Deleted");
        }

        // 7. Final Response
        res.status(200).json({
            success: true,
            candidate: githubData.profile.name || githubUsername,
            trustScore: analysis.trustScore,
            atsScore: analysis.atsScore || 0,
            details: analysis
        });

    } catch (error) {
        if (req.file) {
            await fs.unlink(req.file.path).catch(() => {});
        }
        console.error("Analysis Controller Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const history = await Analysis.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ 
            success: true, 
            count: history.length, 
            data: history 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};