import express from "express";
import userSchema from "../../models/users";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
const router = express.Router();

router.post("/", async (req, res) => {
  let result = await userSchema.setPublicKey(req.body.id, req.body.publicKey);
  if (result.nModified == 1) {
    return res.status(200).json({ message: "OK" });
  } else {
    return res.status(400).json({ message: "Something went wrong" });
  }
});

router.get("/", async (req, res) => {
  return res.status(200).json({ publicKey: process.env.PUBLIC_KEY });
});

module.exports = router;
