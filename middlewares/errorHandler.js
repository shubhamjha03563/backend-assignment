const fs = require('fs');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.statusCode = err.statusCode || 500;
  error.status = err.status || 'fail';

  // Cast errors signify that the input was in the wrong format
  if (err.name === 'CastError') {
    error.status = 400;
    error.message = 'Cast Error - Invalid Id';
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    error.status = 400;
    error.message = Object.values(err.errors)
      .map((obj) => obj.message)
      .join(', ');
  }

  console.log(err);

  res.status(error.statusCode).json({
    status: error.status,
    message: error.message || err.message,
  });
};

module.exports = errorHandler;
