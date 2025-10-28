export default class Platform {
  name: string;
  boardingHeight: number;

  constructor({
    name, boardingHeight
  }: {
    name: string, boardingHeight: number
  }) {
    this.name = name;
    this.boardingHeight = boardingHeight;
  }
}
