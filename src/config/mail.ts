import nodemailer from 'nodemailer';

export const createTransporter = async () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // Add these settings to improve reliability
    tls: {
      rejectUnauthorized: false, // Allows self-signed certificates (if testing)
    },
  });
};
