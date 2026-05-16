const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Analysis = require('../models/Analysis');
const nodemailer = require('nodemailer'); // [NEW]

// [NEW] Email transporter
const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    family: 4 
});

// [NEW] 6 digit OTP generate karo
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

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

// [NEW] @desc    Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const { name, linkedinProfile, currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id).select('+password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Name update
        if (name) user.name = name;

        // LinkedIn update (sirf recruiter ke liye)
        if (linkedinProfile && user.isRecruiter) {
            user.linkedinProfile = linkedinProfile;
        }

        // Password change
        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ success: false, message: 'Current password is incorrect' });
            }
            if (newPassword.length < 6) {
                return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isRecruiter: user.isRecruiter,
                isVerified: user.isVerified,
                githubHandle: user.githubHandle,
                linkedinProfile: user.linkedinProfile,
                designation: user.designation,
            }
        });
    } catch (error) {
        console.error("Update Profile Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// [NEW] @desc    Delete user account
exports.deleteAccount = async (req, res) => {
    try {
        const { password } = req.body;

        const user = await User.findById(req.user.id).select('+password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Password confirm karo before delete
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Incorrect password. Account not deleted.' });
        }

        await Analysis.deleteMany({ userId: req.user.id });
        console.log(`Analyses deleted for user: ${req.user.id}`);

        await User.findByIdAndDelete(req.user.id);
        console.log(`User deleted: ${req.user.id}`);

        res.status(200).json({
            success: true,
            message: 'Account and all associated data deleted successfully'
        });
    } catch (error) {
        console.error("Delete Account Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// [NEW] @desc    Forgot Password — OTP bhejo
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'No account found with this email' });
        }

        // OTP generate karo
        const otp = generateOTP();

        // OTP expiry — (OTP verify 30 sec)
        const otpExpiry = new Date(Date.now() + 30 * 1000);

        // OTP save karo DB mein
        await User.findByIdAndUpdate(user._id, {
            otp: otp,
            otpExpiry: otpExpiry
        });

        // Email bhejo
        const mailOptions = {
            from: `"ResumeTrust AI" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Your Password Reset OTP — ResumeTrust AI',
            html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin:0;padding:0;background-color:#0f0f0f;font-family:'Segoe UI',Arial,sans-serif;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0f0f;padding:40px 20px;">
                    <tr>
                        <td align="center">
                            <table width="520" cellpadding="0" cellspacing="0" style="background-color:#1a1a1a;border-radius:16px;border:1px solid #2e2e2e;overflow:hidden;">
                                
                                <!-- Header -->
                                <tr>
                                    <td style="padding:32px 40px 24px;border-bottom:1px solid #2e2e2e;">
                                        <h1 style="margin:0;font-size:22px;font-weight:800;color:#ffffff;">
                                            ResumeTrust <span style="color:#6366f1;">AI</span>
                                        </h1>
                                    </td>
                                </tr>

                                <!-- Body -->
                                <tr>
                                    <td style="padding:32px 40px;">
                                        <h2 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#ffffff;">
                                            Password Reset OTP
                                        </h2>
                                        <p style="margin:0 0 24px;font-size:14px;color:#a0a0a0;line-height:1.6;">
                                            Hi ${user.name}, we received a request to reset your password. Use the OTP below to continue.
                                        </p>

                                        <!-- OTP Box -->
                                        <div style="background:#0f0f0f;border:1px solid #6366f1;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
                                            <p style="margin:0 0 8px;font-size:12px;color:#a0a0a0;letter-spacing:0.1em;text-transform:uppercase;">Your OTP</p>
                                            <h1 style="margin:0;font-size:42px;font-weight:900;color:#6366f1;letter-spacing:12px;">${otp}</h1>
                                            <p style="margin:12px 0 0;font-size:12px;color:#606060;">Valid for 5 minutes only</p>
                                        </div>

                                        <p style="margin:0 0 8px;font-size:13px;color:#606060;line-height:1.6;">
                                            If you did not request this, please ignore this email. Your account is safe.
                                        </p>
                                    </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                    <td style="padding:20px 40px;border-top:1px solid #2e2e2e;">
                                        <p style="margin:0;font-size:12px;color:#404040;text-align:center;">
                                            © 2026 ResumeTrust AI · Built by Vinay Pandey
                                        </p>
                                    </td>
                                </tr>

                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ OTP sent to: ${email}`);

        res.status(200).json({
            success: true,
            message: 'OTP sent to your email successfully'
        });

    } catch (error) {
        console.error("Forgot Password Error:", error.message);
        res.status(500).json({ success: false, message: 'Failed to send OTP. Try again.' });
    }
};

// [NEW] @desc    Verify OTP
exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email }).select('+otp +otpExpiry');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // OTP exist karta hai?
        if (!user.otp || !user.otpExpiry) {
            return res.status(400).json({ success: false, message: 'OTP not found. Please request again.' });
        }

        // OTP expire ho gaya?
        if (new Date() > user.otpExpiry) {
            await User.findByIdAndUpdate(user._id, { otp: null, otpExpiry: null });
            return res.status(400).json({ success: false, message: 'OTP expired. Please request a new one.' });
        }

        // OTP match karta hai?
        if (user.otp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP. Please try again.' });
        }

        console.log(`✅ OTP verified for: ${email}`);

        res.status(200).json({
            success: true,
            message: 'OTP verified successfully'
        });

    } catch (error) {
        console.error("Verify OTP Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// [NEW] @desc    Reset Password
exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        const user = await User.findOne({ email }).select('+otp +otpExpiry');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // OTP dobara verify karo (security ke liye)
        if (!user.otp || !user.otpExpiry) {
            return res.status(400).json({ success: false, message: 'OTP not found. Please request again.' });
        }

        if (new Date() > user.otpExpiry) {
            await User.findByIdAndUpdate(user._id, { otp: null, otpExpiry: null });
            return res.status(400).json({ success: false, message: 'OTP expired. Please request a new one.' });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP.' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
        }

        // Naya password hash karo
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Password update karo + OTP clear karo
        await User.findByIdAndUpdate(user._id, {
            password: hashedPassword,
            otp: null,
            otpExpiry: null
        });

        console.log(`✅ Password reset successful for: ${email}`);

        res.status(200).json({
            success: true,
            message: 'Password reset successfully. Please login with your new password.'
        });

    } catch (error) {
        console.error("Reset Password Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};