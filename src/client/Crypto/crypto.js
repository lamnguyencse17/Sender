import forge from "node-forge";

export const validatePrivateKey = (privateKey) => {
  // rewrite as Promise
  try {
    forge.pki.privateKeyFromPem(privateKey);
  } catch (err) {
    return false;
  }
  return true;
};

export const fileDecapsulator = async (data, iv, passphrase) => {
  data = forge.util.createBuffer(data, "raw");
  let privateKey = sessionStorage.getItem("privateKey");
  passphrase = decryptPassphrase(passphrase, privateKey);
  iv = forge.util.hexToBytes(iv);
  let decipher = forge.cipher.createDecipher("AES-CBC", passphrase);
  decipher.start({ iv });
  decipher.update(data);
  decipher.finish();
  return Buffer.from(decipher.output.getBytes(), "binary");
};

export const fileEncapsulator = async (file) => {
  // fileByte read from outside
  file = await file.arrayBuffer().then((buffer) => {
    return buffer;
  });
  let passphrase = await randomString();
  let iv = await randomString();
  let cipher = forge.cipher.createCipher("AES-CBC", passphrase);
  cipher.start({ iv });
  cipher.update(forge.util.createBuffer(file));
  cipher.finish();
  let publicKey = sessionStorage.getItem("serverPublicKey");
  let newPassphrase = await encryptPassphrase(
    passphrase,
    forge.pki.publicKeyFromPem(publicKey)
  );
  return {
    data: Buffer.from(cipher.output.getBytes(), "binary"),
    iv: forge.util.bytesToHex(iv),
    passphrase: newPassphrase,
  };
};

export const validatePublicKey = (publicKey) => {
  try {
    forge.pki.publicKeyFromPem(publicKey);
  } catch (err) {
    console.log(err);
    return false;
  }
  return true;
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

const decryptPassphrase = (passphrase, privateKey) => {
  privateKey = forge.pki.privateKeyFromPem(privateKey);
  passphrase = forge.util.hexToBytes(passphrase);
  let decrypted = privateKey.decrypt(passphrase, "RSA-OAEP");
  return decrypted;
};
// content -> stringify -> buffer -> hex -> content
const decryptContent = (content, passphrase, iv) => {
  content = forge.util.hexToBytes(content);
  let decipher = forge.cipher.createDecipher("AES-CBC", passphrase);
  decipher.start({ iv: forge.util.hexToBytes(iv) });
  decipher.update(forge.util.createBuffer(content, "raw"));
  decipher.finish();
  let output = decipher.output;
  return JSON.parse(output);
};

export const decapsulator = (encrypted) => {
  let privateKey = sessionStorage.getItem("privateKey");
  let passphrase = decryptPassphrase(encrypted.passphrase, privateKey);
  let result = decryptContent(encrypted.content, passphrase, encrypted.iv);
  return result;
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
  let encrypted = publicKey.encrypt(passphrase, "RSA-OAEP");
  encrypted = forge.util.encode64(encrypted);
  return encrypted;
};

export const encapsulator = async (content) => {
  let publicKey = forge.pki.publicKeyFromPem(
    sessionStorage.getItem("serverPublicKey")
  );
  let passphrase = await randomString();
  let iv = await randomString();
  let newContent = encryptContent(content, passphrase, iv);
  let newPassphrase = encryptPassphrase(passphrase, publicKey);
  return {
    passphrase: newPassphrase,
    iv: forge.util.bytesToHex(iv),
    content: newContent,
  };
};
