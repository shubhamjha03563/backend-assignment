const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: [true, 'Client name required'],
    maxLength: [20, 'Word limit 20 exceeded for client name'],
  },

  clientContactNumber: {
    type: String,
    validate: {
      validator: function (v) {
        var re = /^\d{10}$/;
        return v == null || v.trim().length < 1 || re.test(v);
      },
      message: 'Provided client phone number is invalid.',
    },
  },

  clientEmail: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Please enter a valid client email.',
    },
    required: [true, 'Client email required'],
  },

  clientAddress: String,
});

module.exports = ClientSchema;
