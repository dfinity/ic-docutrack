import { clearKeys } from './keyStorage';
import { generateUserKeypair } from './crypto';

test('create, store, load and clear keys', async () => {

  const key = await generateUserKeypair();
  const {
    privateKey,
    publicKey
  } = key;
  
  
  const load_empty = await clearKeys();

  console.log( load_empty);
});