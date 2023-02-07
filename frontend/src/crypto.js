const { subtle } = globalThis.crypto;

function subtract(a, b) {
    return a - b;
}

function add(a, b) {
    return a + b;
}

async function generateKey() {
    const key = await subtle.generateKey({
        name: "RSA-OAEP",
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256"
    }, true, ['encrypt', 'decrypt']);
  
    return key;
}


async function encrypt(plaintext, publicKey) {
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


async function decrypt(encryptedText, privateKey) {
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



module.exports = { subtract, add, generateKey, encrypt, decrypt }
