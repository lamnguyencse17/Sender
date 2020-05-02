const express = require("express");
const router = express.Router();

router.post(
  "/authenticate",
  (req, res, next) => {
    console.log("CHECL");
    next();
  },
  require("./protected/authenticate")
);

module.exports = router;
