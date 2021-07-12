const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  title: {
    type: String,
    maxLength: [20, 'Word limit 20 exceeded for item name'],
    required: [true, 'Item name required'],
  },
  description: {
    type: String,
    maxLength: [50, 'Word limit 50 exceeded for item description'],
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
  },
  unitPrice: {
    type: Number,
    required: [true, 'Unit price is required'],
  },
  totalPrice: Number,
});

module.exports = ItemSchema;
