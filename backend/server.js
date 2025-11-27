require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

// In-memory store: { email: { otp, expiresAt } }
const otpStore = {};

// Email transporter configuration
// Supports multiple services: Gmail, Ethereal (testing), Brevo (Sendinblue), Mailgun, etc.
let transporter;

if (process.env.EMAIL_SERVICE === 'ethereal') {
    // Ethereal - Free testing email service (no real emails sent, but you can view them online)
    transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
} else if (process.env.EMAIL_SERVICE === 'brevo') {
    // Brevo (formerly Sendinblue) - Free tier: 300 emails/day
    transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
} else {
    // Generic SMTP configuration (Gmail, Outlook, custom SMTP, etc.)
    transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT),
        secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false
        }
    });
}

// Helper: generate 6-digit OTP
function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Route: test
app.get("/", (req, res) => {
    res.send("Backend is working ✅");
});

// Route: test email configuration
app.get("/test-email", async (req, res) => {
    try {
        await transporter.verify();
        res.json({
            message: "Email configuration is valid ✅",
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            user: process.env.EMAIL_USER
        });
    } catch (error) {
        res.status(500).json({
            message: "Email configuration error ❌",
            error: error.message
        });
    }
});

// 1️⃣ Send OTP
app.post("/auth/send-otp", async (req, res) => {
    const {
        email
    } = req.body;

    if (!email) {
        return res.status(400).json({
            message: "Email is required"
        });
    }

    const otp = generateOtp();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    otpStore[email] = {
        otp,
        expiresAt
    };
    console.log(`OTP for ${email} is ${otp} (valid 5 minutes)`);

    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
            html: `<p>Your OTP code is <strong>${otp}</strong>. It is valid for 5 minutes.</p>`,
        });

        // For Ethereal, provide preview URL
        if (process.env.EMAIL_SERVICE === 'ethereal') {
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        }

        res.json({
            message: "OTP sent successfully",
            previewUrl: process.env.EMAIL_SERVICE === 'ethereal' ? nodemailer.getTestMessageUrl(info) : undefined
        });
    } catch (err) {
        console.error("Error sending email:", err);
        res.status(500).json({
            message: "Failed to send OTP",
            error: err.message,
            details: "Please check your email configuration in .env file"
        });
    }
});

// 2️⃣ Verify OTP
app.post("/auth/verify-otp", (req, res) => {
    const {
        email,
        otp
    } = req.body;

    if (!email || !otp) {
        return res
            .status(400)
            .json({
                message: "Email and OTP are both required"
            });
    }

    const record = otpStore[email];

    if (!record) {
        return res.status(400).json({
            message: "No OTP found for this email"
        });
    }

    if (Date.now() > record.expiresAt) {
        delete otpStore[email];
        return res.status(400).json({
            message: "OTP expired, please request again"
        });
    }

    if (record.otp !== otp) {
        return res.status(400).json({
            message: "Invalid OTP"
        });
    }

    // OTP correct → delete from store
    delete otpStore[email];

    // Create JWT token
    const token = jwt.sign({
        email
    }, JWT_SECRET, {
        expiresIn: "1h"
    });

    return res.json({
        message: "OTP verified, login successful",
        token,
    });
});

app.listen(PORT, () => {
    console.log(`✅ Backend server running on http://localhost:${PORT}`);
});