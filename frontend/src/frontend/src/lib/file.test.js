import { expect, test } from "@jest/globals";
import "fake-indexeddb/auto";
import { default as crypto } from "./crypto";
import File from "./file";

test("can encrypt and decrypt a file.", async () => {
  const fileContents = Uint8Array.from([1, 2, 3]).buffer;
  const file = File.fromUnencrypted("file name", fileContents);

  const userKey = await crypto.getLocalUserPublicKey();

  const encryptedContents = await file.encrypt();

  const encryptedFileKey = await file.getEncryptedFileKey(userKey);

  const file2 = await File.fromEncrypted(
    "file name",
    encryptedContents,
    encryptedFileKey
  );

  expect(file.contents).toEqual(fileContents);
  expect(file2.contents).toEqual(fileContents);
});
