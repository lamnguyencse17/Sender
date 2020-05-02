import http from "http";
import express from "express";
import socketio from "socket.io";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import path from "path";
import socketHandler from "./socket/socketHandler";
import checkJwt from "./helpers/checkJwt";

mongoose.connect("mongodb://localhost:27017/Sender", { useNewUrlParser: true });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
const SERVER_PORT = 3000;
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const server = http.createServer(app);
const io = socketio(server);

io.on("connection", (socket) => {
  let socketObj = new socketHandler();
  socketObj.setSocket(io, socket);
  socket.on("client-sending-message", (message) =>
    socketObj.onClientSendingMessage(message)
  );
  socket.on("disconnect", () => socketObj.onDisconnect());
  socket.on("error", (err) => socketObj.onError(err));
});

server.listen(SERVER_PORT, () =>
  console.log(`Server running on port ${SERVER_PORT}`)
);

app.get("/api/protected/", checkJwt, (req, res) => {
  res.send("YES");
});
