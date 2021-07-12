const asyncHandler = require('../middlewares/asyncHandler');
const AppError = require('../utils/error');
const Invoice = require('../models/Invoice');
const sendEmail = require('../middlewares/sendEmail');

// URL  @GET /invoices/
// URL  @GET /invoices?status=paid
// URL  @GET /invoices?status=outstanding
// URL  @GET /invoices?status=late
exports.getInvoices = asyncHandler(async (req, res, next) => {
  let invoices;
  if (req.query.status) {
    invoices = await Invoice.find({ status: req.query.status });
  } else {
    invoices = await Invoice.find({});
  }

  res.status(200).json({
    status: 'pass',
    count: invoices.length,
    invoices,
  });
});

// URL  @GET /invoices/:invoiceId
exports.getInvoice = asyncHandler(async (req, res, next) => {
  let invoice = await Invoice.findById(req.params.invoiceId);
  if (!invoice) {
    return next(
      new AppError(`Invoice with Id ${req.params.invoiceId} not found.`, 400)
    );
  }

  res.status(200).json({
    status: 'pass',
    invoice,
  });
});

// URL  @POST /invoices/
exports.createInvoice = asyncHandler(async (req, res, next) => {
  if (req.body.dueDate) {
    let currentDate = new Date(),
      dueDate = new Date(req.body.dueDate);

    if (currentDate.getTime() > dueDate.getTime()) {
      return next(new AppError(`Due date cannot be of the past.`, 400));
    }
  }
  let invoice = await Invoice.create(req.body);
  res.status(200).json({
    status: 'pass',
    invoice,
  });
});

// URL  @DELETE /invoices/:invoiceId
exports.deleteInvoice = asyncHandler(async (req, res, next) => {
  let invoice = await Invoice.findById(req.params.invoiceId);

  if (!invoice) {
    return next(
      new AppError(`Invoice with Id ${req.params.invoiceId} not found.`, 400)
    );
  }

  await Invoice.findByIdAndDelete(req.params.invoiceId);

  res.status(200).json({
    status: 'pass',
    invoice: {},
  });
});

// URL  @PATCH /invoices/:invoiceId?status=paid
// URL  @PATCH /invoices/:invoiceId?status=outstanding
// URL  @PATCH /invoices/:invoiceId?status=late
exports.updateInvoiceStatus = asyncHandler(async (req, res, next) => {
  let invoice = await Invoice.findById(req.params.invoiceId);

  if (!invoice) {
    return next(
      new AppError(`Invoice with Id ${req.params.invoiceId} not found.`, 400)
    );
  }

  invoice = await Invoice.findByIdAndUpdate(
    req.params.invoiceId,
    {
      status: req.query.status,
    },
    { new: true }
  );

  res.status(200).json({
    status: 'pass',
    invoice,
  });
});

// URL  @GET /invoices/:invoiceId/sendEmail
exports.sendInvoiceViaEmail = asyncHandler(async (req, res, next) => {
  let invoice = await Invoice.findById(req.params.invoiceId);

  if (!invoice) {
    return next(
      new AppError(`Invoice with Id ${req.params.invoiceId} not found.`, 400)
    );
  }

  let options = {
    sellerEmail: invoice.sellerInfo.sellerEmail,
    sellerName: invoice.sellerInfo.sellerName,
    clientEmail: invoice.clientInfo.clientEmail,
    subject: 'Invoice',
    message: JSON.stringify(invoice),
  };

  try {
    await sendEmail(options);
    res.status(200).json({
      status: 'pass',
      message: 'email sent',
    });
  } catch (err) {
    console.log(err);
    return next(new AppError('Email could not be sent', 500));
  }
});
