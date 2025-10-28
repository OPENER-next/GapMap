import Entrance from "./models/entrance";
import { WheelchairSpace } from "./models/space";
import Steps from "./models/steps";
import Vehicle from "./models/vehicle";
import Platform from "./models/platform";

export const vehicles = [
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
        distanceFront: 8,
        side: "right",
        boardingHeight: 0.24
      }),
      new Entrance({
        width: 1.3,
        height: 2.1,
        distanceFront: 14,
        side: "left",
        boardingHeight: 0.34
      }),
      new Entrance({
        width: 1.3,
        height: 2.1,
        distanceFront: 14,
        side: "right",
        boardingHeight: 0.34
      }),
      new Entrance({
        width: 1.3,
        height: 2.1,
        distanceFront: 20,
        side: "right",
        boardingHeight: 0.34
      }),
      new Entrance({
        width: 1.3,
        height: 2.1,
        distanceFront: 26,
        side: "left",
        boardingHeight: 0.34
      }),
    ],
    spaces: [
      new WheelchairSpace({
        distanceFront: 10,
      }),
      new WheelchairSpace({
        distanceFront: 20,
      }),
    ]
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


export const platforms = [
  new Platform({
    name: 'Industriemuseum',
    boardingHeight: 0.2,
  }),
  new Platform({
    name: 'TU Campus',
    boardingHeight: 0.2,
  }),
];