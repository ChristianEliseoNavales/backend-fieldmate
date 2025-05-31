// utils/mailer.js
const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // HTML template
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px; border: 1px solid #ddd;">
      <h2 style="color: #2D0F7F;">Forgot Password Verification</h2>
      <p style="font-size: 16px; color: #333;">Hello,</p>
      <p style="font-size: 16px; color: #333;">You requested to reset your password. Use the verification code below to proceed:</p>
      <div style="margin: 30px 0; text-align: center;">
        <span style="display: inline-block; font-size: 36px; color: #2D0F7F; font-weight: bold; letter-spacing: 5px;">${otp}</span>
      </div>
      <p style="font-size: 14px; color: #666;">This code will expire in 5 minutes or after 3 incorrect attempts.</p>
      <p style="font-size: 14px; color: #999;">If you didn’t request this, you can safely ignore this email.</p>
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;" />
      <p style="font-size: 12px; color: #aaa;">© ${new Date().getFullYear()} Fieldmate. All rights reserved.</p>
    </div>
  `;

  await transporter.sendMail({
    from: '"Fieldmate Support" <no-reply@fieldmate.com>',
    to,
    subject,
    html,
  });
};

module.exports = { sendEmail };
