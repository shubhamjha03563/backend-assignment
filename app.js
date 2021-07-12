const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const errorHandler = require('./middlewares/errorHandler');
require('colors');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const AppError = require('./utils/error');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());

// limit 100 requests per 10 mins
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.use(hpp());

dotenv.config({ path: './.env' });

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(
    app.listen(process.env.PORT, () => {
      console.log(`Listening to port ${process.env.PORT}...`.cyan.bold);
    }),
    console.log('Connected to database.'.yellow.bold)
  )
  .catch((err) => {
    console.log(err);
    console.log('Error connecting to database !'.red.bold);
  });

// mount routers
const invoiceRoutes = require('./routes/invoiceRoutes');
app.use('/invoices', invoiceRoutes);

// Unhandled routes
app.all('*', (req, res, next) => {
  next(new AppError(`Requested URL not found - ${req.url}`, 404));
});

app.use(errorHandler);

process.on('unhandledRejection', (err) => {
  console.log(err);
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION!SERVER SHUT DOWN!'.bold.red);
  process.exit(1);
});
