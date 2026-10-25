
const User = require("../model/User.js");

const handleLogout = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);

    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshtoken: refreshToken }).exec();

    const isProduction = process.env.NODE_ENV === "production";

    const cookieOptions = {
      httpOnly: true,
      sameSite: isProduction ? "None" : "Lax",
      secure: isProduction
    };

    if (!foundUser) {
      res.clearCookie("jwt", cookieOptions);
      return res.sendStatus(204);
    }

    foundUser.refreshtoken = null;
    await foundUser.save();

    if (!cookies?.jwt) {
      return res.status(200).json({
        message: "Already logged out"
      });
    }

    res.clearCookie("jwt", cookieOptions);

    res.status(200).json({ success: false, message: "Logout successful" });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

module.exports = handleLogout;