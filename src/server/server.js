import http from "http";
import express from "express";
import socketio from "socket.io";
import cors from "cors";
import mongoose from "mongoose";
import messageModel from "./models/messages";
import roomModel from "./models/rooms";
import userModel from "./models/users";

mongoose.connect("mongodb://localhost:27017/Sender", { useNewUrlParser: true });

const SERVER_PORT = 3000;
const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketio(server);

io.on("connection", async (socket) => {
  console.log(`New client connected ${socket.handshake.query["id"]}`);
  let rooms = await roomModel.getSubscribedRoom();
  for (let room in rooms) {
    let id = rooms[room];
    socket.join(id);
  }
  socket.on("error", function (err) {
    console.log("Socket.IO Error");
    console.log(err.stack); // this is changed from your code in last comment
  });
  socket.emit("subscribed-to", rooms);
  socket.on("client-sending-message", (message) => {
    console.log(message);
    io.sockets.in(message.room).emit("incoming-message", message);
    let newMessage = new messageModel({
      message: message.message,
      owner: mongoose.Types.ObjectId(message.owner),
      room: mongoose.Types.ObjectId("5eabfa02f209780629cd9dff"), //room goes herre later
    });
    newMessage.save((err) => {
      if (err) {
        console.log(err);
        return;
      }
    });
  });
  socket.on("disconnect", () => {
    socket.leaveAll();
    if (socket.disconnected) {
      console.log("Client disconnected");
    }
  });
  Object.keys(mockData).forEach((index) => {
    socket.emit("FromAPI", {
      room: "5eabfa02f209780629cd9dff",
      id: index,
      message: mockData[index],
      owner: "5eabfa02f209780629cd9dfe",
      date: Date.now(),
    });
  });
});

server.listen(SERVER_PORT, () =>
  console.log(`Server running on port ${SERVER_PORT}`)
);
var mockData = {
  id1: "Hello 1",
  id2: "Hello 2",
  id3: "Hello 3",
  id4: "Hello 4",
};
