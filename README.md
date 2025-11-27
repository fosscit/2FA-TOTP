# 2FA-TOTP

# OTP Login System

A secure email-based OTP (One-Time Password) authentication system built with Node.js, Express, and React.

## Overview

This project implements a passwordless authentication system where users receive a one-time password via email to log in. The system generates a 6-digit OTP, sends it to the user's email, and verifies it to issue a JWT token for authenticated sessions.

## Features

- Email-based OTP authentication
- 6-digit OTP generation
- OTP expiration (5 minutes)
- JWT token-based session management
- Support for multiple email service providers
- Email configuration testing endpoint
- In-memory OTP storage

## Tech Stack

**Backend:**
- Node.js
- Express.js
- Nodemailer (email sending)
- JSON Web Tokens (JWT)
- dotenv (environment configuration)

**Frontend:**
- React
- Axios (API calls)

## Installation

1. Clone the repository and install dependencies:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

2. Configure email service (see Email Configuration section below)

## Email Configuration

### Quick Setup (Testing)

For development and testing, use Ethereal (auto-configured test email):

```bash
cd backend
node setup-ethereal.js
```

### Production Setup

Update `backend/.env` with your email service credentials:

```env
EMAIL_SERVICE=brevo
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-smtp-key
JWT_SECRET=your-secret-key
PORT=5000
```

Supported services: Brevo, SendGrid, Mailgun, Gmail, Outlook, or any SMTP server.

See `EASY_EMAIL_SETUP.md` for detailed configuration guides.

## Running the Application

Start the backend server:
```bash
cd backend
npm start
```

Start the frontend (in a new terminal):
```bash
cd frontend
npm start
```

The backend runs on `http://localhost:5000` and frontend on `http://localhost:3000`.

## API Documentation

### 1. Test Email Configuration
```
GET /test-email
```
Verifies email service configuration.

**Response:**
```json
{
  "message": "Email configuration is valid ✅",
  "host": "smtp.ethereal.email",
  "port": "587",
  "user": "user@ethereal.email"
}
```

### 2. Send OTP
```
POST /auth/send-otp
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "OTP sent successfully",
  "previewUrl": "https://ethereal.email/message/..." // Only for Ethereal
}
```

### 3. Verify OTP
```
POST /auth/verify-otp
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "message": "OTP verified, login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Testing

Test email configuration:
```bash
cd backend
node test-otp.js recipient@example.com
```

Interactive demo:
```bash
node demo.js
```

## Project Structure

```
otp-login-project/
├── backend/
│   ├── server.js              # Main Express server
│   ├── setup-ethereal.js      # Auto-setup test email
│   ├── test-otp.js            # Email testing script
│   ├── demo.js                # Interactive demo
│   ├── .env                   # Environment configuration
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.js             # Main React component
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   └── package.json
├── EASY_EMAIL_SETUP.md        # Email service setup guides
└── README.md
```

## Security Considerations

- OTPs expire after 5 minutes
- JWT tokens expire after 1 hour
- OTPs are stored in-memory (consider Redis for production)
- Use HTTPS in production
- Implement rate limiting for OTP requests
- Use strong JWT secrets

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| EMAIL_SERVICE | Email service identifier | `ethereal`, `brevo` |
| EMAIL_HOST | SMTP server host | `smtp.ethereal.email` |
| EMAIL_PORT | SMTP server port | `587` |
| EMAIL_USER | SMTP username | `user@example.com` |
| EMAIL_PASS | SMTP password/API key | `your-password` |
| JWT_SECRET | Secret for JWT signing | `your-secret-key` |
| PORT | Backend server port | `5000` |

## License

MIT
