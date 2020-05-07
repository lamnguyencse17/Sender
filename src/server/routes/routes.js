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

router.post(
  "/invite/:id",
  (req, res, next) => {
    next();
  },
  require("./protected/invite")
);

router.get(
  "/file/:filename",
  (req, res, next) => {
    next();
  },
  require("./protected/file")
);

module.exports = router;
