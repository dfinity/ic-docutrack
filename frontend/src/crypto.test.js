const {generateUserKeypair, encryptForUser, decryptForUser } = require('./crypto');

test('generate key, encrypt and decrypt', async () => {
  plaintext = "blabla42";

  const key = await generateUserKeypair();
  const {
    privateKey,
    publicKey
  } = key;

  
  const encryptedText = await encryptForUser(plaintext, publicKey);

  const decryptedText = await decryptForUser(encryptedText, privateKey);

  expect(plaintext).toBe(decryptedText);
});