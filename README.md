🛡️ ResumeTrust-AI Backend
ResumeTrust-AI is an advanced MERN Stack backend designed to verify candidate authenticity. It analyzes resumes and cross-references them with real-time GitHub activity to generate a Trust Score, helping recruiters filter out inflated resumes and identify genuine talent.

🚀 Key Technical Highlights
This project implements industry-standard practices and cutting-edge technologies:

🤖 AI-Powered Analysis: Leverages Google Gemini (v2.5-flash) to perform a 3-way match between the Resume, GitHub Profile, and Job Description (JD).

📊 ATS Engine: Advanced logic to calculate the matching percentage (ATS Score) between the candidate's resume and specific job requirements.

🔍 Trust Verification: Validates resume claims by auditing live GitHub statistics (Stars, Repositories, and Language proficiency).

🛡️ Enterprise-Grade Security:

Helmet.js: Sets secure HTTP headers to prevent common vulnerabilities.

Express Rate Limit: Protects the API from Brute-force attacks and spamming.

JWT (JSON Web Tokens): Implements secure, stateless authentication for private routes.

Bcrypt.js: Industry-standard salt-based password hashing.

📁 Smart File Management: Uses Multer for secure PDF uploads. Extracted text is processed, and temporary files are automatically deleted (Auto-Cleanup) to optimize server storage.

📈 Performance & Monitoring:

Winston Logger: Centralized error tracking by recording server-side issues in logs/error.log.

MongoDB Indexing: Optimized database queries for lightning-fast history retrieval.

Gzip Compression: Compresses API responses to reduce latency and improve performance.

🛠️ Tech Stack
Runtime: Node.js

Framework: Express.js (v5.x)

Database: MongoDB (Mongoose ORM)

AI Engine: Google Gemini AI

Logging: Winston & Morgan

Security: Helmet, CORS, Rate-Limit

⚙️ Installation & Setup
Clone the Repository:

Bash
git clone https://github.com/YOUR_USERNAME/ResumeTrust-AI.git
cd server
Install Dependencies:

Bash
npm install
Environment Variables (.env) Setup:
Create a .env file in the root directory and add the following:

Code snippet
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
Run the Server:

Bash
# For development (with Nodemon)
npm run dev

# For production
npm start
📡 API Endpoints (Quick View)
POST /api/auth/register - Create a new user account.

POST /api/auth/login - Authenticate user and receive a JWT Token.

POST /api/resume/analyze - Upload resume, scan GitHub, and get AI Analysis (Protected).

GET /api/resume/history - Retrieve previous analysis reports (Protected).