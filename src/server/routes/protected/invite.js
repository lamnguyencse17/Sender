//TODO: Invite Link
import express from "express";
import roomSchema from "../../models/rooms";
import { announceNewUser } from "../../socket/socketio";

const router = express.Router();

router.use("/invite/:roomId", async (req, res) => {
  // req.body: {email, name, gravatarURL}
  let roomId = req.params.roomId;
  let userId = req.body.id;
  let name = req.body.name;
  console.log(roomId, userId);
  let result = await roomSchema.isRoomAvailable(roomId, userId);
  if (result.err) {
    return res.status(200).json({ err: result.err });
  } else {
    announceNewUser(roomId, name);
    return res.status(200).json({ message: result.message });
  }
});

module.exports = router;
