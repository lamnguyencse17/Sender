import mongoose from "mongoose";

const Messages = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

export const messageSchema = new Messages({
  message: String,
  owner: ObjectId,
  room: ObjectId,
  date: { type: Date, default: Date.now },
});
const messageModel = mongoose.model("Message", messageSchema);
export default messageModel;
