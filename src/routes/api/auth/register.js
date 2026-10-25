const express = require("express");
const router = express.Router();
const handleRegister = require("../../../controllers/registerController.js");

router.post("/", handleRegister);

module.exports = router;
