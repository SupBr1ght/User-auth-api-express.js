import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: true,
    min: -1,
    max: 1, 
  },
  voter: {
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

ratingSchema.index({ voter: 1, targetId: 1, targetModel: 1 }, { unique: true });

export const Rating = mongoose.model('Rating', ratingSchema);
