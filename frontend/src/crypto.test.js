const {generateKeypair, encrypt, decrypt } = require('./crypto');

test('generate key, encrypt and decrypt', async () => {
  plaintext = "blabla42";

  const key = await generateKey();
  const {
    privateKey,
    publicKey
  } = await key;

  
  const encryptedText = await encrypt(plaintext, publicKey);

  const decryptedText = await decrypt(encryptedText, privateKeypair);

  expect(plaintext).toBe(decryptedText);
});