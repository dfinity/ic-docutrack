const { subtle } = globalThis.crypto;
import { default as keyStorage } from "./keyStorage";

/**
 * @type {CryptoKey || null}
 * Public key associated with logged in device. Used to decrypt the symmetric secretKey,
 *  which is stored by the dapp encrypted with the the publicKey
 */
let publicKey = null;
/**
 * @type {CryptoKey || null}
 * private key associated with logged in device. Used to decrypt the symmetric secretKey,
 *  which is stored by the dapp encrypted with the the publicKey
 */
let privateKey = null;

/**
 * Fetch this browser's public key in 'spki' format.
 * If no keypair exists, one will be generated and stored in localStorage.
 *
 * @returns {Promise<ArrayBuffer>}
 */
async function getLocalUserPublicKey() {
  this.publicKey = await keyStorage.loadKey("public");
  this.privateKey = await keyStorage.loadKey("private");

  if (!this.publicKey || !this.privateKey) {
    const keypair = await subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["encrypt", "decrypt"]
    );
    await keyStorage.storeKey("public", keypair.publicKey);
    await keyStorage.storeKey("private", keypair.privateKey);
    this.publicKey = keypair.publicKey;
    this.privateKey = keypair.privateKey;
  }
  return await subtle.exportKey("spki", this.publicKey);
}

/**
 * @param {ArrayBuffer} plaintext
 * @param {ArrayBuffer} publicKey in 'spki' format
 * @returns {Promise<ArrayBuffer>} containing the encrypted version of the plaintext ArrayBuffer.
 */
async function encryptForUser(plaintext, publicKey) {
  const importedKey = await subtle.importKey(
    "spki",
    publicKey,
    {
      name: "RSA-OAEP",
      hash: { name: "SHA-256" },
    },
    true,
    ["encrypt"]
  );

  return await subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
    importedKey,
    plaintext
  );
}

/**
 * @param {ArrayBuffer} ciphertext
 * @returns {Promise<ArrayBuffer>} containing the decrypted version of the ciphertext ArrayBuffer
 */
async function decryptForUser(ciphertext) {
  if (!this.privateKey) {
    this.privateKey = await keyStorage.loadKey("private");
  }
  return await subtle.decrypt(
    {
      name: "RSA-OAEP",
    },
    this.privateKey,
    ciphertext
  );
}

/**
 * Create a symmetric key for a file in 'raw' format
 *
 * @returns {Promise<ArrayBuffer>}
 */
async function generateFileKey() {
  const key = await subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );

  return await subtle.exportKey("raw", key);
}

/**
 * @param {ArrayBuffer} file to encrypt
 * @param {ArrayBuffer} rawKey in 'raw' format
 * @returns {Promise<ArrayBuffer>} containing the encrypted version of the ciphertext ArrayBuffer (which must include the initialization vector in the first 12 bytes)
 */
async function encryptFile(file, rawKey) {
  const key = await subtle.importKey(
    "raw",
    rawKey,
    {
      name: "AES-GCM",
    },
    true,
    ["encrypt"]
  );
  // The iv must never be reused with a given key.
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    file
  );
  const length = ciphertext.byteLength + iv.byteLength;
  const cipherBuffer = new ArrayBuffer(length);
  const uint8view = new Uint8Array(cipherBuffer);
  uint8view.set(iv, 0);
  uint8view.set(new Uint8Array(ciphertext), iv.byteLength);
  return cipherBuffer;
}

/**
 * @param {ArrayBuffer} encryptedFile to decrypt
 * @param {ArrayBuffer} rawKey in 'raw' format
 * @returns {Promise<ArrayBuffer>} containing the encrypted version of the ciphertext ArrayBuffer (which must include the initialization vector in the first 12 bytes)
 */
async function decryptFile(encryptedFile, rawKey) {
  const key = await subtle.importKey(
    "raw",
    rawKey,
    {
      name: "AES-GCM",
    },
    true,
    ["decrypt"]
  );
  if (encryptedFile.length < 13) {
    throw new Error("wrong encoding, too short to contain iv");
  }
  const iv_decoded = new Uint8Array(encryptedFile.slice(0, 12));
  const cipher_decoded = encryptedFile.slice(12);

  return await subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv_decoded,
    },
    key,
    cipher_decoded
  );
}

export default {
  getLocalUserPublicKey,
  encryptForUser,
  decryptForUser,
  generateFileKey,
  encryptFile,
  decryptFile,
};
