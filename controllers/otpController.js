import nodemailer from "nodemailer";
import db from '../config/db.js'

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}


export const sendOtp = async (req, res) => {

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  try {
  
    const [user] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Email not found",
      });
    }

    
    const otp = generateOTP();

    
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    
    await db.execute(
      "INSERT INTO otp_verifications (email, otp, expires_at) VALUES (?, ?, ?)",
      [email, otp, expiresAt]
    );

    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"POS System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}. It expires in 5 minutes.`,
    });

    
    return res.json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Email and OTP are required",
    });
  }

  try {
    const [rows] = await db.execute(
      "SELECT * FROM otp_verifications WHERE email = ? AND otp = ? AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1",
      [email, otp]
    );

    if (rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    await db.execute(
      "DELETE FROM otp_verifications WHERE email = ?",
      [email]
    );

    return res.json({
      success: true,
      message: "OTP verified successfully",
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const invalidateOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false });

  try {
    await db.execute("DELETE FROM otp_verifications WHERE email = ?", [email]);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false });
  }
};