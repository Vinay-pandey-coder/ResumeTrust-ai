const fs = require('fs').promises;
const crypto = require('crypto'); // [NEW] File hashing ke liye
const cloudinary = require('cloudinary').v2;
const { extractText } = require('../services/pdfService');
const { fetchGitHubData } = require('../services/githubService');
const { analyzeProfile } = require('../services/openAiService');
const Analysis = require('../models/Analysis');

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.analyzeResume = async (req, res, next) => {
    let cloudinaryPublicId = null;

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

        // 2MB Size Limit Check
        if (req.file.size > 2097152) {
            await fs.unlink(req.file.path).catch(() => { });
            return res.status(400).json({
                success: false,
                message: "File too large! Please upload a PDF under 2MB."
            });
        }

        // [SECURITY LOGIC]
        if (!currentUser.isRecruiter) {
            if (githubUsername.toLowerCase() !== currentUser.githubHandle.toLowerCase()) {
                if (req.file) await fs.unlink(req.file.path).catch(() => { });
                return res.status(403).json({
                    success: false,
                    message: "Security Alert: You can only analyze your own registered GitHub profile!"
                });
            }
        }

        // ---------------------------------------------------------
        // [NEW] FILE HASH LOGIC: Check if file content changed
        // ---------------------------------------------------------
        const fileBuffer = await fs.readFile(req.file.path);
        const currentFileHash = crypto.createHash('md5').update(fileBuffer).digest('hex');

        // [UPDATED] API CREDIT SAVER: 24-Hour & File Hash Check
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentAnalysis = await Analysis.findOne({
            userId: currentUser.id,
            githubUsername: githubUsername,
            fileHash: currentFileHash, // [NEW] Sirf tabhi cache dikhao agar file wahi purani hai
            createdAt: { $gt: oneDayAgo }
        });

        if (recentAnalysis) {
            if (req.file) await fs.unlink(req.file.path).catch(() => { });

            console.log(`Credit Saved: Showing cached result for ${githubUsername} (File Unchanged)`);
            return res.status(200).json({
                success: true,
                message: "Showing recent analysis from history to save credits.",
                candidate: githubUsername,
                trustScore: recentAnalysis.trustScore,
                atsScore: recentAnalysis.atsScore || 0,
                details: recentAnalysis
            });
        }

        console.log(`Analysis started for: ${githubUsername} by ${currentUser.name} (New File or 24h+ passed)`);

        // ---------------------------------------------------------
        // [NEW] STEP: Upload to Cloudinary
        // ---------------------------------------------------------
        const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
            resource_type: "raw",
            folder: "resumes",
            public_id: `res_${currentUser.id}_${Date.now()}`
        });

        cloudinaryPublicId = uploadResponse.public_id;
        console.log("Uploaded to Cloudinary:", uploadResponse.secure_url);

        // 2. Local PDF se text nikalna
        const resumeText = await extractText(req.file.path);

        // 3. GitHub se data lana
        const githubData = await fetchGitHubData(githubUsername);

        // 4. AI se analysis karwana
        const analysis = await analyzeProfile(resumeText, githubData, jdText);

        // ---------------------------------------------------------
        // [UPDATED] STEP 5: Database mein Save ya Override karna
        // ---------------------------------------------------------
        const analysisData = {
            userId: req.user.id,
            githubUsername,
            fileHash: currentFileHash, // [NEW] Hash save karo taaki next time check ho sake
            jdText: jdText || "General Audit (No JD provided)",
            resumePath: uploadResponse.secure_url,
            trustScore: analysis.trustScore,
            atsScore: analysis.atsScore || 0,
            summary: analysis.analysisSummary,
            skillsMatched: analysis.skillsMatched,
            missingSkills: analysis.missingSkills || [],
            recommendations: analysis.recommendations || [],
            redFlags: analysis.redFlags,
            createdAt: Date.now()
        };

        await Analysis.findOneAndUpdate(
            { userId: req.user.id, githubUsername: githubUsername },
            { $set: analysisData },
            { upsert: true, new: true }
        );

        console.log(`Success: Analysis updated/overridden for ${githubUsername}`);

        // ---------------------------------------------------------
        // [NEW] STEP: Auto-Delete (Cleanup)
        // ---------------------------------------------------------
        if (req.file) {
            await fs.unlink(req.file.path).catch(() => { });
            console.log("Local Temporary File Deleted");
        }

        if (cloudinaryPublicId) {
            await cloudinary.uploader.destroy(cloudinaryPublicId, { resource_type: "raw" });
            console.log("Cloudinary File Deleted (Storage Optimized)");
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
        if (req.file) await fs.unlink(req.file.path).catch(() => { });
        if (cloudinaryPublicId) {
            await cloudinary.uploader.destroy(cloudinaryPublicId, { resource_type: "raw" }).catch(() => { });
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