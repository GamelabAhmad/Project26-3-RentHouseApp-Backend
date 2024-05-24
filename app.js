const express = require("express");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoutes");
const { syncDatabase } = require("./Models/index");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes);

const PORT = 3000;
app.listen(PORT, async () => {
  await syncDatabase();
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
