import mongoose from "mongoose";

const Users = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

export const userSchema = new Users({
  name: String,
  email: String,
  rooms: [ObjectId],
  messages: [ObjectId],
});

export default userModel = mongoose.model("User", userSchema);
