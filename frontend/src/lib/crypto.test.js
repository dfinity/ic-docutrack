const {generateUserKeypair, encryptForUser, decryptForUser,
  generateFileKey, encryptFile, decryptFile } = require('./crypto');

test('generate User key, encrypt and decrypt', async () => {
   // Create an ArrayBuffer with a size in bytes
   const buffer = new ArrayBuffer(16);
   const uint8ArrayView = new Uint8Array(buffer);
   uint8ArrayView[2] = 3;
   // Produces ArrayBuffer [0, 0, 3, 0, 0, ....]

  const key = await generateUserKeypair();
  const {
    privateKey,
    publicKey
  } = key;
  
  const encryptedBuffer = await encryptForUser(buffer, publicKey);

  const decryptedBuffer = await decryptForUser(encryptedBuffer, privateKey);

  expect(new Uint8Array(decryptedBuffer)).toStrictEqual(uint8ArrayView);
});

test('generate File key, encrypt and decrypt', async () => {
    // Create an ArrayBuffer with a size in bytes
  const buffer = new ArrayBuffer(16);
  const uint8ArrayView = new Uint8Array(buffer);
  uint8ArrayView[1] = 4;
  // Produces ArrayBuffer [0, 4, 0, 0, ....]

  const key = await generateFileKey();
  
  const encryptedBuffer = await encryptFile(buffer, key);

  const decryptedBuffer = await decryptFile(encryptedBuffer, key);

  expect(new Uint8Array(decryptedBuffer)).toStrictEqual(uint8ArrayView);
});