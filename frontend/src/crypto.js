const { subtle } = globalThis.crypto;

async function generateUserKeypair() {
    const key = await subtle.generateKey({
        name: "RSA-OAEP",
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256"
    }, true, ['encrypt', 'decrypt']);
  
    return key;
}


async function encryptForUser(plaintext, publicKey) {
    const enc = new TextEncoder();
    const encodedMessage = enc.encode(plaintext);
    const encryptedText = await subtle.encrypt({
        name: "RSA-OAEP"
        },
        publicKey,
        encodedMessage
    )
    return encryptedText;
}


async function decryptForUser(encryptedText, privateKey) {
    const dec = new TextDecoder();
    const decryptedText = await subtle.decrypt({
        name: "RSA-OAEP"
      },
      privateKey,
      encryptedText
    )
    return dec.decode(decryptedText);
}

async function generateDocumentKey() {
    const key = await subtle.generateKey({
            name: 'AES-GCM',
            length: 256,
    }, true, ['encrypt', 'decrypt']);
  
    return key;
}

async function encryptDocument(data, key) {  
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

async function decryptDocument(data, key) {
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
    generateDocumentKey, encryptDocument, decryptDocument }