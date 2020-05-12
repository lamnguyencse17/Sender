import express from "express";
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const router = express.Router();
import { getFileFromGridFS } from "../../models/gridfs";
import {fileEncapsulator } from "../../helpers/cryptography"

router.use("/file/:filename", async (req, res) => {
  // req.body: {email, name, gravatarURL}
  let filename = req.params.filename;
  let userId = req.headers.id;
  getFileFromGridFS(filename, userId).then(async (file, err) => {
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
  // getFileFromGridFS(filename, userId).then((file, err) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     res.setHeader("Content-Type", file.contentType);
  //     res.setHeader(
  //       "Content-Disposition",
  //       `attachment;filename=${file.filename}`
  //     );
  //     file.data.pipe(res);
  //   }
  // });
});

module.exports = router;
