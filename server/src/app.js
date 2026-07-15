const express = require('express');
const cors = require('cors');
const AppError = require('./utils/AppError');
const healthRoutes = require('./routes/healthRoutes');
const userRoutes = require('./routes/userRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
  })
);
app.use(express.json());

app.use('/api', healthRoutes);
app.use('/api', userRoutes);
app.use('/api', ticketRoutes);

app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: { message: err.message },
    });
  }

  console.error(err);
  res.status(500).json({
    success: false,
    error: { message: 'Something went wrong' },
  });
});

module.exports = app;
