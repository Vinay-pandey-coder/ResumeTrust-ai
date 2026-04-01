const fs = require('fs').promises; // [NEW]: File delete karne ke liye
const { extractText } = require('../services/pdfService');
const { fetchGitHubData } = require('../services/githubService');
const { analyzeProfile } = require('../services/openAiService');
const Analysis = require('../models/Analysis');

// @desc    Analyze Resume, GitHub & Match with Job Description (JD)
// @route   POST /api/resume/analyze
exports.analyzeResume = async (req, res, next) => {
    try {
        const { githubUsername, jdText } = req.body;

        if (!req.file || !githubUsername) {
            return res.status(400).json({ message: 'Resume and GitHub username are required' });
        }

        // 1. PDF se text nikalna
        const resumeText = await extractText(req.file.path);

        // 2. GitHub se data lana
        const githubData = await fetchGitHubData(githubUsername);

        // 3. AI se analysis karwana
        const analysis = await analyzeProfile(resumeText, githubData, jdText);

        // 4. Database mein save karna
        const newAnalysis = new Analysis({
            userId: req.user.id,
            githubUsername,
            jdText: jdText || "General Audit (No JD provided)",
            resumePath: req.file.path,
            
            trustScore: analysis.trustScore,
            atsScore: analysis.atsScore || 0,
            summary: analysis.analysisSummary,
            skillsMatched: analysis.skillsMatched,
            missingSkills: analysis.missingSkills || [],
            recommendations: analysis.recommendations || [],
            redFlags: analysis.redFlags
        });

        await newAnalysis.save();

        // ---------------------------------------------------------
        // [CLEANUP]: Analysis complete hone ke baad PDF delete karna
        // ---------------------------------------------------------
        if (req.file) {
            await fs.unlink(req.file.path);
            console.log("Temporary Resume File Deleted 🧹");
        }

        // 5. Final Response
        res.status(200).json({
            success: true,
            candidate: githubData.profile.name || githubUsername,
            trustScore: analysis.trustScore,
            atsScore: analysis.atsScore || 0,
            details: analysis
        });
        
    } catch (error) {
        // [ERROR CLEANUP]: Agar crash ho jaye, tab bhi file delete karne ki koshish karo
        if (req.file) {
            await fs.unlink(req.file.path).catch(() => {});
        }
        console.error("Analysis Controller Error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get User Analysis History
exports.getHistory = async (req, res) => {
    try {
        const history = await Analysis.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ 
            success: true, 
            count: history.length, 
            data: history 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};