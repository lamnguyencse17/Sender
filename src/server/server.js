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
import morgan from "morgan";
import forge from "node-forge";
import { getFileFromGridFS } from "./models/gridfs"
import { fileEncapsulator } from "./helpers/cryptography";
import { Readable } from "stream"

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
mongoose.connect(process.env.DATA_URI, { useNewUrlParser: true });
const SERVER_PORT = 3000;
const app = express();
app.use(cors());
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
  socket.on("disconnect", () => socketObj.onDisconnect());
  socket.on("error", (err) => socketObj.onError(err));
  socket.on("sending-file", (data) => socketObj.onClientSendingFile(data));
});

server.listen(SERVER_PORT, async () => {
  console.log(`Server running on port ${SERVER_PORT}`);
});

app.use("/api/protected/", checkJwt, require("./routes/routes"));

app.get("/", (req, res) => {
  getFileFromGridFS("1589184355-Lab06", "5ead918db81fd91d646e887b").then(async (file, err) => {
    if (err) {
      console.log(err);
    } else {
      let buf
      let bufs = []
      file.data.on("data", async data => {
        bufs.push(data)
      })
      file.data.on('end', async () => {
        buf = Buffer.concat(bufs)
        let sendData = await fileEncapsulator(buf, "-----BEGIN PUBLIC KEY----- MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuzyUWZQYAKT1fmpvI/sW bE2e4S0Jauh3qsZd2RwdAZlzH2zg1kUVxFLB6DhFEakVBelIYBwx/k1ZCSzVi7Cl XzOg/qSY+heF1Y2hjPEh1dh/IR3fTbS5HxyRvXNFn45Rjs+QxcrXQ9FcAS+46NAt k6yYpmmgOvoOJlcBNDwLDfi9pbE99IQVnvRheS0O3UVHedvSLw7j9EvtudZD0rlb iBpr5UELGpO8m0IyDV0oGAEfayiO8SSZ0u97jy2xuMt/r186j1FahMeVLDtB8SA8 zCZ/ER9biH/tKeyp6/72aS1UmDb53CT0JdtWYEZyEtBh5LBufY4QaJZXAJws40VT VwIDAQAB -----END PUBLIC KEY-----")
        res.setHeader("Content-Type", file.contentType);
        res.setHeader(
          "Content-Disposition",
          `attachment;filename=${file.filename}`
        );
        res.setHeader("passphrase", sendData.passphrase)
        res.setHeader("iv", sendData.iv)
        res.header("Access-Control-Expose-Headers", "passphrase, iv");
        res.status(200).send(sendData.data)
      })
    }
  });
})