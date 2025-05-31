const express = require('express');
const router = express.Router();
const {UserGameList} = require('../models/game');
const ensureAuthenticated = require('../middleware/auth');
const {seedUserGameData} = require('../utils/seeder');

// Get all games for the current user
router.get('/games', ensureAuthenticated, async (req, res) => {
  try {
    if (!req.session.user || !req.session.user.id) {
      return res.status(401).json({message: 'Unauthorized'});
    }

    const userId = req.session.user.id;
    let userGameList = await UserGameList.findOne({userId});

    // If user doesn't have game data yet, seed it
    if (!userGameList) {
      try {
        await seedUserGameData(userId);
        userGameList = await UserGameList.findOne({userId});

        // If still no game list, there's a serious problem
        if (!userGameList) {
          console.error('Failed to seed and retrieve game data for user', userId);
          return res.status(500).json({message: 'Failed to create game data'});
        }
      } catch (seedError) {
        console.error('Error seeding game data:', seedError);
        return res.status(500).json({message: 'Error creating game data'});
      }
    }

    res.json(userGameList);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({message: 'Server error'});
  }
});

// Get games by category for the current user
router.get('/games/:category', ensureAuthenticated, async (req, res) => {
  try {
    if (!req.session.user || !req.session.user.id) {
      return res.status(401).json({message: 'Unauthorized'});
    }

    const userId = req.session.user.id;
    const categoryName = req.params.category;

    const userGameList = await UserGameList.findOne({userId});

    if (!userGameList) {
      return res.status(404).json({message: 'No games found for this user'});
    }

    const category = userGameList.categories.find(cat => cat.name === categoryName);

    if (!category) {
      return res.status(404).json({message: 'Category not found'});
    }

    res.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({message: 'Server error'});
  }
});

// Reset games data for the current user
router.post('/reset-games', ensureAuthenticated, async (req, res) => {
  try {
    if (!req.session.user || !req.session.user.id) {
      return res.status(401).json({message: 'Unauthorized'});
    }

    const userId = req.session.user.id;

    // Delete current game data for this user
    await UserGameList.findOneAndDelete({userId});

    // Reseed game data for this user
    await seedUserGameData(userId);

    res.status(200).json({message: 'Game data has been reset successfully'});
  } catch (error) {
    console.error('Error resetting games:', error);
    res.status(500).json({message: 'Failed to reset game data'});
  }
});

module.exports = router;