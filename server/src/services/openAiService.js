const axios = require('axios');
require('dotenv').config();

const API_KEYS = [
    process.env.GEMINI_API_KEY_1,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
].filter(Boolean);

let currentKeyIndex = 0;

const getNextKey = () => {
    const key = API_KEYS[currentKeyIndex];
    console.log(`🔑 Using API Key: ${currentKeyIndex + 1} of ${API_KEYS.length}`);
    currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
    return key;
};

const callGeminiAPI = async (apiKey, prompt) => {
    // const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite-preview-02-05:generateContent?key=${apiKey}`;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const response = await axios.post(url, {
        contents: [{ parts: [{ text: prompt }] }]
    }, {
        headers: { 'Content-Type': 'application/json' }
    });

    if (!response.data.candidates || !response.data.candidates[0]) {
        throw new Error("Gemini AI returned empty response");
    }

    const aiText = response.data.candidates[0].content.parts[0].text;
    const jsonMatch = aiText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
        console.log("Raw AI Text:", aiText);
        throw new Error("AI returned invalid JSON format");
    }

    return JSON.parse(jsonMatch[0]);
};

exports.analyzeProfile = async (resumeText, githubData, jdText = "") => {
    console.log("Resume Text Length:", resumeText ? resumeText.length : "UNDEFINED");
    console.log("GitHub Data:", githubData ? "Received" : "MISSING");

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

    // Saari keys try karo ek ek karke
    let lastError = null;
    const totalKeys = API_KEYS.length;

    for (let attempt = 0; attempt < totalKeys; attempt++) {
        const apiKey = getNextKey();

        try {
            console.log(`🚀 Analysis attempt ${attempt + 1} of ${totalKeys}...`);
            const result = await callGeminiAPI(apiKey, prompt);
            console.log(`✅ Analysis successful with Key ${currentKeyIndex === 0 ? totalKeys : currentKeyIndex} of ${totalKeys}`);
            return result;

        } catch (error) {
            const status = error.response?.status;
            const errorDetail = error.response
                ? JSON.stringify(error.response.data)
                : error.message;

            if (status === 429) {
                console.warn(`⚠️  Key ${attempt + 1} ki limit khatam ho gayi (429)! Next key try kar raha hoon...`);
                lastError = error;
                continue; // next key try karo
            }

            if (status === 503 || (error.message && error.message.includes('massive traffic'))) {
                console.warn(`⚠️  Key ${attempt + 1} pe server overloaded (503)! Next key try kar raha hoon...`);
                lastError = error;
                continue; // next key try karo
            }

            // Koi aur error hai — seedha throw karo
            console.error(`❌ AI Service Error [${status}]:`, errorDetail);
            throw new Error(`AI Analysis failed: ${status} - ${errorDetail}`);
        }
    }

    // Saari keys fail ho gayi
    console.error("❌ Saari API keys fail ho gayi hain! Kal reset hoga.");
    throw new Error("All API keys exhausted. Please try again tomorrow.");
};