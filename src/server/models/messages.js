import mongoose from "mongoose";

const Messages = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

export const messageSchema = new Messages({
  message: String,
  owner: ObjectId,
  room: ObjectId,
  date: Date,
});

export default messageModel = mongoose.model("Room", messageSchema);
