/**
 * Main route handler for serving application pages
 * Handles routing for public pages and authenticated sections
 */

const express = require('express');
const router = express.Router();
const path = require('path');
const ensureAuthenticated = require('../middleware/auth');

// Serve the login/registration page
router.get('/', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Serve the main games page (requires authentication)
router.get('/games', ensureAuthenticated, function (req, res) {
  res.sendFile(path.join(__dirname, '../public/games.html'));
});

module.exports = router;