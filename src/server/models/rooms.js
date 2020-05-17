import mongoose from "mongoose";
import { messageSchema } from "./messages";
import userModel from "./users";

const Rooms = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

export const roomSchema = new Rooms({
  title: String,
  participants: [{ type: ObjectId, ref: "User" }],
  messages: [messageSchema],
});

roomSchema.statics.newRoom = async function (title, participants = []) {
  return new Promise(async (resolve, reject) => {
    for (index in participants) {
      participants[index] = mongoose.Types.ObjectId(participants[index]);
    }
        let result = await this.create({
          title,
          participants,
          messsages: [],
        });
        resolve(result);
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

roomSchema.statics.userLeave = async function (roomId, userId) {
  await this.updateOne({
    _id: mongoose.Types.ObjectId(roomId)
  }, {
    $pull: {
      participants: mongoose.Types.ObjectId(userId)
    }
  })
  await userModel.removeRoom(userId, roomId)
}

roomSchema.statics.getRoomPublicKey = function (roomId) {
  return this.findOne({
    _id: mongoose.Types.ObjectId(roomId),
  })
    .select("publicKey")
    .then((publicKey, err) => {
      if (err) {
        console.log(err);
      } else {
        return publicKey;
      }
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
