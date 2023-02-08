const {loadKey, storeKey, clearKeys } = require('./keyStorage');
const {generateUserKeypair } = require('./crypto');

test('create, store, load and clear keys', async () => {

  const key = await generateUserKeypair();
  const {
    privateKey,
    publicKey
  } = key;
  
  
  const load_empty = await loadKey('public');

  console.log(loadKey);
});