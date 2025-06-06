const mongoose = require('mongoose');

const storageSystemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Storage system name is required'],
    trim: true
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: [true, 'Game is required']
  }
});

module.exports = mongoose.model('StorageSystem', storageSystemSchema);