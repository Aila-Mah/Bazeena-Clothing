const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationToken = crypto.randomBytes(32).toString('hex');

    user = new User({
      name,
      email,
      password: hashedPassword,
      verificationToken
    });

    await user.save();

    // Send verification email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const verificationURL = `http://localhost:5000/api/auth/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify your email for Bazeena Clothing',
      html: `
        <p>Hello ${name},</p>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationURL}">${verificationURL}</a>
        <p>This link will expire in 24 hours.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ msg: 'Verification email sent. Please check your inbox.' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({ verificationToken: token });
    if (!user) return res.status(400).send('Invalid or expired token.');

    user.isVerified = true;
    user.verificationToken = undefined; // Clear token
    await user.save();

    res.send('Email verified successfully! You can now log in.');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    if (!user.isVerified) {
      return res.status(403).json({ msg: 'Please verify your email before logging in.' });
    }    

    // Generate JWT
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const { address } = req.body;
    if (!address) return res.status(400).json({ msg: 'Address is required' });

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { address },
      { new: true }
    ).select('-password');

    res.json({ msg: 'Address updated successfully', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ msg: 'Both current and new passwords are required' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Current password is incorrect' });

    // Hash and update new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ msg: 'Password updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
