const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const gameRoutes = require('./routes/games');
const storageSystemRoutes = require('./routes/storage');
const itemRoutes = require('./routes/items');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  });

// Routes
app.use('/api/games', gameRoutes);
app.use('/api/storage', storageSystemRoutes);
app.use('/api/items', itemRoutes);

// Basic route for testing
app.get('/', (req, res) => {  res.json({ 
    message: 'Inventory Tracker API',
    endpoints: {
      games: '/api/games',
      storage: '/api/storage',
      items: '/api/items'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
