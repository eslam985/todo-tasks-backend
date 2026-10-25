const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  console.log("from root");
  res.send(
    `Welcome to my server! If you're interested, you can visit my GitHub: 
    <a 
      href="https://github.com/eslam985" 
      target="_blank" 
      style="color: #007bff; text-decoration: underline;">https://github.com/eslam985
    </a>
    `,
  );
});

module.exports = router;
