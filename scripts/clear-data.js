const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function clearAllData() {
  console.log('Clearing all data...\n');

  try {
    // Get all items and delete them
    console.log('Clearing items...');
    const games = await axios.get(`${API_BASE_URL}/games`);
    
    for (const game of games.data) {
      const storages = await axios.get(`${API_BASE_URL}/storage/game/${game._id}`);
      
      for (const storage of storages.data) {
        const items = await axios.get(`${API_BASE_URL}/items/storage/${storage._id}`);
        
        for (const item of items.data) {
          await axios.delete(`${API_BASE_URL}/items/${item._id}`);
        }
        
        // Delete storage system
        await axios.delete(`${API_BASE_URL}/storage/${storage._id}`);
      }
        // Delete game
      await axios.delete(`${API_BASE_URL}/games/${game._id}`);
    }

    console.log('All data cleared successfully!');

  } catch (error) {
    console.error('Error clearing data:', error.response?.data || error.message);
  }
}

// Only run if called directly
if (require.main === module) {
  clearAllData();
}

module.exports = { clearAllData };
