// JWT Verification Middleware
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // 1. Check karo kya Header mein 'Authorization' aur 'Bearer' hai?
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Token format: "Bearer eyJhbGciOiJIUzI1..."
            // Hum 'Bearer' ko hatakar sirf token nikalenge
            token = req.headers.authorization.split(' ')[1];

            // 2. Token ko Decode/Verify karna [MATH & SECURITY LOGIC]
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. User ko request object mein attach karna (Password chhod kar)
            req.user = await User.findById(decoded.id).select('-password');

            next(); // Agle function (Controller) par jao
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };