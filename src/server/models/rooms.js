import mongoose from "mongoose";
import { messageSchema } from "./messages";

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
    .populate("participants", ["_id", "email", "name"])
    .then((rooms, err) => {
      if (err) {
        throw err;
      }
      return rooms;
    });
};

const roomModel = mongoose.model("Room", roomSchema);
export default roomModel;
