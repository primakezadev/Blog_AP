import { createTransporter } from '../config/mail';


export async function sendVerificationEmail(email: string, link: string) {
  const transporter = await createTransporter();
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify Your Email',
    html: `
      <h2>Welcome!</h2>
      <p>Click below to verify your email:</p>
      <a href="${link}">${link}</a>
      <p>This link expires in 24 hours.</p>
    `,
  });
}

export const sendResetPasswordEmail = async (email: string, resetLink: string) => {
  const transporter = await createTransporter();

  const mailOptions = {
    from: `"Blog Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Reset Your Password',
    text: `Reset your password using the link below:\n${resetLink}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <p>
          <a href="${resetLink}" style="color: #1a73e8;">${resetLink}</a>
        </p>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <p style="font-size: 12px; color: #555;">This link will expire in 15 minutes.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
