// Quick demo of OTP functionality
// Run: node demo.js

const axios = require('axios');

const API_URL = 'http://localhost:5000';
const TEST_EMAIL = 'demo@example.com';

async function demo() {
    console.log('🚀 OTP Login Demo\n');

    try {
        // Step 1: Send OTP
        console.log(`📧 Step 1: Sending OTP to ${TEST_EMAIL}...`);
        const sendResponse = await axios.post(`${API_URL}/auth/send-otp`, {
            email: TEST_EMAIL
        });

        console.log('✅', sendResponse.data.message);
        if (sendResponse.data.previewUrl) {
            console.log('🔗 View email:', sendResponse.data.previewUrl);
        }
        console.log('\n💡 Check the backend console for the OTP code\n');

        // Prompt for OTP
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        readline.question('Enter the OTP from console: ', async (otp) => {
            readline.close();

            // Step 2: Verify OTP
            console.log(`\n🔐 Step 2: Verifying OTP...`);
            try {
                const verifyResponse = await axios.post(`${API_URL}/auth/verify-otp`, {
                    email: TEST_EMAIL,
                    otp: otp.trim()
                });

                console.log('✅', verifyResponse.data.message);
                console.log('🎟️  JWT Token:', verifyResponse.data.token.substring(0, 50) + '...');
                console.log('\n🎉 Login successful! You can now use this token for authenticated requests.\n');

            } catch (error) {
                console.error('❌ Verification failed:', error.response ? .data ? .message || error.message);
            }
        });

    } catch (error) {
        console.error('❌ Error:', error.response ? .data ? .message || error.message);
        console.log('\n💡 Make sure the backend server is running: npm start\n');
    }
}

demo();