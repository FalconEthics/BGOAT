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

// Toggle game played status
router.patch('/games/:categoryId/:gameId/toggle-played', ensureAuthenticated, async (req, res) => {
  try {
    if (!req.session.user || !req.session.user.id) {
      return res.status(401).json({message: 'Unauthorized'});
    }

    const userId = req.session.user.id;
    const categoryId = req.params.categoryId;
    const gameId = req.params.gameId;

    console.log(`Toggle played request: userId=${userId}, categoryId=${categoryId}, gameId=${gameId}`);

    const userGameList = await UserGameList.findOne({userId});

    if (!userGameList) {
      console.log('User game list not found');
      return res.status(404).json({message: 'No games found for this user'});
    }

    // Find the category
    const categoryIndex = userGameList.categories.findIndex(c => c._id.toString() === categoryId);
    if (categoryIndex === -1) {
      console.log('Category not found', {
        categoryId,
        availableCategories: userGameList.categories.map(c => c._id.toString())
      });
      return res.status(404).json({message: 'Category not found'});
    }

    // Find the game within the category
    const gameIndex = userGameList.categories[categoryIndex].games.findIndex(g => g._id.toString() === gameId);
    if (gameIndex === -1) {
      console.log('Game not found', {
        gameId,
        categoryName: userGameList.categories[categoryIndex].name,
        availableGames: userGameList.categories[categoryIndex].games.map(g => g._id.toString())
      });
      return res.status(404).json({message: 'Game not found'});
    }

    // Toggle the played status
    const currentStatus = userGameList.categories[categoryIndex].games[gameIndex].played;
    userGameList.categories[categoryIndex].games[gameIndex].played = !currentStatus;

    // Save the changes
    await userGameList.save();

    const newStatus = userGameList.categories[categoryIndex].games[gameIndex].played;
    console.log(`Game marked as ${newStatus ? 'played' : 'not played'}`);

    res.json({
      message: `Game marked as ${newStatus ? 'played' : 'not played'}`,
      played: newStatus
    });
  } catch (error) {
    console.error('Error toggling game played status:', error);
    res.status(500).json({message: 'Server error'});
  }
});

// Delete a game
router.delete('/games/:categoryId/:gameId', ensureAuthenticated, async (req, res) => {
  try {
    if (!req.session.user || !req.session.user.id) {
      return res.status(401).json({message: 'Unauthorized'});
    }

    const userId = req.session.user.id;
    const categoryId = req.params.categoryId;
    const gameId = req.params.gameId;

    console.log(`Delete game request: userId=${userId}, categoryId=${categoryId}, gameId=${gameId}`);

    const userGameList = await UserGameList.findOne({userId});

    if (!userGameList) {
      console.log('User game list not found');
      return res.status(404).json({message: 'No games found for this user'});
    }

    // Find the category
    const categoryIndex = userGameList.categories.findIndex(c => c._id.toString() === categoryId);
    if (categoryIndex === -1) {
      console.log('Category not found', {
        categoryId,
        availableCategories: userGameList.categories.map(c => c._id.toString())
      });
      return res.status(404).json({message: 'Category not found'});
    }

    // Find the game within the category
    const gameIndex = userGameList.categories[categoryIndex].games.findIndex(g => g._id.toString() === gameId);
    if (gameIndex === -1) {
      console.log('Game not found', {
        gameId,
        categoryName: userGameList.categories[categoryIndex].name,
        availableGames: userGameList.categories[categoryIndex].games.map(g => g._id.toString())
      });
      return res.status(404).json({message: 'Game not found'});
    }

    // Get the name of the game before deleting it
    const gameName = userGameList.categories[categoryIndex].games[gameIndex].name;

    // Remove the game from the array
    userGameList.categories[categoryIndex].games.splice(gameIndex, 1);

    // Save the changes
    await userGameList.save();

    console.log(`Game "${gameName}" deleted successfully`);

    res.json({
      message: `Game "${gameName}" deleted successfully`,
      deleted: true
    });
  } catch (error) {
    console.error('Error deleting game:', error);
    res.status(500).json({message: 'Server error'});
  }
});

// Add a new category
router.post('/games/categories/add', ensureAuthenticated, async (req, res) => {
  try {
    if (!req.session.user || !req.session.user.id) {
      return res.status(401).json({message: 'Unauthorized'});
    }

    const userId = req.session.user.id;
    const {name} = req.body;

    if (!name) {
      return res.status(400).json({message: 'Category name is required'});
    }

    const userGameList = await UserGameList.findOne({userId});

    if (!userGameList) {
      return res.status(404).json({message: 'No game list found for this user'});
    }

    // Check if category with same name already exists
    const categoryExists = userGameList.categories.some(cat =>
      cat.name.toLowerCase() === name.toLowerCase()
    );

    if (categoryExists) {
      return res.status(400).json({message: 'A category with this name already exists'});
    }

    // Add the new category with explicit ObjectId
    const mongoose = require('mongoose');
    const ObjectId = mongoose.Types.ObjectId;

    userGameList.categories.push({
      name,
      games: [],
      _id: new ObjectId() // Explicitly create a new ObjectId
    });

    await userGameList.save();
    res.status(201).json({message: 'Category created successfully'});
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({message: 'Server error'});
  }
});

// Add a new game to a category for the current user
router.post('/games/:categoryId/add', ensureAuthenticated, async (req, res) => {
  try {
    if (!req.session.user || !req.session.user.id) {
      return res.status(401).json({message: 'Unauthorized'});
    }
    const userId = req.session.user.id;
    const categoryId = req.params.categoryId;
    const {name, rating, desc, trailer, buy} = req.body;

    if (!name || !rating || !desc || !trailer || !Array.isArray(buy) || buy.length === 0) {
      return res.status(400).json({message: 'All fields are required'});
    }

    const userGameList = await UserGameList.findOne({userId});
    if (!userGameList) {
      return res.status(404).json({message: 'No games found for this user'});
    }
    const category = userGameList.categories.find(cat => cat._id.toString() === categoryId);
    if (!category) {
      return res.status(404).json({message: 'Category not found'});
    }
    // Add the new game
    category.games.push({
      name,
      rating,
      desc,
      trailer,
      buy,
      played: false
    });
    await userGameList.save();
    res.status(201).json({message: 'Game added successfully'});
  } catch (error) {
    console.error('Error adding game:', error);
    res.status(500).json({message: 'Server error'});
  }
});

module.exports = router;