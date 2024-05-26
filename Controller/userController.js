const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');

const register = async (req, res) => {
  const { username, email, password, fullname, nomor_telp, confirm_password } = req.body;

  if (password !== confirm_password) {
    return res.status(400).json({
      status: 'error',
      message: 'Password and confirm password not match',
    });
  }

  const checkEmail = await User.findOne({ where: { email } });

  if (checkEmail) {
    return res.status(400).json({
      status: 'error',
      message: 'Email already exist',
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    fullname,
    nomor_telp,
  });

  if (user) {
    return res.status(201).json({
      status: 'success',
      message: 'Register success',
      data: {
        id: user.id,
        username,
        email,
        fullname,
        nomor_telp,
      },
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(400).json({
      status: 'error',
      message: 'password salah atau email tidak terdaftar',
    });
  }

  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    return res.status(400).json({
      status: 'error',
      message: 'password salah atau email tidak terdaftar',
    });
  }

  const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, 'secret', { expiresIn: '1d' });

  res.cookie('token', token, {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
  });

  return res.status(200).json({
    status: 'success',
    message: 'Login success',
    data: {
      id: user.id,
      username: user.username,
      email: user.email,
      token: token,
    },
  });
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
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { username, email, fullname, nomor_telp } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
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
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.destroy();
    res.status(200).json({ message: 'User deleted successfully' });
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
  login,
};
