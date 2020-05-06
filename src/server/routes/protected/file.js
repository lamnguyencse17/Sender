import express from "express";
const router = express.Router();
import { getFileFromGridFS } from "../../models/gridfs";

router.use("/file/:filename", async (req, res) => {
  // req.body: {email, name, gravatarURL}
  let filename = req.params.filename;
  let userId = req.body.id;
  getFileFromGridFS(filename, userId).then((file, err) => {
    if (err) {
      console.log(err);
    } else {
      res.setHeader("Content-Type", file.contentType);
      res.setHeader(
        "Content-Disposition",
        `attachment;filename=${file.filename}`
      );
      file.data.pipe(res);
    }
  });
});

module.exports = router;
