// Auto-setup Ethereal email for testing
// Run: node setup-ethereal.js

const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

async function setupEthereal() {
    console.log("🔧 Setting up Ethereal test email account...\n");

    try {
        // Create a test account
        const testAccount = await nodemailer.createTestAccount();

        console.log("✅ Ethereal account created successfully!\n");
        console.log("📧 Email Credentials:");
        console.log(`   User: ${testAccount.user}`);
        console.log(`   Pass: ${testAccount.pass}`);
        console.log(`   SMTP: smtp.ethereal.email:587\n`);

        // Update .env file
        const envPath = path.join(__dirname, ".env");
        const envContent = `EMAIL_SERVICE=ethereal
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=${testAccount.user}
EMAIL_PASS=${testAccount.pass}
JWT_SECRET=my_super_secret_jwt_key
PORT=5000
`;

        fs.writeFileSync(envPath, envContent);
        console.log("✅ .env file updated!\n");

        console.log("🎉 Setup complete! You can now:");
        console.log("   1. Run: npm start");
        console.log("   2. Send OTP to any email");
        console.log("   3. View emails at: https://ethereal.email/messages\n");

        console.log("📝 Note: Ethereal is for TESTING only.");
        console.log("   Emails are not actually delivered, but you can view them online.\n");

    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
}

setupEthereal();