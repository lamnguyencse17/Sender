import http from "http";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import path from "path";
import socketHandler from "./socket/socketHandler";
import checkJwt from "./helpers/checkJwt";
import { setio } from "./socket/socketio";
import compression from "compression";
import morgan from "morgan";
import forge from "node-forge";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
mongoose.connect(process.env.DATA_URI, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const SERVER_PORT = 3000;
const app = express();
app.use(cors());
app.use(compression());
app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const server = http.createServer(app);
const io = setio(server);

forge.pki.privateKeyFromPem(process.env.PRIVATE_KEY);

io.on("connection", async (socket) => {
  let socketObj = new socketHandler();
  socketObj.setSocket(socket);
  socketObj.providePublicKey();
  socket.on("client-sending-message", (message) => {
    socketObj.onClientSendingMessage(message);
  });
  socket.on("sync", () => socketObj.syncData());
  socket.on("disconnect", () => socketObj.onDisconnect());
  socket.on("error", (err) => socketObj.onError(err));
  socket.on("sending-file", (data) => socketObj.onClientSendingFile(data));
  socket.on("client-leave-room", (roomId) => {
    socketObj.onLeave(roomId);
  });
  socket.on("client-add-new-room", (roomName) => {
    socketObj.onClientAddNewRoom(roomName);
  });
});

server.listen(process.env.PORT || SERVER_PORT, async () => {
  console.log(`Server running on port ${SERVER_PORT}`);
});

app.use("/api/protected/", checkJwt, require("./routes/routes"));
