const { subtract, add, generateKey, encrypt, decrypt } = require('./crypto');

test('adds 1 and 2 to equal 3', () => {
  expect(add(1, 2)).toBe(3);
});

test('subtracts 3 and 2 to equal 1', () => {
  expect(subtract(3, 2)).toBe(1);
});

test('generate key', async () => {
  const key = await generateKey();
  
  // do something with the key.
  console.log(key);

  const {
    privateKey,
    publicKey
  } = await key;

  const encryptedText = await encrypt("blabla", publicKey);

  const decryptedText = await decrypt(encrypt, privateKey)

  console.log(decryptedText);


});