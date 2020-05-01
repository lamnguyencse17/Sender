import mongoose from "mongoose";
import messageSchema from "./messages";

const Rooms = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

export const roomSchema = new Rooms({
  title: String,
  participants: [ObjectId],
  messages: [messageSchema],
});

export default roomModel = mongoose.model("Room", roomSchema);
