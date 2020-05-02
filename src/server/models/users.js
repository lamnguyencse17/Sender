import mongoose from "mongoose";
import { messageSchema } from "./messages";

const Users = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

export const userSchema = new Users({
  name: String,
  email: String,
  gravatar: String,
  rooms: [ObjectId],
  messages: [messageSchema],
});

userSchema.statics.isRegistered = async function (user) {
  let result = {};
  result = await this.findOneAndUpdate(
    { email: user.email },
    {
      $setOnInsert: new userModel({
        name: user.name,
        email: user.email,
        gravatar: user.gravatar,
      }),
    },
    { upsert: true, new: true, runValidators: true },
    (err, doc) => {
      if (err) {
        console.log("Something wrong when updating data!");
      }
      return doc;
    }
  );
  return result;
};

const userModel = mongoose.model("User", userSchema);
export default userModel;
