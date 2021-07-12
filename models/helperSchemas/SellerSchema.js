const mongoose = require('mongoose');

const SellerSchema = new mongoose.Schema({
  sellerName: {
    type: String,
    required: [true, 'Seller name required'],
    maxLength: [20, 'Word limit 20 exceeded for seller name'],
  },

  sellerContactNumber: {
    type: String,
    validate: {
      validator: function (v) {
        var re = /^\d{10}$/;
        return v == null || v.trim().length < 1 || re.test(v);
      },
      message: 'Provided seller phone number is invalid.',
    },
  },

  sellerEmail: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Please enter a valid seller email.',
    },
    required: [true, 'Seller email required'],
  },

  sellerAddress: String,
});

module.exports = SellerSchema;
