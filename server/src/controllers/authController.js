const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register a new user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
    try {
        const { name, email, password, isRecruiter } = req.body;

        // 1. Check karo kya user pehle se exist karta hai?
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 2. Password ko Hash (Encrypt) karna [MATH LOGIC]
        // Hum 'Salt' use karte hain (random string) taaki hashing aur strong ho jaye
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Naya User create karna
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            isRecruiter
        });

        if (user) {
            // 4. Token generate karna (JWT)
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: '30d',
            });

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: token
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Authenticate user & get token
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check karo kya user exists karta hai?
        // Humne model mein password ko 'select: false' rakha tha, 
        // isliye humein yahan manually '.select('+password')' bolna padega comparison ke liye.
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // 2. Password Match karna [MATH LOGIC]
        // bcrypt.compare() internally dono hashes ko match karta hai
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // 3. Agar sab sahi hai, toh naya Token do
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: token
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// @desc    Get current logged in user
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
    try {
        // req.user.id humein 'protect' middleware se milta hai
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};