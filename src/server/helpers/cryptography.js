import crypto from "crypto";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
const algorithm = "aes-256-cbc";
const iv = Buffer.from(process.env.SALT);

export const encrypt = (text, passphrase = process.env.PASSPHRASE) => {
  // passphrase can be id
  let cipher = crypto.createCipheriv(algorithm, passphrase, iv);
  let encrypted = cipher.update(text, "utf-8", "hex");
  encrypted = encrypted + cipher.final("hex");
  return { encrypted, iv };
};

export const decrypt = (text, passphrase = process.env.PASSPHRASE) => {
  let encryptedText = Buffer.from(text, "hex");
  let decipher = crypto.createDecipheriv(algorithm, passphrase, iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf-8");
  return decrypted + decipher.final("utf-8");
};

export const rsaDecryptFromUser = (encrypted) => {
  // base64
  let temp = process.env.PRIVATE_KEY.split("\n");
  let privateKey = `${temp[0]}
${temp[1]}
${temp[2]}`;
  let result = crypto.privateDecrypt(
    privateKey,
    Buffer.from(encrypted, "base64")
  );
  return JSON.parse(result.toString("utf-8"));
};

export const rsaEncryptToUser = (plaintext, publicKey) => {
  console.log(publicKey);
  let temp = publicKey.split("\n");
  publicKey = `${temp[0]}
${temp[1]}
${temp[2]}`;
  plaintext = JSON.stringify(plaintext);
  let result = crypto.publicEncrypt(publicKey, Buffer.from(plaintext, "utf-8"));
  return result.toString("base64");
};

export const generateKeyPair = () => {
  return new Promise((resolve, reject) =>
    crypto.generateKeyPair(
      "rsa",
      {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: "spki",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs8",
          format: "pem",
          cipher: "aes-256-cbc",
          passphrase: "top secret",
        },
      },
      (err, publicKey, privateKey) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve({ publicKey, privateKey });
        }
      }
    )
  );
};
