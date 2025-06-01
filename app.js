/*
  * BGOAT - Backend Game of All Time
  * A simple game collection manager
  * Created by: SOUMIK DAS : https://mrsoumikdas.com/
  * License: MIT License
  * This project is open source and free to use.
*/

// Load environment variables from .env file
require('dotenv').config();

// entry point for the BGOAT application, setting up the Express app, connecting to MongoDB, and defining routes
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const gamesRouter = require('./routes/games');

const app = express();

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'bgoat_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {secure: false} // set to true if using HTTPS
}));
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.use('/', indexRouter);
app.use('/api', authRouter);
app.use('/api', gamesRouter);

module.exports = app;