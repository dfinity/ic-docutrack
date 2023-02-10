// import 'fake-indexeddb/auto';
// import default from './keyStorage';
// const { clearKeys, storeKey, loadKey } = default;

// test('create, store, load and clear keys', async () => {
// 	// loading a key which has not been stored yet fails
// 	const load_empty = await loadKey('private');
// 	expect(load_empty).toBeFalsy();

// 	// loading a key which has been stored succeeds
// 	const privateKey = (
// 		await globalThis.crypto.subtle.generateKey(
// 			{
// 				name: 'RSA-OAEP',
// 				modulusLength: 4096,
// 				publicExponent: new Uint8Array([1, 0, 1]),
// 				hash: 'SHA-256'
// 			},
// 			true,
// 			['encrypt', 'decrypt']
// 		)
// 	).privateKey;
// 	storeKey('private', privateKey);
// 	const load_private = await loadKey('private');
// 	expect(load_private).toStrictEqual(privateKey);

// 	// loading a key after clearing fails
// 	clearKeys();
// 	const load_empty2 = await loadKey('private');
// 	expect(load_empty2).toBeFalsy();
// });
