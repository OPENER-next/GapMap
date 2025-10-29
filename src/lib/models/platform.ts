export default class Platform {
  readonly name: string;
  readonly boardingHeight: number;

  constructor({
    name, boardingHeight
  }: {
    name: string, boardingHeight: number
  }) {
    this.name = name;
    this.boardingHeight = boardingHeight;
  }
}
