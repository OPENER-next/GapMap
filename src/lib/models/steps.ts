
export default class Steps {
  readonly count: number;
  readonly height: number;

  constructor({ count, height }: { count: number, height: number }) {
    this.count = count;
    this.height = height;
  }
}