const express = require('express');
const cors = require('cors');
const healthRoutes = require('../routes/healthRoutes');

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
  })
);
app.use(express.json());

app.use('/api', healthRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    error: { message: 'Something went wrong' },
  });
});

module.exports = app;
