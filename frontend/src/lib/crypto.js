const { subtle } = globalThis.crypto;


// Return RSA key pair for user
async function generateUserKeypair() {
    const key = await subtle.generateKey({
        name: "RSA-OAEP",
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256"
    }, true, ['encrypt', 'decrypt']);
  
    return key;
}

// Return an ArrayBuffer containing the encrypted version of the plaintext ArrayBuffer
async function encryptForUser(plaintext, publicKey) {
    const ciphertext = await subtle.encrypt({
        name: "RSA-OAEP"
        },
        publicKey,
        plaintext
    )
    return ciphertext;
}


// Return an ArrayBuffer containing the decrypted version of the ciphertext ArrayBuffer
async function decryptForUser(ciphertext, privateKey) {
    const decrypted = await subtle.decrypt({
        name: "RSA-OAEP"
      },
      privateKey,
      ciphertext
    )
    return decrypted;
}

// Return AES-GCM key
async function generateFileKey() {
    const key = await subtle.generateKey({
            name: 'AES-GCM',
            length: 256,
    }, true, ['encrypt', 'decrypt']);
  
    return key;
}


// Return an ArrayBuffer containing the encrypted version of the plaintext ArrayBuffer, including the initialization vector
async function encryptFile(data, key) {  
    // The iv must never be reused with a given key.
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ciphertext = await subtle.encrypt(
                    {
                        name: "AES-GCM",
                        iv: iv
                    },
                    key,
                    data
                    );
    const length = ciphertext.byteLength + iv.byteLength;
    const cipherBuffer = new ArrayBuffer(length);
    const uint8view = new Uint8Array(cipherBuffer);
    uint8view.set(iv, 0);
    uint8view.set(new Uint8Array(ciphertext), iv.byteLength);
    return cipherBuffer;
}


// Return an ArrayBuffer containing the decrypted version of the ciphertext ArrayBuffer (which must include the initialization vector in the first 12 bytes)
async function decryptFile(data, key) {
    if (data.length < 13) {
        throw new Error('wrong encoding, too short to contain iv');
    }
    const iv_decoded = new Uint8Array(data.slice(0,12));
    const cipher_decoded = data.slice(12);

    let decrypted_data_encoded = await subtle.decrypt(
                    {
                      name: "AES-GCM",
                      iv: iv_decoded
                    },
                    key,
                    cipher_decoded
                  );
    return decrypted_data_encoded;
}

module.exports = {generateUserKeypair, encryptForUser, decryptForUser,
    generateFileKey, encryptFile, decryptFile }
