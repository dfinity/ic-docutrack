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
    // Create an ArrayBuffer with a size in bytes
  const buffer = new ArrayBuffer(16);
  const uint8ArrayView = new Uint8Array(buffer);
  uint8ArrayView[1] = 4;
  // Produces ArrayBuffer [0, 4, 0, 0, ....]

  const key = await generateDocumentKey();
  
  const encryptedBuffer = await encryptDocument(buffer, key);

  const decryptedBuffer = await decryptDocument(encryptedBuffer, key);

  expect(new Uint8Array(decryptedBuffer)).toStrictEqual(uint8ArrayView);
});