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

const getUsersInRoom = (room) => {
  return Object.keys(io.sockets.adapter.rooms[room].sockets);
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
};

export const broadcastToRoom = async (messageObj, room) => {
  let sockets = getUsersInRoom(room);
  let encapsulated, id;
  sockets.forEach(async (socket) => {
    // user: socket
    Object.keys(socketMap).forEach(async (userId) => {
      if (socketMap[userId] == socket) {
        let publicKey = await userModel.getPublicKey(userId);
        encapsulated = await encapsulator(
          {
            id: messageObj._id,
            message: messageObj.message,
            owner: messageObj.owner,
            date: messageObj.date,
            room: messageObj.room,
          },
          publicKey
        );
        io.to(socket).emit("incoming-message", encapsulated);
      }
    });
  });
};
