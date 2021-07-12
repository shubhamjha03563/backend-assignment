const mongoose = require('mongoose');
const SellerSchema = require('./helperSchemas/SellerSchema');
const ItemSchema = require('./helperSchemas/ItemSchema');
const ClientSchema = require('./helperSchemas/ClientSchema');

const InvoiceSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  dueDate: {
    type: Date,
  },
  sellerInfo: {
    type: SellerSchema,
    required: [true, 'Seller info required'],
  },
  items: [ItemSchema],
  clientInfo: {
    type: ClientSchema,
    required: [true, 'Client info required'],
  },
  paymentInfo: {
    type: String,
    required: [true, 'Payment info required'],
  },
  extraInfo: String,

  status: {
    type: String,
    enum: ['paid', 'outstanding', 'late'],
    default: 'outstanding',
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
});

InvoiceSchema.pre('save', function () {
  let total = 0;
  this.items.forEach((item) => {
    item.totalPrice = item.quantity * item.unitPrice;
    total += item.quantity * item.unitPrice;
  });
  this.totalPrice = total;
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
