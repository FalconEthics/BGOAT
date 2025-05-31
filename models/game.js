const mongoose = require('mongoose');

// Schema for purchase options
const purchaseOptionSchema = new mongoose.Schema({
  for: {type: String, required: true},
  link: {type: String, required: true}
}, {_id: false});

// Game schema
const gameSchema = new mongoose.Schema({
  name: {type: String, required: true},
  rating: {type: Number, required: true},
  desc: {type: String, required: true},
  trailer: {type: String, required: true},
  buy: [purchaseOptionSchema]
});

// Category schema - for reference only
const categorySchema = new mongoose.Schema({
  name: {type: String, required: true},
  games: [gameSchema]
});

// User game list schema - this connects users to their games
const userGameListSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  categories: [{
    name: {type: String, required: true},
    games: [gameSchema]
  }]
});

const Game = mongoose.model('Game', gameSchema);
const UserGameList = mongoose.model('UserGameList', userGameListSchema);

module.exports = {Game, UserGameList};