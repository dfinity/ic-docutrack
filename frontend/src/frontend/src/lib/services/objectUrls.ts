export class ObjectUrlManager {
  lastUrl: string | null = null;

  constructor() {}

  clear() {
    if (this.lastUrl) {
      // console.log("Revoking object URL", this.lastUrl);
      URL.revokeObjectURL(this.lastUrl);
    }
    this.lastUrl = null;
  }

  createObjectURLFromBlob(blob: Blob) {
    this.clear();
    this.lastUrl = URL.createObjectURL(blob);
    // console.log("Created object URL", this.lastUrl);
    return this.lastUrl;
  }

  createObjectURLFromArrayBuffer(buffer: ArrayBuffer, type: string) {
    return this.createObjectURLFromBlob(new Blob([buffer], { type }));
  }
}
