import express from "express";
import userModel from "../../models/users";

const router = express.Router();

router.use("/", async (req, res) => {
  // req.body: {email, name, gravatarURL}
  let user = await userModel.isRegistered(req.body);
  console.log(user);
  res.status(200).json(user);
});

module.exports = router;
