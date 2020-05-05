import socketio from "socket.io";
let io;

export const setio = (server) => {
  io = socketio(server);
  return io;
};

export const getio = () => {
  return io;
};

export const announceNewUser = (roomId, name) => {
  io.sockets.in(roomId).emit("new-user", {
    room: roomId,
    message: `${name} joined the room`,
    date: Date.now(),
  });
  return res.status(200).json({ message: result.message });
};
