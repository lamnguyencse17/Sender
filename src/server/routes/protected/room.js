import express from "express";
import { encrypt } from "../../helpers/cryptography";
import roomModel from "../../models/rooms";
const router = express.Router();

router.use("/", async (req, res) => {
  // req.body: roomTitle, participants, userId
  let { roomTitle, participants, userId } = req.body;
  roomModel.newRoom(roomTitle, participants).then((result, err) => {
    if (err) {
      console.log(err);
      return res.status(400).send(err);
    } else {
      return res
        .status(200)
        .json({ ...encrypt(JSON.stringify(result), userId) });
    }
  });
  res.status(200).json(result);
});

module.exports = router;
