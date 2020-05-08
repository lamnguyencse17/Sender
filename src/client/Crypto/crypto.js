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
