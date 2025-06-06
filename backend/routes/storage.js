const express = require('express');
const router = express.Router();
const StorageSystem = require('../models/StorageSystem');

// GET /api/storage - Get all storage systems
router.get('/', async (req, res) => {
  try {
    const storageSystems = await StorageSystem.find().populate('game');
    res.json(storageSystems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/storage/:id - Get a specific storage system
router.get('/:id', async (req, res) => {
  try {
    const storageSystem = await StorageSystem.findById(req.params.id).populate('game');
    if (!storageSystem) {
      return res.status(404).json({ message: 'Storage system not found' });
    }
    res.json(storageSystem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/storage/game/:gameId - Get storage systems for a specific game
router.get('/game/:gameId', async (req, res) => {
  try {
    const storageSystems = await StorageSystem.find({ game: req.params.gameId }).populate('game');
    res.json(storageSystems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/storage - Create a new storage system
router.post('/', async (req, res) => {
  try {
    const storageSystem = new StorageSystem({
      name: req.body.name,
      game: req.body.game
    });
    const newStorageSystem = await storageSystem.save();
    await newStorageSystem.populate('game');
    res.status(201).json(newStorageSystem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/storage/:id - Update a storage system
router.put('/:id', async (req, res) => {
  try {
    const storageSystem = await StorageSystem.findById(req.params.id);
    if (!storageSystem) {
      return res.status(404).json({ message: 'Storage system not found' });
    }
    
    storageSystem.name = req.body.name || storageSystem.name;
    storageSystem.game = req.body.game || storageSystem.game;
    
    const updatedStorageSystem = await storageSystem.save();
    await updatedStorageSystem.populate('game');
    res.json(updatedStorageSystem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/storage/:id - Delete a storage system
router.delete('/:id', async (req, res) => {
  try {
    const storageSystem = await StorageSystem.findById(req.params.id);
    if (!storageSystem) {
      return res.status(404).json({ message: 'Storage system not found' });
    }
    
    await StorageSystem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Storage system deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
