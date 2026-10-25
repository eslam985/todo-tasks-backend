const bcrypt = require('bcrypt');
const User = require("../model/User.js");
const jwt = require("jsonwebtoken");
const cookieOptions = require("../config/cookieOptions.js");

const handleLogin = async (req, res) => {
  try {
    if (!req?.body?.email || !req?.body?.password)
    return res.status(400).json({ message: "The Email And Password is required" });
    const { email, password } = req.body;
    const isExistUser = await User.findOne({ email: email }).select('+password').exec();
    if (!isExistUser)
    return res.status(400).json({ message: `We couldn't find this email address.` });

    const matchPas = await bcrypt.compare(password, isExistUser.password);
    if (!matchPas)
    return res.status(400).json({ message: `Incorrect password` });

    if (isExistUser && matchPas) {

      const accessToken = jwt.sign(
        { userId: isExistUser._id, roles: isExistUser.roles },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );


      const refreshToken = jwt.sign(
        { userId: isExistUser._id, roles: isExistUser.roles },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
      );



      res.cookie("jwt", refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000
      });


      isExistUser.refreshtoken = refreshToken;
      await isExistUser.save();


      res.status(200).json({ accessToken });
    } else {
      res.sendStatus(401);
    }

  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

module.exports = handleLogin;