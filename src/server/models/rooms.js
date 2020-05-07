import mongoose from "mongoose";
import { messageSchema } from "./messages";
import userModel from "./users";
import { generateKeyPair, encrypt, decrypt } from "../helpers/cryptography";
import { resolveInclude } from "ejs";

const Rooms = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

export const roomSchema = new Rooms({
  title: String,
  participants: [{ type: ObjectId, ref: "User" }],
  messages: [messageSchema],
  publicKey: { type: String, default: "" },
  privateKey: { type: String, default: "" },
});

roomSchema.statics.newRoom = async function (title, participants = []) {
  return new Promise((resolve, reject) => {
    for (index in participants) {
      participants[index] = mongoose.Types.ObjectId(participants[index]);
    }
    generateKeyPair().then(async (keyPair, err) => {
      if (err) {
        reject(err);
      } else {
        let result = await this.create({
          title,
          participants,
          messsages: [],
          publicKey: encrypt(keyPair.publicKey).encrypted,
          privateKey: encrypt(keyPair.privateKey).encrypted,
        });
        resolve({
          ...result,
          publicKey: keyPair.publicKey,
          privateKey: keyPair.privateKey,
        });
      }
    });
  });
};

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

roomSchema.statics.isUserInRoom = async function (roomId, userId) {
  return await this.exists({
    _id: mongoose.Types.ObjectId(roomId),
    participants: { $in: [mongoose.Types.ObjectId(userId)] },
  });
};

roomSchema.statics.addToRoom = async function (roomId, userId) {
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
