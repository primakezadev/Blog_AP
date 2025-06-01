import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // ✅ You can also use 'SendGrid' or custom SMTP
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"My App" <${process.env.EMAIL_USER}>`, // ✅ Looks more professional
      to,
      subject,
      text,
    });

    console.log(`📧 Email sent to ${to}`);
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw new Error('Failed to send email');
  }
};
