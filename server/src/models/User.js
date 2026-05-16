const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false // Security ke liye default fetch mein password nahi aayega
    },
    // Employee ke liye compulsory hoga (Registration logic mein handle karenge)
    githubHandle: {
        type: String,
        default: '',
        trim: true
    },
    // Recruiter ke liye compulsory link
    linkedinProfile: {
        type: String,
        default: '',
        trim: true
    },
    isRecruiter: {
        type: Boolean,
        default: false // Default mein Candidate, tick karne par Recruiter
    },
    trustScore: {
        type: Number,
        default: 0
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);