const axios = require('axios');
require('dotenv').config();

exports.analyzeProfile = async (resumeText, githubData, jdText = "") => {
    // 1. Logs for debugging
    console.log("Resume Text Length:", resumeText ? resumeText.length : "UNDEFINED");
    console.log("GitHub Data:", githubData ? "Received" : "MISSING");

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error("GEMINI_API_KEY missing in .env");

        // Fix: Teri API list ke hisab se exact model name aur version
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        // 3. Safety Fallbacks (Taki code crash na ho agar data undefined ho)
        const safeResume = resumeText ? resumeText.substring(0, 4000) : "No text extracted from resume.";
        const safeGithub = githubData ? JSON.stringify(githubData) : "No GitHub activity found.";
        const finalJD = (jdText && jdText.trim()) || "Full Stack Web Developer (General MERN Stack Role)";

        const currentDate = new Date().toISOString().split('T')[0];

        const prompt = `
        You are an Advanced Technical Auditor and ATS Expert.
        Today's date is: ${currentDate}

        Evaluate the candidate's resume against the Target JD.

        RESUME: ${safeResume}
        GITHUB: ${safeGithub}
        JD: ${finalJD}

        IMPORTANT RULES FOR RED FLAGS:
        1. Do NOT flag a date as future if it is within the last 12 months from today's date (${currentDate}). 
           Example: If today is April 2026, then March 2026 is a VALID recent join date — do NOT flag it.
        2. Only flag a date if it is MORE than 30 days in the future from today.
        3. Only flag GitHub stats as suspicious if repos are 0 or stars are extremely low AND repo count is also very low.
        4. Only flag skill mismatches if the skill is completely absent from both resume AND github languages.
        5. Red flags should be GENUINE issues only — not assumptions.
        6. If something looks valid and explainable, do NOT add it as a red flag.

        SCORING RULES:
        - trustScore: Base it on GitHub activity + resume consistency.
          Do NOT reduce score for valid recent join dates.
        - atsScore: Match resume keywords vs JD keywords only.

        RETURN ONLY VALID JSON:
        {
          "trustScore": number,
          "atsScore": number,
          "analysisSummary": "string",
          "skillsMatched": ["string"],
          "missingSkills": ["string"],
          "recommendations": ["string"],
          "redFlags": ["string"]
        }`;

        // 4. API Call
        const response = await axios.post(url, {
            contents: [{ parts: [{ text: prompt }] }]
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        // Check if response structure is valid
        if (!response.data.candidates || !response.data.candidates[0]) {
            throw new Error("Gemini AI returned empty response");
        }

        const aiText = response.data.candidates[0].content.parts[0].text;

        // 5. JSON Extraction
        const jsonMatch = aiText.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            console.log("Raw AI Text:", aiText); // Debugging for malformed responses
            throw new Error("AI returned invalid JSON format");
        }

        return JSON.parse(jsonMatch[0]);

    } catch (error) {
        // Detailed error logging
        const status = error.response ? error.response.status : 'No Response';
        const errorDetail = error.response ? JSON.stringify(error.response.data) : error.message;

        console.error(`AI Service Error [${status}]:`, errorDetail);
        throw new Error(`AI Analysis failed: ${status} - ${errorDetail}`);
    }
};