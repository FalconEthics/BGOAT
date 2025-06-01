const fs = require('fs');
const path = require('path');
const {UserGameList} = require('../models/game');
const mongoose = require('mongoose');
const {ObjectId} = mongoose.Types;

/**
 * Seeds game data for a new user
 * @param {string} userId - MongoDB user ID
 * @returns {Promise<void>}
 */
async function seedUserGameData(userId) {
  try {
    // Check if user already has game data
    const existingData = await UserGameList.findOne({userId});
    if (existingData) {
      console.log(`User ${userId} already has game data`);
      return;
    }

    // Read seed data
    const seedPath = path.join(__dirname, '../seed/seed.json');
    const seedData = JSON.parse(fs.readFileSync(seedPath, 'utf8'));

    // Create user game list with the seed data, assigning ObjectIds
    const userGameList = new UserGameList({
      userId,
      categories: seedData.map(category => ({
        name: category.category,
        _id: new ObjectId(),
        games: category.games.map(game => ({
          ...game,
          _id: new ObjectId()
        }))
      }))
    });

    await userGameList.save();
    console.log(`Game data seeded successfully for user ${userId}`);
  } catch (error) {
    console.error('Error seeding game data:', error);
    throw error;
  }
}

module.exports = {seedUserGameData};