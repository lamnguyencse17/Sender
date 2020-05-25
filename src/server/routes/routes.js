const express = require("express");
const router = express.Router();

router.post(
  "/authenticate",
  (req, res, next) => {
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

router.use(
  "/key",
  (req, res, next) => {
    console.log("check");
    next();
  },
  require("./protected/key")
);

router.post(
  "/room",
  (req, res, next) => {
    next();
  },
  require("./protected/room")
);

module.exports = router;
