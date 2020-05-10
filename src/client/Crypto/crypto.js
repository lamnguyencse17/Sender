import forge from "node-forge";

export const validatePrivateKey = (privateKey) => {
  try {
    forge.pki.privateKeyFromPem(privateKey);
  } catch (err) {
    return false;
  }
  return true;
};

export const validatePublicKey = (publicKey) => {
  try {
    forge.pki.publicKeyFromPem(privateKey);
  } catch (err) {
    console.log(err)
    return false;
  }
  return true;
}

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
  publicKey = forge.pki.publicKeyFromPem("-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqElb2B7fz9/677K9gGPT8zTlfUxsTzGnwzUQp5Q+LfBmTqVXGdn5yvhan6OEnnR6JrJ4Ipx9Kr2bSAowyesFZjdv6NBnArxaQVsBEGZ6MxoXgQB8IxT7dwGXZii3SzlEkac+ZTIm1QIc//TRVE4z1Vww/sMx/HryuVzDOA3xz9skl/N2rUF6HHv4Xekuq8pZ5rcsjJUv4imjm3UbvRjXzGAvM8Y5V26ddej2OzlvuVQ3KVEoSCRNZ6SUKSv5uK7VI5bBsJ/Hi0ZbSb6CgtcUpRBR6KelR8j5SXqBXuDVfUcuIzUIiNSM/rlEnToQHWaRetF9u0uz7TU4j5FsHy/xhwIDAQAB-----END PUBLIC KEY-----");
  let encrypted = publicKey.encrypt(passphrase, "RSA-OAEP");
  encrypted = forge.util.encode64(encrypted)
  return encrypted;
};

export const encapsulator = async (
  content,
  publicKey = forge.pki.publicKeyFromPem(sessionStorage.getItem("publicKey"))
) => {
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
