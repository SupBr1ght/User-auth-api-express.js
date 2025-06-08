const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: true,
    min: -1,
    max: 1, 
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  target: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'targetModel', 
  },
  targetModel: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Rating', ratingSchema);
