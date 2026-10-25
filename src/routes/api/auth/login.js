const express = require("express");
const router = express.Router();
const handleLogin = require("../../../controllers/loginController.js");

router.post("/", handleLogin);

module.exports = router;
