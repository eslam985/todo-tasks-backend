const User = require("../model/User.js");
const cookieOptions = require("../config/cookieOptions.js");

const handleLogout = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);

    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshtoken: refreshToken }).exec();

    if (!foundUser) {
      res.clearCookie("jwt", cookieOptions);
      res.sendStatus(204);

      return;
    }

    foundUser.refreshtoken = null;

    res.clearCookie("jwt", cookieOptions);

    await foundUser.save();

    if (!cookies?.jwt) {
      res.status(200).json({
        success: true,
        message: "Already logged out",
      });

      return;
    }

    res.status(200).json({ success: true, message: "Logout successful" });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

module.exports = handleLogout;
