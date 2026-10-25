const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  console.log("from root");
  res.send(
    `Welcome to my server! If you're interested, you can visit my GitHub: https://github.com/eslam985`,
  );
});

module.exports = router;
