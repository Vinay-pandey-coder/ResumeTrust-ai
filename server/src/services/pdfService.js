const fs = require('fs');
const pdf = require('pdf-parse-fork');

exports.extractText = async (filePath) => {
    try {
        if (!fs.existsSync(filePath)) {
            throw new Error('File not found at: ' + filePath);
        }

        const dataBuffer = fs.readFileSync(filePath);
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