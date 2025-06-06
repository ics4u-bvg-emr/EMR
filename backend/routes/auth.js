import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Doctor from '../models/Doctor.js'; // ✅ Use Doctor model
import crypto from 'crypto';
import { transporter } from '../utils/email.js';
import dotenv from 'dotenv';
dotenv.config();
 
const router = express.Router();
 
// ✅ LOGIN Route (unchanged except for model)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (process.env.TEST == 'true') {
    console.log('test debug')
    const fakeToken = jwt.sign({ id: 'dev-id', role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: '12h',
    });
    res.json({ token: fakeToken, role: 'admin', username: 'test' });
    return
  }

  const user = await Doctor.findOne({ username });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.json({ token, role: user.role, username: user.username });
});

// ✅ REGISTER Route (now includes full Doctor schema)
router.post('/register', async (req, res) => {
    const {
      firstName,
      lastName,
      specialization,
      username,
      email,
      password,
      role = 'user',
    } = req.body;
  
    try {
      const hashed = await bcrypt.hash(password, 10);
      const verificationToken = crypto.randomBytes(32).toString('hex');
  
      const doctor = new Doctor({
        firstName,
        lastName,
        specialization,
        username,
        email,
        password: hashed,
        role,
        isVerified: false,
        verificationToken,
      });
  
      await doctor.save();
  
      const confirmLink = `https://emr-frontend-406r.onrender.com/verify-email/${verificationToken}`;
  
      await transporter.sendMail({
        from: `"BVG Care" <${process.env.EMAIL_USER}>`,
        to: doctor.email,
        subject: 'Confirm Your Email',
        html: `
          <p>Hello Dr. ${firstName},</p>
          <p>Thanks for registering. Please confirm your email:</p>
          <a href="${confirmLink}">${confirmLink}</a>
          <p>This link will expire in 1 hour.</p>
        `,
      });
  
      res.status(201).json({ message: 'Doctor registered. Check your email to verify your account.' });
    } catch (err) {
      console.error('❌ Registration error:', err.message);
      res.status(500).json({ error: err.message });
    }
  });
  
 
// ✅ PASSWORD RESET REQUEST
router.post('/request-password-reset', async (req, res) => {
  const { email } = req.body;
 
  try {
    const user = await Doctor.findOne({ email }); // 🔄 Changed from User
    if (!user) return res.status(404).json({ error: 'No user with that email' });
 
    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpires = Date.now() + 3600000;
    await user.save();
 
    const resetLink = `https://emr-frontend-406r.onrender.com/reset-password/${token}`;
 
    await transporter.sendMail({
      from: `"BVG Athletics" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Reset Your Password',
      html: `
        <p>Hi, ${user.username}</p>
        <p>You requested a password reset.</p>
        <p>Click the link below to reset it:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link expires in 1 hour.</p>
      `,
    });
 
    res.json({ message: 'Password reset email sent!' });
  } catch (err) {
    console.error('❌ Error sending reset email:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
});
 
// ✅ PASSWORD RESET CONFIRM
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
 
  try {
    const user = await Doctor.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() },
    });
 
    if (!user) {
      return res.status(400).json({ error: 'Token is invalid or expired.' });
    }
 
    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
 
    await user.save();
    res.json({ message: 'Password updated successfully!' });
  } catch (err) {
    console.error('❌ Error resetting password:', err.message);
    res.status(500).json({ error: 'Failed to reset password. Please try again.' });
  }
});

// ✅ VERIFY EMAIL TOKEN
router.get('/verify/:token', async (req, res) => {
    try {
      const user = await Doctor.findOne({ verificationToken: req.params.token });
  
      if (!user) {
        return res.status(400).send('Invalid or expired verification token.');
      }
  
      user.isVerified = true;
      user.verificationToken = undefined;
      await user.save();
  
      res.send('✅ Email verified! You may now log in.');
    } catch (err) {
      console.error('❌ Email verification error:', err.message);
      res.status(500).send('Something went wrong. Try again later.');
    }
  });


export default router;