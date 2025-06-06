const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// GET /api/items - Get all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find().populate({
      path: 'storageSystem',
      populate: {
        path: 'game'
      }
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/items/:id - Get a specific item
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate({
      path: 'storageSystem',
      populate: {
        path: 'game'
      }
    });
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/items/storage/:storageSystemId - Get items for a specific storage system
router.get('/storage/:storageSystemId', async (req, res) => {
  try {
    const items = await Item.find({ storageSystem: req.params.storageSystemId }).populate({
      path: 'storageSystem',
      populate: {
        path: 'game'
      }
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/items - Create a new item
router.post('/', async (req, res) => {
  try {
    const item = new Item({
      name: req.body.name,
      quantity: req.body.quantity,
      storageSystem: req.body.storageSystem
    });
    const newItem = await item.save();
    await newItem.populate({
      path: 'storageSystem',
      populate: {
        path: 'game'
      }
    });
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/items/:id - Update an item
router.put('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    item.name = req.body.name || item.name;
    item.quantity = req.body.quantity !== undefined ? req.body.quantity : item.quantity;
    item.storageSystem = req.body.storageSystem || item.storageSystem;
    
    const updatedItem = await item.save();
    await updatedItem.populate({
      path: 'storageSystem',
      populate: {
        path: 'game'
      }
    });
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/items/:id - Delete an item
router.delete('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
