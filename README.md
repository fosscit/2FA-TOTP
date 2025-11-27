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

### Quick Setup 

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
