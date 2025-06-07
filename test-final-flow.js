const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testCompleteFlow() {
  console.log('🔥 Testing complete MERN stack flow...\n');

  try {
    // 1. Test getting games
    console.log('1. Testing games endpoint...');
    const gamesResponse = await axios.get(`${API_BASE_URL}/games`);
    console.log(`✅ Found ${gamesResponse.data.length} games`);
    
    if (gamesResponse.data.length === 0) {
      console.log('❌ No games found. Please run seed-test-data.js first');
      return;
    }

    const testGame = gamesResponse.data[0];
    console.log(`📱 Using game: ${testGame.name}\n`);

    // 2. Test getting storage systems for this game
    console.log('2. Testing storage systems endpoint...');
    const storageResponse = await axios.get(`${API_BASE_URL}/storage?gameId=${testGame._id}`);
    console.log(`✅ Found ${storageResponse.data.length} storage systems for ${testGame.name}`);
    
    if (storageResponse.data.length === 0) {
      console.log('❌ No storage systems found');
      return;
    }

    const testStorage = storageResponse.data[0];
    console.log(`📦 Using storage: ${testStorage.name}\n`);

    // 3. Test getting items for this storage system
    console.log('3. Testing items endpoint...');
    const itemsResponse = await axios.get(`${API_BASE_URL}/items/storage/${testStorage._id}`);
    console.log(`✅ Found ${itemsResponse.data.length} items in ${testStorage.name}`);

    // 4. Test adding a new item
    console.log('\n4. Testing add item...');
    const newItem = {
      name: 'Test Item ' + Date.now(),
      quantity: 5,
      storageSystem: testStorage._id
    };

    const addResponse = await axios.post(`${API_BASE_URL}/items`, newItem);
    console.log(`✅ Added item: ${addResponse.data.name} (ID: ${addResponse.data._id})`);

    // 5. Test updating item quantity
    console.log('\n5. Testing update item quantity...');
    const updateResponse = await axios.put(`${API_BASE_URL}/items/${addResponse.data._id}`, {
      ...addResponse.data,
      quantity: 10
    });
    console.log(`✅ Updated quantity to: ${updateResponse.data.quantity}`);

    // 6. Test deleting the item
    console.log('\n6. Testing delete item...');
    await axios.delete(`${API_BASE_URL}/items/${addResponse.data._id}`);
    console.log(`✅ Deleted item: ${addResponse.data.name}`);

    console.log('\n🎉 All tests passed! The MERN stack is working correctly.');
    console.log('\nFrontend URLs to test:');
    console.log(`🌐 Main page: http://localhost:3001`);
    console.log(`🎮 Game storage: http://localhost:3001/game/${testGame._id}/storage`);
    console.log(`📦 Items page: http://localhost:3001/game/${testGame._id}/storage/${testStorage._id}/items`);

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testCompleteFlow();
