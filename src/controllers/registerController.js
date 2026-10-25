const User = require("../model/User.js");
const bcrypt = require('bcrypt');

const handleRegister = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    if (!username || !password || !email)
      return res.status(400).json({ message: "All Fields Is Required" });

    if (password.length < 8)
      return res.status(400).json({ message: "The password must be at least 8 characters long." });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    
    const duplicate = await User.findOne({ $or: [{ username }, { email }] }).exec();
    if (duplicate) {
      return res.status(409).json({ message: `Username or Email already exists` });
    }

    const hashPwd = await bcrypt.hash(password, 10);

    await User.create({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: hashPwd
    });

    res.status(201).json({ success: `Registration successful, User ${username}` })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server Error" })
  }
}

module.exports = handleRegister