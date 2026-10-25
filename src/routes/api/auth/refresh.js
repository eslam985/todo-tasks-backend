const express = require("express");
const router = express.Router();
const handleRefreshToken = require("../../../controllers/refreshTokenController.js");

router.post("/", handleRefreshToken);

module.exports = router;

