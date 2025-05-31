const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {seedUserGameData} = require('../utils/seeder');

// User schema
const userSchema = new mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true}
});
const User = mongoose.model('User', userSchema);

// Register
router.post('/register', async (req, res) => {
  const {name, email, password} = req.body;
  if (!name || !email || !password)
    return res.status(400).json({message: 'All fields required'});

  const existing = await User.findOne({email});
  if (existing)
    return res.status(409).json({message: 'Email already registered'});

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = new User({name, email, password: hash});
    await user.save();

    // Seed game data for the new user
    await seedUserGameData(user._id);

    res.status(201).json({message: 'User registered'});
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({message: 'Registration failed'});
  }
});

// Login
router.post('/login', async (req, res) => {
  const {email, password} = req.body;
  if (!email || !password)
    return res.status(400).json({message: 'Email and password required'});

  const user = await User.findOne({email});
  if (!user)
    return res.status(401).json({message: 'Invalid credentials'});

  const valid = await bcrypt.compare(password, user.password);
  if (!valid)
    return res.status(401).json({message: 'Invalid credentials'});

  req.session.user = {
    id: user._id,
    name: user.name,
    email: user.email
  };

  res.json({message: 'Login successful', user: {name: user.name, email: user.email}});
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({message: 'Logged out'});
  });
});

module.exports = router;