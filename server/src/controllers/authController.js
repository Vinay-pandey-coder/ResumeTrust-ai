const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register a new user
exports.register = async (req, res) => {
    try {
        const { name, email, password, isRecruiter, githubHandle, linkedinProfile } = req.body;

        if (isRecruiter) {
            if (!linkedinProfile) {
                return res.status(400).json({ success: false, message: "Recruiters must provide a LinkedIn Profile link." });
            }
        } else {
            if (!githubHandle) {
                return res.status(400).json({ success: false, message: "Candidates must provide their GitHub Handle." });
            }
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            isRecruiter,
            githubHandle: !isRecruiter ? githubHandle : '',
            linkedinProfile: isRecruiter ? linkedinProfile : '',
            isVerified: false
        });

        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
            res.status(201).json({
                success: true,
                token,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isRecruiter: user.isRecruiter,
                    isVerified: user.isVerified,
                    githubHandle: user.githubHandle
                }
            });
        }
    } catch (error) {
        console.error("Register Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Authenticate user & get token
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isRecruiter: user.isRecruiter,
                isVerified: user.isVerified,
                githubHandle: user.githubHandle
            }
        });
    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get current logged in user
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({ success: true, user: user });
    } catch (error) {
        console.error("GetMe Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};