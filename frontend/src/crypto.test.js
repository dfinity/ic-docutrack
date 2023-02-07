const {generateKeypair, encrypt, decrypt } = require('./crypto');

test('generate key, encrypt and decrypt', async () => {
  plaintext = "blabla42";

  const key = await generateKeypair();
  const {
    privateKey,
    publicKey
  } = await key;

  
  const encryptedText = await encrypt(plaintext, publicKey);

  const decryptedText = await decrypt(encryptedText, privateKey);

  expect(plaintext).toBe(decryptedText);
});