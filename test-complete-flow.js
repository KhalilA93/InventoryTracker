// Test script to verify the complete MERN stack flow
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testCompleteFlow() {
  try {
    console.log('🧪 Testing complete MERN stack flow...\n');

    // 1. Test Games endpoint
    console.log('1. Testing Games endpoint...');
    const gamesResponse = await axios.get(`${API_BASE_URL}/games`);
    console.log(`✅ Found ${gamesResponse.data.length} games`);
    
    if (gamesResponse.data.length === 0) {
      console.log('❌ No games found. Creating test game...');
      const newGame = await axios.post(`${API_BASE_URL}/games`, {
        name: 'Test Game'
      });
      console.log('✅ Created test game:', newGame.data.name);
    }

    // 2. Test Storage Systems endpoint
    console.log('\n2. Testing Storage Systems endpoint...');
    const storageResponse = await axios.get(`${API_BASE_URL}/storage`);
    console.log(`✅ Found ${storageResponse.data.length} storage systems`);
    
    let testStorageId = null;
    if (storageResponse.data.length > 0) {
      testStorageId = storageResponse.data[0]._id;
      console.log(`✅ Using storage system: ${storageResponse.data[0].name} (${testStorageId})`);
    } else {
      console.log('❌ No storage systems found. Cannot test items.');
      return;
    }

    // 3. Test Items endpoints
    console.log('\n3. Testing Items endpoints...');
    
    // Get items for storage system
    console.log(`3a. Getting items for storage system ${testStorageId}...`);
    const itemsResponse = await axios.get(`${API_BASE_URL}/items/storage/${testStorageId}`);
    console.log(`✅ Found ${itemsResponse.data.length} items in storage system`);

    // Create a test item
    console.log('3b. Creating test item...');
    const newItem = await axios.post(`${API_BASE_URL}/items`, {
      name: 'Test Item',
      quantity: 10,
      storageSystem: testStorageId
    });
    console.log(`✅ Created item: ${newItem.data.name} (qty: ${newItem.data.quantity})`);

    // Update the item
    console.log('3c. Updating item quantity...');
    const updatedItem = await axios.put(`${API_BASE_URL}/items/${newItem.data._id}`, {
      name: newItem.data.name,
      quantity: 15
    });
    console.log(`✅ Updated item quantity to: ${updatedItem.data.quantity}`);

    // Get items again to verify
    console.log('3d. Verifying items list...');
    const finalItemsResponse = await axios.get(`${API_BASE_URL}/items/storage/${testStorageId}`);
    console.log(`✅ Final items count: ${finalItemsResponse.data.length}`);

    // Clean up - delete test item
    console.log('3e. Cleaning up test item...');
    await axios.delete(`${API_BASE_URL}/items/${newItem.data._id}`);
    console.log('✅ Test item deleted');

    console.log('\n🎉 All API endpoints working correctly!');
    console.log('\n📋 Summary:');
    console.log(`   - Games: ${gamesResponse.data.length}`);
    console.log(`   - Storage Systems: ${storageResponse.data.length}`);
    console.log(`   - Test storage ID: ${testStorageId}`);
    console.log('\n✅ Backend API is fully functional');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testCompleteFlow();
