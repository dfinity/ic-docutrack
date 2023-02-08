require("fake-indexeddb/auto");
const { clearKeys, storeKey, loadKey } = require('./keyStorage');
const { generateUserKeypair } = require('./crypto');

test('create, store, load and clear keys', async () => {

  // loading a key which has not been stored yet fails
  const load_empty = await loadKey('private');
  expect(load_empty).toBeFalsy();
  
  // loading a key which has been stored succeeds
  const key = await generateUserKeypair();
  const {
    privateKey,
    publicKey
  } = key;
  storeKey('private', privateKey);
  const load_private = await loadKey('private');
  expect(load_private).toStrictEqual(privateKey);

  // loading a key after clearing fails
  clearKeys();
  const load_empty2 = await loadKey('private');
  expect(load_empty2).toBeFalsy();
  
});