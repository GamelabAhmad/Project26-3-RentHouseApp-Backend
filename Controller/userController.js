const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");

const register = async (req, res) => {
  console.log("Register endpoint hit");
  const { username, email, password, fullname, nomor_telp } = req.body;
  try {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      username,
      email,
      password: hashPassword,
      fullname,
      nomor_telp,
    });
    const token = jwt.sign({ userId: user.id }, "your_jwt_secret", { expiresIn: "1h" });
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { username, email, fullname, nomor_telp } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.username = username || user.username;
    user.email = email || user.email;
    user.fullname = fullname || user.fullname;
    user.nomor_telp = nomor_telp || user.nomor_telp;
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    await user.destroy();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
