import mongoose from "mongoose";

const Messages = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

export const messageSchema = new Messages({
  message: String,
  owner: { type: ObjectId, ref: "User" },
  room: { type: ObjectId, ref: "Room" },
  date: { type: Date, default: Date.now },
});

messageSchema.post("save", function (doc) {
  this.model("User").update(
    {
      _id: mongoose.Types.ObjectId(doc.owner),
    },
    {
      $push: {
        messages: doc,
      },
    },
    (err) => {
      if (err) {
        throw err;
      }
    }
  );
  this.model("Room").update(
    {
      _id: doc.room,
    },
    {
      $push: {
        messages: doc,
      },
    },
    (err) => {
      if (err) {
        throw err;
      }
    }
  );
});

const messageModel = mongoose.model("Message", messageSchema);
export default messageModel;
