import mongoose, { mongo } from "mongoose";
import { messageSchema } from "./messages";

const Users = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

export const userSchema = new Users({
  name: String,
  email: String,
  gravatar: String,
  rooms: [{ type: ObjectId, ref: "Room" }],
  messages: [messageSchema],
  publicKey: { type: String, default: "" },
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
    }
  );
  return { ...result._doc, newUser: result.isNew };
};
userSchema.statics.getName = async function (userId) {
  return await this.findOne({ _id: userId }).select("name -_id");
};
userSchema.statics.setPublicKey = async function (userId, publicKey) {
  return this.update(
    { _id: mongoose.Types.ObjectId(userId) },
    {
      publicKey,
    }
  ).then((result, err) => {
    if (err) {
      console.log(err);
      return;
    } else {
      return result;
    }
  });
};
userSchema.statics.removeRoom = async function (userId, roomId) {
  return await this.updateOne(
    {
      _id: mongoose.Types.ObjectId(userId),
    },
    {
      $pull: {
        rooms: mongoose.Types.ObjectId(roomId),
      },
    }
  );
};
userSchema.statics.getPublicKey = async function (userId) {
  let result = await this.findOne({
    _id: mongoose.Types.ObjectId(userId),
  }).select("publicKey -_id");
  return result.publicKey;
};
userSchema.statics.addRoom = async function (userId, roomId) {
  return this.update(
    {
      _id: mongoose.Types.ObjectId(userId),
      rooms: {
        $ne: roomId,
      },
    },
    {
      $push: {
        rooms: mongoose.Types.ObjectId(roomId),
      },
    }
  ).then((result, err) => {
    if (err) {
      return { err };
    } else {
      return result;
    }
  });
};

const userModel = mongoose.model("User", userSchema);
export default userModel;
