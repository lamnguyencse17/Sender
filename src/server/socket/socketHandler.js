import roomModel from "../models/rooms";
import messageModel from "../models/messages";
import userModel from "../models/users";
import mongoose from "mongoose";
import { writeToGridFS } from "../models/gridfs";
import { broadcastToRoom } from "../socket/socketio";
const Duplex = require("stream").Duplex;

class socketHandler {
  constuctor() {
    this.socket = null;
    this.io = null;
    this.id = null;
  }
  setSocket = async (io, socket) => {
    this.io = io;
    this.socket = socket;
    this.id = socket.handshake.query["id"];
    console.log(`New client connected ${this.id}`);
    let rooms = await roomModel.getSubscribedRoom(this.id);
    let subscribedRooms = {};
    rooms.forEach((room) => {
      subscribedRooms = {
        ...subscribedRooms,
        [room._id]: { title: room.title, participants: room.participants },
      };
      socket.join(room._id);
    });
    socket.emit("subscribed-to", subscribedRooms);
    rooms.forEach((room) => {
      if (room.messages.length != 0) {
        socket.emit("sync-messages", lastMessages(room.messages, 5));
      }
    });
  };

  onClientSendingFile = async (fileObj) => {
    writeToGridFS(fileObj).then(async (result, err) => {
      if (err) {
        console.log(err);
      } else {
        let { name } = await userModel.getName(fileObj.owner);
        let newMessage = new messageModel({
          message: `${name} share a file at: http://127.0.0.1:8080/file/${fileObj.name}`,
          owner: mongoose.Types.ObjectId(fileObj.owner),
          room: mongoose.Types.ObjectId(fileObj.room),
          date: fileObj.date,
        });
        newMessage.save((err, product) => {
          if (err) {
            console.log(err);
            return;
          } else {
            broadcastToRoom(product);
          }
        });
      }
    });
    // flow: get file -> write to gridfs -> make a link -> return a link -> encode as message with file name
    // model: collect filedata, file
  };
  onClientSendingMessage = (message) => {
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
        broadcastToRoom({
          id: product._id,
          message: product.message,
          owner: product.owner,
          date: product.date,
          room: product.room,
        });
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
}

const lastMessages = (messageList, n) => {
  if (messageList == null) return void 0;
  if (n == null) return messageList[messageList.length - 1];
  return messageList.slice(Math.max(messageList.length - n, 0));
};

export default socketHandler;
