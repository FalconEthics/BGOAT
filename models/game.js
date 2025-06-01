/**
 * Game and Category data models
 * Defines the schema for user game collections and individual game entries
 */

const mongoose = require('mongoose');

// Schema for purchase options
const purchaseOptionSchema = new mongoose.Schema({
  for: {type: String, required: true},
  link: {type: String, required: true}
}, {_id: false});

// Schema for individual game entries
const gameSchema = new mongoose.Schema({
  name: {type: String, required: true},
  rating: {type: Number, required: true, min: 1, max: 10},
  desc: {type: String, required: true},
  trailer: {type: String, required: true},
  buy: [purchaseOptionSchema],
  played: {type: Boolean, default: false}
}, {_id: true}); // Ensure _id is always present

// Schema for game categories
const categorySchema = new mongoose.Schema({
  name: {type: String, required: true},
  games: [gameSchema]
}, {_id: true}); // Ensure _id is always present

// Main schema for user's game collection
const userGameListSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  categories: [{
    name: {type: String, required: true},
    games: [gameSchema],
    _id: {type: mongoose.Schema.Types.ObjectId, auto: true} // Ensure _id for categories
  }]
});

// Export the model for use in other parts of the application
const Game = mongoose.model('Game', gameSchema);
const UserGameList = mongoose.model('UserGameList', userGameListSchema);

module.exports = {Game, UserGameList};