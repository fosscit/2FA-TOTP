// Quick test script to send OTP
// Usage: node test-otp.js your-email@example.com

require("dotenv").config();
const nodemailer = require("nodemailer");

const recipientEmail = process.argv[2];

if (!recipientEmail) {
    console.error("❌ Please provide recipient email as argument");
    console.log("Usage: node test-otp.js shaneisrael2006@gmail.com");
    process.exit(1);
}

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false
    }
});

async function testEmail() {
    console.log("\n🔍 Testing email configuration...");
    console.log(`Host: ${process.env.EMAIL_HOST}`);
    console.log(`Port: ${process.env.EMAIL_PORT}`);
    console.log(`User: ${process.env.EMAIL_USER}`);
    console.log(`Pass: ${process.env.EMAIL_PASS ? '***' + process.env.EMAIL_PASS.slice(-4) : 'NOT SET'}\n`);

    try {
        // Test connection
        console.log("⏳ Verifying SMTP connection...");
        await transporter.verify();
        console.log("✅ SMTP connection successful!\n");

        // Send test OTP
        const testOTP = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`⏳ Sending OTP ${testOTP} to ${recipientEmail}...`);

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: recipientEmail,
            subject: "Test OTP Code",
            text: `Your test OTP code is ${testOTP}. This is a test email.`,
            html: `<p>Your test OTP code is <strong>${testOTP}</strong>. This is a test email.</p>`,
        });

        console.log("✅ Email sent successfully!");
        console.log(`Message ID: ${info.messageId}`);
        console.log(`\n🎉 Check ${recipientEmail} for the OTP!\n`);

    } catch (error) {
        console.error("\n❌ Error:", error.message);
        console.error("\n💡 Common fixes:");
        console.error("   1. For Gmail: Use App Password (not regular password)");
        console.error("   2. Enable 2FA on your Google account first");
        console.error("   3. Generate App Password at: https://myaccount.google.com/apppasswords");
        console.error("   4. Update .env file with correct credentials\n");
        process.exit(1);
    }
}

testEmail();