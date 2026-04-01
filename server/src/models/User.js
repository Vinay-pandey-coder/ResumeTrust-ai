// User Database Schema (Mongoose)
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
        select: false // Jab hum user fetch karein, toh password default mein na dikhe (Security)
    },
    githubHandle: {
        type: String,
        default: '' // User apna github handle baad mein bhi de sakta hai
    },
    trustScore: {
        type: Number,
        default: 0 // Shuruat mein score zero rahega
    },
    isRecruiter: {
        type: Boolean,
        default: false // Default mein sab "Candidate" honge
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);