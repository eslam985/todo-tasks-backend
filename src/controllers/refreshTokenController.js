const User = require("../model/User.js");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {

  const cookie = req.cookies;

  if (!cookie?.jwt) return res.sendStatus(401);
  const refreshToken = cookie.jwt;

  const foundUser = await User.findOne({ refreshtoken: refreshToken }).exec();
  if (!foundUser) return res.sendStatus(403);


  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser._id.toString() !== decoded.userId) return res.sendStatus(403);


    const accessToken = jwt.sign(
      { userId: foundUser._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.status(200).json({ accessToken });
  });
};


module.exports = handleRefreshToken;