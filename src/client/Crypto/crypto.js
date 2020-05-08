import forge from "node-forge";

export const validatePrivateKey = (privateKey) => {
  try {
    forge.pki.privateKeyFromPem(privateKey);
  } catch (err) {
    return false;
  }
  return true;
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

export const decapsulation = (encrypted) => {
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
  publicKey = publicKeyFromPem(publicKey);
  let encrypted = publicKey.encrypt(passphrase, "RSA-OAEP");
  encrypted = bytesToHex(encrypted);
  return encrypted;
};

export const encapsulation = async (content, publicKey) => {
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
