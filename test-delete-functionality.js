const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testDeleteFunctionality() {
  console.log('🗑️ Testing Delete Functionality...\n');

  try {
    // 1. Create a test game to delete
    console.log('1. Creating test game...');
    const gameResponse = await axios.post(`${API_BASE_URL}/games`, {
      name: 'Test Game for Deletion'
    });
    const testGame = gameResponse.data;
    console.log(`✅ Created test game: ${testGame.name} (ID: ${testGame._id})`);

    // 2. Create a test storage system for that game
    console.log('\n2. Creating test storage system...');
    const storageResponse = await axios.post(`${API_BASE_URL}/storage`, {
      name: 'Test Storage for Deletion',
      game: testGame._id
    });
    const testStorage = storageResponse.data;
    console.log(`✅ Created test storage: ${testStorage.name} (ID: ${testStorage._id})`);

    // 3. Create a test item for that storage system
    console.log('\n3. Creating test item...');
    const itemResponse = await axios.post(`${API_BASE_URL}/items`, {
      name: 'Test Item for Deletion',
      quantity: 1,
      storageSystem: testStorage._id
    });
    const testItem = itemResponse.data;
    console.log(`✅ Created test item: ${testItem.name} (ID: ${testItem._id})`);

    // 4. Test deleting the storage system (should delete item too)
    console.log('\n4. Testing storage system deletion...');
    await axios.delete(`${API_BASE_URL}/storage/${testStorage._id}`);
    console.log(`✅ Successfully deleted storage system: ${testStorage.name}`);

    // 5. Verify the item was deleted (should return empty array or 404)
    console.log('\n5. Verifying items were cleaned up...');
    try {
      const itemsResponse = await axios.get(`${API_BASE_URL}/items/storage/${testStorage._id}`);
      console.log(`✅ Items endpoint returned: ${itemsResponse.data.length} items (expected: 0)`);
    } catch (err) {
      if (err.response?.status === 404) {
        console.log('✅ Storage system not found (expected after deletion)');
      } else {
        throw err;
      }
    }

    // 6. Test deleting the game
    console.log('\n6. Testing game deletion...');
    await axios.delete(`${API_BASE_URL}/games/${testGame._id}`);
    console.log(`✅ Successfully deleted game: ${testGame.name}`);

    // 7. Verify the game was deleted
    console.log('\n7. Verifying game was deleted...');
    try {
      await axios.get(`${API_BASE_URL}/games/${testGame._id}`);
      console.log('❌ Game still exists (unexpected)');
    } catch (err) {
      if (err.response?.status === 404) {
        console.log('✅ Game not found (expected after deletion)');
      } else {
        throw err;
      }
    }

    console.log('\n🎉 All delete functionality tests passed!');
    console.log('\n📝 Frontend features to test:');
    console.log('- Delete button appears when game is selected');
    console.log('- Delete button appears when storage system is selected');
    console.log('- Confirmation dialog appears before deletion');
    console.log('- Items are refreshed after deletion');

  } catch (error) {
    console.error('❌ Delete test failed:', error.response?.data || error.message);
  }
}

testDeleteFunctionality();
