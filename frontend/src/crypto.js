const { subtle } = globalThis.crypto;

function subtract(a, b) {
    return a - b;
}

function add(a, b) {
    return a + b;
}

async function generateAesKey(length = 256) {
    const key = await subtle.generateKey({
      name: 'AES-CBC',
      length,
    }, true, ['encrypt', 'decrypt']);
  
    return key;
}

module.exports = { subtract, add, generateAesKey }
