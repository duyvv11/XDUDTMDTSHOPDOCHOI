const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/Users');

// Đăng ký
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, address, phone } = req.body;

    // kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'Email đã được sử dụng' });
    }

    // mã hoá mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // tạo user mới
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      address,
      phone,
    });

    await newUser.save();
    res.status(201).json({ msg: 'Đăng ký thành công', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Lỗi server' });
  }
});

//Đăng nhập
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // tìm user theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Sai email hoặc mật khẩu' });
    }

    // so sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Sai email hoặc mật khẩu' });
    }

    res.json({
      msg: 'Đăng nhập thành công',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Lỗi server' });
  }
});

module.exports = router;
