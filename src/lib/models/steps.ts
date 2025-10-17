
export default class Steps {
  count: number;
  height: number;

  constructor({ count, height }: { count: number, height: number }) {
    this.count = count;
    this.height = height;
  }
}