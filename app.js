const express = require('express');
const cookieParser = require('cookie-parser');
const userRoutes = require('./Routes/userRoutes');
const kostRoutes = require('./Routes/kostRoutes');
const { Kost, detailKost } = require('./Models/kostModel');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/kosts', kostRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
  Kost.sync({ force: true });
  detailKost.sync({ force: true });
});

module.exports = app;
