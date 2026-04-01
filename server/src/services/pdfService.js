const fs = require('fs');
const pdf = require('pdf-parse-fork');

/**
 * @desc    PDF se text nikalne ka logic
 */
exports.extractText = async (filePath) => {
    try {
        // 1. File exist karti hai ya nahi?
        if (!fs.existsSync(filePath)) {
            throw new Error('File not found at: ' + filePath);
        }

        // 2. Binary data read karna
        const dataBuffer = fs.readFileSync(filePath);

        // 3. Parsing [LOGIC]
        // pdf-parse-fork ek function ki tarah call hota hai
        const data = await pdf(dataBuffer);

        if (!data || !data.text) {
            throw new Error('PDF content is empty');
        }

        console.log("Text successfully extracted! ✅");
        return data.text.trim();

    } catch (error) {
        console.error("PDF Parsing Error:", error.message);
        throw new Error(`Parsing Failed: ${error.message}`);
    }
};