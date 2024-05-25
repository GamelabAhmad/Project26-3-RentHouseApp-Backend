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
    return res.status(404).json({
      status: 'error',
      message: 'Email not found',
    });
  }

  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    return res.status(400).json({
      status: 'error',
      message: 'Password not match',
    });
  }

  const token = jwt.sign({ id: user.id }, 'secret');

  return res.status(200).json({
    status: 'success',
    message: 'Login success',
    data: {
      id: user.id,
      username: user.username,
      email: user.email,
      fullname: user.fullname,
      nomor_telp: user.nomor_telp,
    },
  });
};

module.exports = { register, login };
