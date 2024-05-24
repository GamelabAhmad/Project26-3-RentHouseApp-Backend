const sequelize = require("../Database/database");
const User = require("./userModel");

const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log("Database & tables created!");
  } catch (error) {
    console.error("Unable to sync database:", error);
  }
};

module.exports = { syncDatabase, User };
