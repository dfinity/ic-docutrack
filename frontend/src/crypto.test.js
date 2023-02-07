const {generateUserKeypair, encryptForUser, decryptForUser,
  generateDocumentKey, encryptDocument, decryptDocument } = require('./crypto');

test('generate User key, encrypt and decrypt', async () => {
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

test('generate Document key, encrypt and decrypt', async () => {
  plaintext = "blabla42";

  const key = await generateDocumentKey();
  
  const encryptedText = await encryptDocument(plaintext, key);

  const decryptedText = await decryptDocument(encryptedText, key);

  expect(plaintext).toBe(decryptedText);
});