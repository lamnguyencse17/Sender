import express from "express";
import userSchema from "../../models/users";
import { encrypt } from "../../helpers/cryptography";
const router = express.Router();

router.use("/", async (req, res) => {
  let result = await userSchema.setPublicKey(req.body.id, req.body.publicKey);
  if (result.nModified == 1) {
    return res.status(200).json({ message: "OK" });
  } else {
    return res.status(400).json({ message: "Something went wrong" });
  }
});

module.exports = router;
