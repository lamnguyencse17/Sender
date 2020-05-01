import mongoose from "mongoose";
import { messageSchema } from "./messages";

const Rooms = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

export const roomSchema = new Rooms({
  title: String,
  participants: [ObjectId],
  messages: [messageSchema],
});

roomSchema.statics.getSubscribedRoom = function (
  participant = "5eabfa02f209780629cd9dfe"
) {
  return this.find({
    participants: { $in: mongoose.Types.ObjectId(participant) },
  }).then((rooms, err) => {
    if (err) {
      throw err;
    }
    let result = {};
    for (let i = 0; i < rooms.length; i++) {
      //We need real performance here
      result[rooms[i].title] = rooms[i]._id;
    }
    return result;
  });
};

const roomModel = mongoose.model("Room", roomSchema);
export default roomModel;
