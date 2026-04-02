const axios = require('axios');
require('dotenv').config();

exports.analyzeProfile = async (resumeText, githubData, jdText = "") => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        const finalJD = jdText.trim() || "Full Stack Web Developer (General MERN Stack Role)";
        const currentDate = new Date().toISOString().split('T')[0];

        const prompt = `
        You are an Advanced Technical Auditor and ATS Expert.
        Today's date is: ${currentDate}

        Evaluate the candidate's resume against the Target JD.

        RESUME: ${resumeText.substring(0, 4000)}
        GITHUB: ${JSON.stringify(githubData)}
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

        const response = await axios.post(url, { contents: [{ parts: [{ text: prompt }] }] });
        const aiText = response.data.candidates[0].content.parts[0].text;
        const jsonMatch = aiText.match(/\{[\s\S]*\}/);
        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error("AI Service Error:", error.message);
        throw new Error("AI Analysis failed: " + error.message);
    }
};