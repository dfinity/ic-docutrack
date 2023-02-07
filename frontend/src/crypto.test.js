const { subtract, add, generateKey, encrypt, decrypt } = require('./crypto');

test('adds 1 and 2 to equal 3', () => {
  expect(add(1, 2)).toBe(3);
});

test('subtracts 3 and 2 to equal 1', () => {
  expect(subtract(3, 2)).toBe(1);
});

test('generate key, encrypt and decrypt', async () => {
  plaintext = "blabla42";

  const key = await generateKey();
  const {
    privateKey,
    publicKey
  } = await key;

  
  const encryptedText = await encrypt(plaintext, publicKey);

  const decryptedText = await decrypt(encryptedText, privateKey);

  expect(plaintext).toBe(decryptedText);
});