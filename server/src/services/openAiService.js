const axios = require('axios');
require('dotenv').config();

/**
 * @desc    Analyze Resume, GitHub data, and Match with JD using Gemini AI
 * @param   {String} resumeText - Extracted text from PDF
 * @param   {Object} githubData - Stats from GitHub API
 * @param   {String} jdText - Optional Job Description for ATS matching
 */
exports.analyzeProfile = async (resumeText, githubData, jdText = "") => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        
        // [WORKING MODEL]: gemini-2.5-flash jo tumhare pass sahi chal raha hai
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        const prompt = `
        You are an Advanced Technical Auditor and ATS (Applicant Tracking System) Expert.
        
        CANDIDATE RESUME CONTENT: 
        ${resumeText.substring(0, 4000)}

        GITHUB STATS: 
        - Public Repos: ${githubData.profile.public_repos}
        - Top Languages: ${githubData.stats.topLanguages.join(", ")}
        - Total Stars: ${githubData.stats.totalStars}

        TARGET JOB DESCRIPTION (JD): 
        ${jdText || "N/A - General Profile Audit"}

        TASK:
        1. "trustScore" (0-100): Match resume claims with GitHub activity.
        2. "atsScore" (0-100): Match resume content with provided Job Description.
        3. "analysisSummary": Short professional overview of the candidate.
        4. "skillsMatched": List skills found in both Resume and JD (or GitHub).
        5. "missingSkills": Skills required in JD but NOT found in Resume.
        6. "recommendations": Suggestions to improve the resume or profile.
        7. "redFlags": Any inconsistencies (e.g., future dates, skill mismatches).

        RETURN ONLY A VALID JSON OBJECT:
        {
            "trustScore": number,
            "atsScore": number,
            "analysisSummary": "string",
            "skillsMatched": ["string"],
            "missingSkills": ["string"],
            "recommendations": ["string"],
            "redFlags": ["string"]
        }`;

        console.log("Sending Analysis Request to Gemini (v2.5-flash)... 🚀");

        const response = await axios.post(url, {
            contents: [{
                parts: [{ text: prompt }]
            }]
        });

        // Response extraction from Gemini structure
        if (!response.data.candidates || !response.data.candidates[0].content) {
            throw new Error("Empty response from Gemini API");
        }

        const aiText = response.data.candidates[0].content.parts[0].text;
        
        // JSON Clean-up (Markdown backticks hatane ke liye aur sirf JSON pakadne ke liye)
        const jsonMatch = aiText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("AI failed to return valid JSON format");

        return JSON.parse(jsonMatch[0]);

    } catch (error) {
        console.error("Gemini Service Error:", error.response?.data || error.message);
        throw new Error("AI Analysis failed: " + (error.response?.data?.error?.message || error.message));
    }
};