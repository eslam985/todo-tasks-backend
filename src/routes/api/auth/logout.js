const express = require("express");
const router = express.Router();
const handleLogout = require("../../../controllers/logoutController.js");

router.post("/", handleLogout);

module.exports = router;
