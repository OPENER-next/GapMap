import Entrance from "./models/entrance";
import Steps from "./models/steps";
import Vehicle from "./models/vehicle";

export default [
  new Vehicle({
    name: "NET 2012",
    width: 2.65,
    length: 37.2,
    height: 3.655,
    entrances: [
      new Entrance({
        width: 1.3,
        height: 2.1,
        distanceFront: 2,
        side: "left",
        boardingHeight: 0.34,
        steps: new Steps({ count: 0, height: 0 }),
      }),
      new Entrance({
        width: 1.3,
        height: 2.1,
        distanceFront: 3,
        side: "right",
        boardingHeight: 0.34
      }),
      new Entrance({
        width: 1.3,
        height: 2.1,
        distanceFront: 4,
        side: "left",
        boardingHeight: 0.34
      }),
      new Entrance({
        width: 1.3,
        height: 2.1,
        distanceFront: 5,
        side: "right",
        boardingHeight: 0.34
      }),
      new Entrance({
        width: 1.3,
        height: 2.1,
        distanceFront: 6,
        side: "left",
        boardingHeight: 0.34
      }),
    ],
  }),
  new Vehicle({
    name: "GT6-70D/N",
    width: 2.65,
    length: 29.68,
    height: 3.48,
    entrances: [],
  }),
  new Vehicle({
    name: "GT8-70D/N",
    width: 2.65,
    length: 39.68,
    height: 3.48,
    entrances: [],
  }),
];