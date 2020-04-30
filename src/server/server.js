import http from "http";
import express from "express";
import socketio from "socket.io";
import cors from "cors";

const SERVER_PORT = 3000;
const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketio(server);

io.on("connection", (socket) => {
  console.log(`New client connected ${socket.handshake.query["id"]}`);
  mockRoom.map((room) => {
    socket.join(room);
  });
  if (interval) {
    clearInterval(interval);
  }
  socket.on("client-sending-message", (message) => {
    io.sockets.in(message.room).emit("incoming-message", message.content);
  });
  let interval = setInterval(() => getApiAndEmit(socket), Math.random() * 5000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    socket.leaveAll();
    clearInterval(interval);
  });
});

const getApiAndEmit = (socket) => {
  const response = new Date();
  if (counter > 4) {
    socket.emit("End", "Ended Mock");
  }
  socket.emit("FromAPI", mockData[`id${counter}`]);
  counter = counter + 1;
};

server.listen(SERVER_PORT, () =>
  console.log(`Server running on port ${SERVER_PORT}`)
);
let counter = 1;
var mockData = {
  id1: "Hello 1",
  id2: "Hello 2",
  id3: "Hello 3",
  id4: "Hello 4",
};

var mockRoom = ["everyone", "family", "exs"];
