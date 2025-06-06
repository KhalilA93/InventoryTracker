const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Game = require('./backend/models/Game');
const StorageSystem = require('./backend/models/StorageSystem');
const Item = require('./backend/models/Item');

async function seedTestData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Create a test game
    const testGame = new Game({ name: 'Test Game' });
    await testGame.save();
    console.log('Created test game:', testGame);

    // Create a test storage system
    const testStorage = new StorageSystem({ 
      name: 'Test Storage', 
      game: testGame._id 
    });
    await testStorage.save();
    console.log('Created test storage:', testStorage);

    // Create a test item
    const testItem = new Item({
      name: 'Test Item',
      quantity: 5,
      storageSystem: testStorage._id
    });
    await testItem.save();
    console.log('Created test item:', testItem);

    console.log('Test data created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating test data:', error);
    process.exit(1);
  }
}

seedTestData();
