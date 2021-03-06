import roomModel from "../models/rooms";
import messageModel from "../models/messages";
import userModel from "../models/users";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { writeToGridFS } from "../models/gridfs";
import { broadcastToRoom, addToSocketMap } from "../socket/socketio";
import {
  encapsulator,
  decapsulator,
  fileDecapsulator,
} from "../helpers/cryptography";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

class socketHandler {
  constuctor() {
    this.socket = null;
    this.id = null;
    this.publicKey = null;
  }
  setSocket = async (socket) => {
    this.socket = socket;
    this.id = socket.handshake.query["id"];
    addToSocketMap(socket.handshake.query["id"], socket.id);
    this.publicKey = await userModel.getPublicKey(this.id);
    console.log(`New client connected ${this.id}`);
  };
  syncData = async () => {
    let rooms = await roomModel.getSubscribedRoom(this.id);
    let subscribedRooms = {};
    rooms.forEach((room) => {
      subscribedRooms = {
        ...subscribedRooms,
        [room._id]: {
          title: room.title,
          participants: room.participants,
        },
      };
      this.socket.join(room._id);
    });
    let encapsulated = await encapsulator(subscribedRooms, this.publicKey);
    this.socket.emit("subscribed-to", encapsulated);
    rooms.forEach(async (room) => {
      if (room.messages.length != 0) {
        encapsulated = await encapsulator(
          lastMessages(room.messages, 5),
          this.publicKey
        );
        this.socket.emit("sync-messages", encapsulated);
      }
    });
  };
  providePublicKey = async () => {
    let encapsulated = await encapsulator(
      { publicKey: process.env.PUBLIC_KEY },
      await userModel.getPublicKey(this.id)
    );
    this.socket.emit("provide-key", encapsulated);
  };
  onClientSendingFile = async (fileObj) => {
    let result = await fileDecapsulator(
      fileObj.data,
      fileObj.iv,
      fileObj.passphrase
    );
    fileObj.data = result;
    fileObj.name = path.parse(fileObj.name).name;
    writeToGridFS(fileObj).then(async (result, err) => {
      if (err) {
        console.log(err);
      } else {
        let { name } = await userModel.getName(fileObj.owner);
        let newMessage = new messageModel({
          message: `${name} share a file at: http://localhost:8080/file/${fileObj.name}`,
          owner: mongoose.Types.ObjectId(fileObj.owner),
          room: mongoose.Types.ObjectId(fileObj.room),
          date: fileObj.date,
        });
        newMessage.save((err, product) => {
          if (err) {
            console.log(err);
            return;
          } else {
            broadcastToRoom(product, fileObj.room);
          }
        });
      }
    });
    // flow: get file -> write to gridfs -> make a link -> return a link -> encode as message with file name
    // model: collect filedata, file
  };
  onClientSendingMessage = async (message) => {
    message = await decapsulator(message);
    let newMessage = new messageModel({
      message: message.message,
      owner: mongoose.Types.ObjectId(message.owner),
      room: mongoose.Types.ObjectId(message.room),
    });
    newMessage.save((err, product) => {
      if (err) {
        console.log(err);
        return;
      } else {
        broadcastToRoom(
          {
            id: product._id,
            message: product.message,
            owner: product.owner,
            date: product.date,
            room: product.room,
          },
          product.room
        );
      }
    });
  };
  onDisconnect = () => {
    this.socket.leaveAll();
    if (this.socket.disconnected) {
      console.log("Client disconnected");
    }
  };
  onError = (err) => {
    console.log("Socket.IO Error");
    console.log(err.stack);
  };
  onLeave = (roomId) => {
    roomModel.userLeave(roomId, this.id);
    this.socket.leave(roomId);
  };
  onClientAddNewRoom = async (roomName) => {
    let result = await roomModel.addNewRoom(roomName, this.id);
    this.socket.join(result._id);
    let rooms = await roomModel.getSubscribedRoom(this.id);
    let subscribedRooms = {};
    rooms.forEach((room) => {
      subscribedRooms = {
        ...subscribedRooms,
        [room._id]: {
          title: room.title,
          participants: room.participants,
        },
      };
    });
    let encapsulated = await encapsulator(subscribedRooms, this.publicKey);
    this.socket.emit("subscribed-to", encapsulated);
    rooms.forEach(async (room) => {
      if (room.messages.length != 0) {
        encapsulated = await encapsulator(
          lastMessages(room.messages, 5),
          this.publicKey
        );
        this.socket.emit("sync-messages", encapsulated);
      }
    });
  };
}

const lastMessages = (messageList, n) => {
  if (messageList == null) return {};
  if (n == null) return messageList[messageList.length - 1];
  return messageList.slice(Math.max(messageList.length - n, 0));
};

export default socketHandler;
