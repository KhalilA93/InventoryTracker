const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function seedSampleData() {
  console.log('🌱 Seeding sample data...\n');

  try {
    // Create sample games
    const games = [
      { name: 'World of Warcraft' },
      { name: 'Minecraft' },
      { name: 'Elden Ring' }
    ];

    console.log('Creating games...');
    const gamePromises = games.map(game => 
      axios.post(`${API_BASE_URL}/games`, game)
    );
    const gameResponses = await Promise.all(gamePromises);
    const createdGames = gameResponses.map(res => res.data);
    console.log(`✅ Created ${createdGames.length} games`);

    // Create storage systems for each game
    const storageSystems = [
      { name: 'Bank', game: createdGames[0]._id },
      { name: 'Guild Bank', game: createdGames[0]._id },
      { name: 'Chest', game: createdGames[1]._id },
      { name: 'Ender Chest', game: createdGames[1]._id },
      { name: 'Inventory', game: createdGames[2]._id }
    ];

    console.log('Creating storage systems...');
    const storagePromises = storageSystems.map(storage => 
      axios.post(`${API_BASE_URL}/storage`, storage)
    );
    const storageResponses = await Promise.all(storagePromises);
    const createdStorages = storageResponses.map(res => res.data);
    console.log(`✅ Created ${createdStorages.length} storage systems`);

    // Create sample items
    const items = [
      { name: 'Iron Sword', quantity: 1, storageSystem: createdStorages[0]._id },
      { name: 'Health Potion', quantity: 10, storageSystem: createdStorages[0]._id },
      { name: 'Diamond Pickaxe', quantity: 1, storageSystem: createdStorages[2]._id },
      { name: 'Wood Blocks', quantity: 64, storageSystem: createdStorages[2]._id },
      { name: 'Rune Sword', quantity: 1, storageSystem: createdStorages[4]._id }
    ];

    console.log('Creating items...');
    const itemPromises = items.map(item => 
      axios.post(`${API_BASE_URL}/items`, item)
    );
    const itemResponses = await Promise.all(itemPromises);
    console.log(`✅ Created ${itemResponses.length} items`);

    console.log('\n🎉 Sample data seeding complete!');
    console.log('You can now test the application with sample data.');

  } catch (error) {
    console.error('❌ Error seeding data:', error.response?.data || error.message);
  }
}

// Only run if called directly
if (require.main === module) {
  seedSampleData();
}

module.exports = { seedSampleData };
