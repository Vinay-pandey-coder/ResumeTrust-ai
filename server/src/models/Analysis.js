const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema({
    // Kis user ne analyze kiya (Relationship with User model)
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    githubUsername: {
        type: String,
        required: true
    },
    fileHash: { type: String },
    // Job Description jo user ne input di thi
    jdText: {
        type: String,
        default: "General Audit (No JD provided)"
    },
    resumePath: {
        type: String,
        default: 'deleted_after_analysis'
    },
    // --- AI se mila hua data ---
    trustScore: {
        type: Number,
        required: true
    },
    // Resume vs JD match percentage
    atsScore: {
        type: Number,
        default: 0
    },
    summary: {
        type: String
    },
    skillsMatched: {
        type: [String] // Array of strings (Common in Resume & JD)
    },
    // Skills jo JD mein hain par Resume mein nahi
    missingSkills: {
        type: [String]
    },
    // AI suggestions for improvement
    recommendations: {
        type: [String]
    },
    redFlags: {
        type: [String] // Array of strings
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// ---------------------------------------------------------
// [PERFORMANCE]: Indexing lagayi hai taaki history fetch fast ho
// 1 = Ascending, -1 = Descending (Newest reports first)
// ---------------------------------------------------------
AnalysisSchema.index({ userId: 1, createdAt: -1 });

// [IMPORTANT]: Model name 'Analysis' export ho raha hai
module.exports = mongoose.model('Analysis', AnalysisSchema);