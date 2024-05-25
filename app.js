const express = require('express');
const cookieParser = require('cookie-parser');
const userRoutes = require('./Routes/userRoutes');
const User = require('./Models/userModel');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/users', userRoutes);
app.listen(3000, () => {
  console.log('Server is running on port 3000');
  User.sync({ alter: true });
});

module.exports = app;
