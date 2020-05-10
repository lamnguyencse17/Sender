import socketio from "socket.io";
import { encapsulator } from "../helpers/cryptography";
import userModel from "../models/users";

let io;
let socketMap = {};

export const setio = (server) => {
  io = socketio(server);
  return io;
};

export const getio = () => {
  return io;
};

export const addToSocketMap = (userId, socketId) => {
  socketMap[userId] = socketId;
  console.log(socketMap);
};

export const announceNewUser = (roomId, name) => {
  io.sockets.in(roomId).emit("new-user", {
    room: roomId,
    message: `${name} joined the room`,
    date: Date.now(),
  });
  return res.status(200).json({ message: result.message });
};

export const broadcastToRoom = async (messageObj, id) => {
  let encapsulated = await encapsulator(
    {
      id: messageObj._id,
      message: messageObj.message,
      owner: messageObj.owner,
      date: messageObj.date,
      room: messageObj.room,
    },
    await userModel.getPublicKey(id) // room key
  );
  io.to(socketMap[id]).emit("incoming-message", encapsulated);
  // io.sockets.in(messageObj.room).emit("incoming-message", encapsulated);
};
