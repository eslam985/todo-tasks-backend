
const jwt = require("jsonwebtoken");

const verifyJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const authHeaderStr = Array.isArray(authHeader) ? authHeader[0] : authHeader;

    if (!authHeaderStr || !authHeaderStr.startsWith("Bearer ")) {
      res.status(401).json({ success: false, message: "Unauthorized: Access token is missing" });
      return;
    }

    const token = authHeaderStr.split(" ")[1];
    if (!token) {
      res.status(401).json({ success: false, message: "Unauthorized: Access token is missing" });
      return;
    }

    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
      res.status(500).json({ success: false, message: "Server error: Secret is missing" });
      return;
    }


    const decoded = jwt.verify(token, secret);
    if (!decoded || !decoded.userId) {
      res.status(401).json({ success: false, message: "Forbidden: Invalid access token" });
      return;
    }

    req.userId = decoded.userId;
    req.roles = parseInt(decoded.roles, 10) || null;

    next();
  } catch (err) {
    res.status(401).json({ success: false, message: "Forbidden: Invalid or expired access token" });
    return;
  }
};

module.exports = verifyJWT;