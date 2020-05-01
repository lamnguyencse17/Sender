import mongoose from "mongoose";
import { messageSchema } from "./messages";

const Users = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

export const userSchema = new Users({
  name: String,
  email: String,
  rooms: [ObjectId],
  messages: [messageSchema],
});

const userModel = mongoose.model("User", userSchema);
export default userModel;
