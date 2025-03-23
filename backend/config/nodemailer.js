const nodemailer = require("nodemailer");
const crypto = require("crypto");  // For generating random OTPs

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail
    pass: process.env.EMAIL_PASS, // App password (not your Gmail password)
  },
});

const sendOTP = async (email) => {
  const otp = crypto.randomBytes(3).toString("hex"); // Generates a random OTP (6 characters)
  
  // Send OTP via email
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP for Email Verification",
      text: `Your OTP is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}: ${otp}`);
    
    // You can store the OTP temporarily in your database or in-memory store (e.g., Redis)
    // For simplicity, let's assume you store it temporarily in the user's session or DB
    return otp;  // Return OTP for comparison (can be stored in DB as well)
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Failed to send OTP. Please try again.");
  }
};

module.exports = { sendOTP };
