import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  poster: {
    type: String,
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  status: {
    type: Number,
    default: 1 // 1 for Active, 0 for Inactive
  },
  links: {
    web: { type: String, required: true },
    android: { type: String },
    ios: { type: String }
  },
  category: {
    type: String,
    required: true // e.g., "News", "Entertainment", "Sports"
  }
}, { timestamps: true });

const Channel = mongoose.model('Channel', channelSchema);

export default Channel;