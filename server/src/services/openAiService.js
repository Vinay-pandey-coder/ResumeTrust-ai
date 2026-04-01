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

        // [WORKING MODEL]: gemini-2.5-flash
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        // [LOGIC]: Agar user JD nahi deta, toh AI ko default context dena taaki ATS score 0 ya random na aaye
        const finalJD = jdText.trim() || "Full Stack Web Developer (General MERN Stack Role)";

        const prompt = `
        You are an Advanced Technical Auditor and ATS (Applicant Tracking System) Expert.
        
        CONTEXT:
        Evaluate the candidate's resume against the Target Job Description. 
        If the JD is general, use industry standards for a MERN Stack Developer.

        CANDIDATE RESUME CONTENT: 
        ${resumeText.substring(0, 4000)}

        GITHUB STATS (Live Evidence): 
        - Public Repos: ${githubData.profile.public_repos}
        - Top Languages: ${githubData.stats.topLanguages.join(", ")}
        - Total Stars: ${githubData.stats.totalStars}

        TARGET JOB DESCRIPTION (JD): 
        ${finalJD}

        TASK:
        1. "trustScore" (0-100): Compare resume claims with GitHub activity. High score only if GitHub repos match the mentioned tech stack.
        2. "atsScore" (0-100): Strict match of resume keywords/experience against the JD provided.
        3. "analysisSummary": Short professional overview of the candidate's strengths and weaknesses.
        4. "skillsMatched": List specific technical skills found in both Resume and JD.
        5. "missingSkills": Crucial skills required in the JD but NOT found in the Resume.
        6. "recommendations": Practical steps to improve the resume or technical profile.
        7. "redFlags": Inconsistencies like future dates, suspicious gaps, or skill-experience mismatch.

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

        console.log("Sending Analysis Request to Gemini (v2.5-flash)... 🧠🚀");

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