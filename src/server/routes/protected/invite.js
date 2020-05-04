//TODO: Invite Link
import express from "express";
import roomSchema from "../../models/rooms";

const router = express.Router();

router.use("/invite/:roomId", async (req, res) => {
  // req.body: {email, name, gravatarURL}
  let roomId = req.params.roomId;
  let userId = req.body.id;
  console.log(roomId, userId);
  let result = await roomSchema.isRoomAvailable(roomId, userId);
  console.log(result);
  if (result.err) {
    res.status(200).json({ err: result.err });
  } else {
    res.status(200).json({ message: result.message });
  }
});

module.exports = router;
