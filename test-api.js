const http = require('http');

// Test the base API endpoint
const testEndpoint = (path, callback) => {
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: path,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log(`${path} - Status: ${res.statusCode}`);
      try {
        const parsed = JSON.parse(data);
        console.log(`${path} - Response:`, parsed);
      } catch (e) {
        console.log(`${path} - Raw response:`, data);
      }
      if (callback) callback();
    });
  });

  req.on('error', (error) => {
    console.error(`${path} - Error:`, error.message);
    if (callback) callback();
  });

  req.end();
};

console.log('Testing API endpoints...');

// Test base endpoint
testEndpoint('/', () => {
  // Test games endpoint
  testEndpoint('/api/games', () => {
    // Test storage endpoint
    testEndpoint('/api/storage', () => {
      // Test items endpoint
      testEndpoint('/api/items', () => {
        console.log('API tests completed');
      });
    });
  });
});
