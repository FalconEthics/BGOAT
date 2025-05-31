const express = require('express');
const router = express.Router();
const path = require('path');
const ensureAuthenticated = require('../middleware/auth');

router.get('/', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

router.get('/games', ensureAuthenticated, function (req, res) {
  res.sendFile(path.join(__dirname, '../public/games.html'));
});

module.exports = router;