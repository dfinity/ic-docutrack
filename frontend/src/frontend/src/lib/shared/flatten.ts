export function flatten<T>(arr: T[][]): T[] {
  return arr.reduce((acc, curr) => [...acc, ...curr], []);
}
