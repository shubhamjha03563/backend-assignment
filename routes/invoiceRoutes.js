const express = require('express');
const router = express.Router();
const {
  getInvoices,
  getInvoice,
  createInvoice,
  updateInvoiceStatus,
  deleteInvoice,
  sendInvoiceViaEmail,
} = require('../controllers/invoiceController');

router.route('/').get(getInvoices).post(createInvoice);
router
  .route('/:invoiceId')
  .get(getInvoice)
  .patch(updateInvoiceStatus)
  .delete(deleteInvoice);
router.route('/:invoiceId/sendEmail').get(sendInvoiceViaEmail);

module.exports = router;
