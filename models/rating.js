import mongoose from "mongoose";

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
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'targetModel', 
  },
  targetModel: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export const Rating = mongoose.model('Rating', ratingSchema);
