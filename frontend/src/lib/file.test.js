const { generateUserKeypair } = require('./crypto');
const File = require('./file');

test('can encrypt and decrypt a file.', async () => {
	const fileContents = Uint8Array.from([1, 2, 3]).buffer;
	const file = File.fromUnencrypted('file name', fileContents);

	const userKey = await generateUserKeypair();

	const encryptedContents = await file.encrypt();
	const fileKey = await file.getEncryptedFileKey(userKey.publicKey);

	const file2 = await File.fromEncrypted(
		'file name',
		encryptedContents,
		fileKey,
		userKey.privateKey
	);

	expect(file.contents).toEqual(fileContents);
	expect(file2.contents).toEqual(fileContents);
});
