import express from "express";
import userModel from "../../models/users";

const router = express.Router();

router.use("/", async (req, res) => {
  // req.body: {email, name, gravatarURL}
  let { email, gravatar, name, _id, newUser } = await userModel.isRegistered(req.body);
  res.status(200).json({ email, gravatar, name, _id, newUser });
});

module.exports = router;
