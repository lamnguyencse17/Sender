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

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
mongoose.connect(process.env.DATA_URI, { useNewUrlParser: true });
const SERVER_PORT = 3000;
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const server = http.createServer(app);
const io = setio(server);

io.on("connection", (socket) => {
  let socketObj = new socketHandler();
  socketObj.setSocket(io, socket);
  socket.on("client-sending-message", (message) => {
    socketObj.onClientSendingMessage(message);
  });
  socket.on("disconnect", () => socketObj.onDisconnect());
  socket.on("error", (err) => socketObj.onError(err));
  socket.on("sending-file", (data) => socketObj.onClientSendingFile(data));
});

server.listen(SERVER_PORT, () =>
  console.log(`Server running on port ${SERVER_PORT}`)
);

app.use("/api/protected/", checkJwt, require("./routes/routes"));
app.get("/", (req, res) => {
  res.send("YES");
});
