const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Game name is required'],
    trim: true
  }
});

module.exports = mongoose.model('Game', gameSchema);
