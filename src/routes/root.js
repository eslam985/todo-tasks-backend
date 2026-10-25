const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  console.log("from root");
  res.send("hello world");
});

module.exports = router;
