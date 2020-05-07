// const MongoClient = require("mongodb").MongoClient;
import { MongoClient, GridFSBucket } from "mongodb";
import roomSchema from "./rooms";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

let connection;
export const writeToGridFS = (file) => {
  return new Promise((resolve, reject) =>
    mongoConnection()
      .then(async (client) => {
        file.name = `${Math.round(new Date().getTime() / 1000)}-${file.name}`;
        let gridFSBucket = new GridFSBucket(client.db(), {
          bucketName: "attachments",
        });
        gridFSBucket.openUploadStream(file.name, {
          contentType: file.type,
          metadata: {
            owner: file.owner,
            date: Date.now(),
            room: file.room,
          },
        });
        bucket.write(file.data, async (err) => {
          if (err) {
            reject(err);
          }
        });
        bucket.end(async (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      })
      .catch(async (err) => {
        reject(err);
      })
  );
};

export const getFileFromGridFS = (filename, userId) => {
  return new Promise((resolve, reject) =>
    mongoConnection()
      .then(async (client) => {
        let gridFSBucket = new GridFSBucket(client.db(), {
          bucketName: "attachments",
        });
        let file = await gridFSBucket
          .find({ filename: { $regex: filename } })
          .toArray();
        filename = file[0].filename;
        let roomId = file[0].metadata.room;
        let result = await roomSchema.isUserInRoom(roomId, userId);
        if (result) {
          resolve({
            filename,
            contentType: file[0].contentType,
            data: gridFSBucket.openDownloadStreamByName(filename),
          });
        } else {
          reject(
            "No permission or something went really really wrong deep down the rabbit hole"
          );
        }
      })
      .catch(async (err) => {
        reject(err);
      })
  );
};

const mongoConnection = () => {
  return new Promise((resolve, reject) => {
    if (connection) resolve(connection);
    MongoClient.connect(process.env.DATA_URI, (err, db) => {
      if (err) reject(err);
      connection = db;
      resolve(connection);
    });
  });
};
