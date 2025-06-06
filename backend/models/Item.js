const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true
  },
  quantity: {
    type: Number,
    default: 1,
    min: [0, 'Quantity cannot be negative']
  },
  storageSystem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StorageSystem',
    required: [true, 'Storage system is required']
  }
});

module.exports = mongoose.model('Item', itemSchema);
