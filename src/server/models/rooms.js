import mongoose from "mongoose";
import { messageSchema } from "./messages";
import userModel from "./users";

const Rooms = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

export const roomSchema = new Rooms({
  title: String,
  participants: [{ type: ObjectId, ref: "User" }],
  messages: [messageSchema],
});

roomSchema.statics.getSubscribedRoom = function (participant) {
  return this.find({
    participants: { $in: mongoose.Types.ObjectId(participant) },
  })
    .select("-__v")
    .populate("participants", ["_id", "email", "name", "gravatar"])
    .then((rooms, err) => {
      if (err) {
        throw err;
      }
      return rooms;
    });
};

roomSchema.statics.isRoomAvailable = async function (roomId, userId) {
  return await this.update(
    {
      _id: roomId,
      participants: {
        $ne: userId,
      },
    },
    {
      $push: { participants: mongoose.Types.ObjectId(userId) },
    }
  ).then(async (result, err) => {
    if (err) {
      return { err };
    } else if (result.nModified == 0) {
      return { message: "You are in the room!" };
    } else {
      let result = await userModel.addRoom(userId, roomId);
      if (result.err) {
        return result.err;
      } else if (result.nModified == 0) {
        return { message: "You are in the room!" };
      }
      return { message: "success" };
    }
  });
};
const roomModel = mongoose.model("Room", roomSchema);
export default roomModel;
