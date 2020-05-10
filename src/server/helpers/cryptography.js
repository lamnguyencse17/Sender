import forge, { cipher } from "node-forge";
import dotenv from "dotenv";
import path from "path";
const bytesToHex = forge.util.bytesToHex;
const publicKeyFromPem = forge.pki.publicKeyFromPem;

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

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

export const encapsulator = async (content, publicKey) => {
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

const decryptPassphrase = (passphrase, privateKey) => {
  privateKey = forge.pki.privateKeyFromPem(privateKey);
  let decrypted = privateKey.decrypt(forge.util.decode64(passphrase), "RSA-OAEP");
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
  let privateKey = "-----BEGIN RSA PRIVATE KEY-----MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCoSVvYHt/P3/rvsr2AY9PzNOV9TGxPMafDNRCnlD4t8GZOpVcZ2fnK+Fqfo4SedHomsnginH0qvZtICjDJ6wVmN2/o0GcCvFpBWwEQZnozGheBAHwjFPt3AZdmKLdLOUSRpz5lMibVAhz/9NFUTjPVXDD+wzH8evK5XMM4DfHP2ySX83atQXoce/hd6S6rylnmtyyMlS/iKaObdRu9GNfMYC8zxjlXbp116PY7OW+5VDcpUShIJE1npJQpK/m4rtUjlsGwn8eLRltJvoKC1xSlEFHop6VHyPlJeoFe4NV9Ry4jNQiI1Iz+uUSdOhAdZpF60X27S7PtNTiPkWwfL/GHAgMBAAECggEAMIDcSOE1LsvmnnmM5tle+GURk9iYCwdLzBaaU0KF3WXBhv9eqGPL/DUyoXpWufjmUAr2Vzt1VAFMJSpSv4/OgZSO27JdTkuNU/LvzpNKuznU9mh2XwIoLDe4NEid879wxO5ILJCU4qX2R8t/HeZgSCmHMZZ+7L9fAA/9cEWMoZSWW2GZM4/79VdIaZqVGWc7WTr1S2u959NfZVAsKtpdheP/sip7yWqc1HWbU5qppHHKID4k3AfbpYdDusMt28iwpJ5vJ5JFW9UN0FFPvLKPbQh/JirADDKWuOx5ARUSLhFa1oyWxfwInAbZAWqepq7LcRMTzgR2xHo7q0w4N5vqEQKBgQDqz01iUBA5mepevR0HdlV14IZd1e1PdLaM0E7KmUoFSbzhuh0QhSwTjeE6Gzg/mIxkakZl5Fb9eVCNgEo9ugg+CgmULwauVwc4d2Ai4R7KGzufHGRn8hOP2Och0ql6U8a+Pj8wNKMYTCGWvGtiLnJm8bUE0Yoe/Y6+wi+l85zHvwKBgQC3eTPVpxtwOaolzpDIN42FBqI84Susf7OVh9alj3AAWy2u1jX5babQH22rOMQPrlkPv0u+cY/eMKuyK7jrE+9SmXZbmXV4C61ksnohC2M0Yo5DAUF2FNKNNl0N6UvYL3UtChbh7hojCnMSjwxKMZ0//dXBT6uIwL5r9SXEw1aIOQKBgEnr6VjCC9mWcwpQTwtCXbU2chaoeoVBIRdDnQp7J6pyhFwr02qYAkBFslowp4yd4dTbAD6jnB9ASfPCJ503K9EcJ9fW1iucilFkg4d3h9HosORuc82lkDMA/gLP5zrzlOXfgtUSPSYxEYH633ORW8K85VgW/3yyJnY3e/iqsPjRAoGAZ3If5qu0jb8FjxF7kle4JDPMT5UJgdXylDGltW09UgYWqMhAYGURs7C0reBwswKzVmyeMT9oRXedpvR965Uuz5yVHipVEB1NY0Q6Fd2MzqFu4pqXpRMyb8oiB1DtoXOIlp9krXgJJo6iuOkMndyBc+4Tkk3wQkeiVc4/wEP+ywkCgYANjo+x0vUJI1nFCumOf5lD0J7qIEXpozGD6t+RLy4t9Zv7wli2isUb66AY+gXQvgUFgfp2zcKVo5YkveGdac1r9lc/6o8tE/CCxQNXH7t3ZdNY1TUOOllpk6mxBbPv3XwEfluB4/AC3CaRW/j7r5eJAYsspCgdltY96/8ex0+ZWA==-----END RSA PRIVATE KEY-----"
  let passphrase = decryptPassphrase(encrypted.passphrase, privateKey);
  let result = decryptContent(encrypted.content, passphrase, encrypted.iv);
  return result;
};

export const validatePrivateKey = (privateKey) => {
  try {
    forge.pki.privateKeyFromPem(privateKey);
  } catch (err) {
    return false;
  }
  return true;
};

export const generateKeyPair = () => {
  return new Promise((resolve, reject) =>
    forge.pki.rsa.generateKeyPair(
      { bits: 2048, workers: 2 },
      (err, keypair) => {
        if (err) {
          console.log(err);
        } else {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            let { publicKey, privateKey } = keypair;
            publicKey = forge.pki.publicKeyToPem(publicKey);
            privateKey = forge.pki.privateKeyToPem(privateKey);
            console.log(publicKey);
            console.log(privateKey);
            resolve({ publicKey, privateKey });
          }
        }
      }
    )
  );
};
