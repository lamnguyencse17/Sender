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

io.on("connection", (socket) => {
  console.log(`New client connected ${socket.handshake.query["id"]}`);
  mockRoom.map((room) => {
    socket.join(room);
  });
  socket.on("error", function (err) {
    console.log("Socket.IO Error");
    console.log(err.stack); // this is changed from your code in last comment
  });
  socket.emit("subscribed-to", mockRoom);
  socket.on("client-sending-message", (message) => {
    console.log("RECEIVING NEW MESSAGE");
    io.sockets.in(message.room).emit("incoming-message", message);
    let newMessage = new messageModel({
      message: message.message,
      owner: mongoose.Types.ObjectId("5eabfa02f209780629cd9dfe"),
      room: mongoose.Types.ObjectId("5eabfa02f209780629cd9dff"),
    });
    newMessage.save((err, product) => {
      if (err) {
        console.log(err);
        return;
      }
      // TODO: REMOVE FROM SUBDOCUMENT EXCESS INFO + TRANSFER THIS TO SOMEWHERE ELSE PLEASE
      roomModel.update(
        {
          _id: mongoose.Types.ObjectId(product.room),
        },
        {
          $push: {
            messages: product,
          },
        },
        (err, any) => {
          if (err) {
            console.log(err);
            return;
          }
          console.log("ROOM UPDATE SUCCESSFULLY");
        }
      );
      userModel.update(
        {
          _id: mongoose.Types.ObjectId(product.owner),
        },
        {
          $push: {
            messages: product,
          },
        },
        (err, any) => {
          if (err) {
            console.log(err);
            return;
          }
          console.log("USER UPDATE SUCCESSFULLY");
        }
      );
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
      room: "everyone",
      id: index,
      message: mockData[index],
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

var mockRoom = ["everyone", "family", "exs"];
