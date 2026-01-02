import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Lost', 'Found']
  },
  itemCategory: {
    type: String,
    required: true,
    enum: ['Electronics', 'Clothing', 'Accessories', 'Documents', 'Keys', 'Bags', 'Others']
  },
  location: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  images: [{
    type: String,
    required: true
  }],
  status: {
    type: String,
    required: true,
    enum: ['Open', 'Resolved'],
    default: 'Open'
  }
}, {
  timestamps: true
});

const Item = mongoose.model('Item', itemSchema);
export default Item;