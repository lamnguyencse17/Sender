import forge, { cipher } from "node-forge";
import dotenv from "dotenv";
import path from "path";
const bytesToHex = forge.util.bytesToHex;
const publicKeyFromPem = forge.pki.publicKeyFromPem;

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
  let privateKey = `${temp[0]}` + "\n" + `${temp[1]}` + "\n" + `${temp[2]}`;
  let result = crypto.privateDecrypt(
    privateKey,
    Buffer.from(encrypted, "base64")
  );
  return JSON.parse(result.toString("utf-8"));
};

const randomString = () => {
  return new Promise((resolve, reject) =>
    forge.random.getBytes(16, (err, bytes) => {
      if (err) {
        reject(err);
      } else {
        resolve(bytes);
      }
    })
  );
};

const encryptContent = (content, passphrase, iv) => {
  let cipher = forge.cipher.createCipher("AES-CBC", passphrase);
  content = JSON.stringify(content);
  cipher.start({ iv });
  cipher.update(forge.util.createBuffer(content, "utf8"));
  cipher.finish();
  let output = cipher.output;
  return output.toHex();
};
const encryptPassphrase = (passphrase, publicKey) => {
  publicKey = publicKeyFromPem(publicKey);
  let encrypted = publicKey.encrypt(passphrase, "RSA-OAEP");
  encrypted = bytesToHex(encrypted);
  return encrypted;
};

export const encapsulation = async (content, publicKey) => {
  // encrypt Original Content
  let passphrase = await randomString();
  let iv = await randomString();
  let newContent = encryptContent(content, passphrase, iv);
  let newPassphrase = encryptPassphrase(passphrase, publicKey);
  return {
    passphrase: newPassphrase,
    iv: bytesToHex(iv),
    content: newContent,
  };
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
