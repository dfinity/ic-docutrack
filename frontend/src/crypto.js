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
    console.log(typeof encryptedText);
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
    const data_encoded = Uint8Array.from([...data].map(ch => ch.charCodeAt(0))).buffer
    // The iv must never be reused with a given key.
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ciphertext = await subtle.encrypt(
                    {
                        name: "AES-GCM",
                        iv: iv
                    },
                    key,
                    data_encoded
                    );

    const iv_decoded = String.fromCharCode(...new Uint8Array(iv));
    const cipher_decoded = String.fromCharCode(...new Uint8Array(ciphertext));
    return iv_decoded + cipher_decoded;
}

async function decryptDocument(data, key) {
    if (data.length < 13) {
        throw new Error('wrong encoding, too short to contain iv');
    }
    const iv_decoded = data.slice(0,12);
    const cipher_decoded = data.slice(12);
    const iv_encoded = Uint8Array.from([...iv_decoded].map(ch => ch.charCodeAt(0))).buffer;
    const ciphertext_encoded = Uint8Array.from([...cipher_decoded].map(ch => ch.charCodeAt(0))).buffer;

    let decrypted_data_encoded = await subtle.decrypt(
                    {
                      name: "AES-GCM",
                      iv: iv_encoded
                    },
                    key,
                    ciphertext_encoded
                  );
    const decrypted_data_decoded = String.fromCharCode(...new Uint8Array(decrypted_data_encoded));
    return decrypted_data_decoded;
}

module.exports = {generateUserKeypair, encryptForUser, decryptForUser,
    generateDocumentKey, encryptDocument, decryptDocument }
