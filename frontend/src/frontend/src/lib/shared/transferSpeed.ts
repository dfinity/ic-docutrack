import { writable } from "svelte/store";

export class TransferSpeedMeter {
  startTime: number = 0;
  transferredBytes: number = 0;
  totalBytes: number = 0;
  endTime: number | null = null;

  constructor() {}

  reset() {
    this.startTime = 0;
    this.transferredBytes = 0;
    this.totalBytes = 0;
    this.endTime = null;
  }

  start(totalBytes: number) {
    this.startTime = Date.now();
    this.transferredBytes = 0;
    this.totalBytes = totalBytes;
    this.endTime = null;
  }

  addTransferredBytes(bytes: number) {
    this.transferredBytes += bytes;

    if (this.transferredBytes === this.totalBytes) {
      this.endTime = Date.now();
    }
  }

  getBytesPerSec(): number {
    const at = this.endTime !== null ? this.endTime : Date.now();

    const elapsed = at - this.startTime;

    if (elapsed === 0) {
      return 0;
    }

    return this.transferredBytes / (elapsed / 1000);
  }

  gerProgressPercent(): number {
    return (this.transferredBytes / this.totalBytes) * 100;
  }
}

export const createTransferSpeedStore = () => {
  const meter = new TransferSpeedMeter();

  const { set, subscribe } = writable<{
    speed: number;
    percent: number;
    total: number;
    transferred: number;
  }>({
    speed: 0,
    percent: 0,
    total: 0,
    transferred: 0,
  });

  function updateStore() {
    set({
      percent: meter.gerProgressPercent(),
      speed: meter.getBytesPerSec(),
      total: meter.totalBytes,
      transferred: meter.transferredBytes,
    });
  }

  return {
    subscribe: subscribe,
    reset: () => {
      meter.reset();
      set({
        speed: 0,
        percent: 0,
        total: 0,
        transferred: 0,
      });
    },
    start: (totalBytes: number) => {
      meter.start(totalBytes);
      updateStore();
    },
    addTransferredBytes: (bytes: number) => {
      meter.addTransferredBytes(bytes);
      updateStore();
    },
  };
};
