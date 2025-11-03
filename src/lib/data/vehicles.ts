import Entrance from "$lib/models/entrance";
import { WheelchairSpace } from "$lib/models/space";
import Steps from "$lib/models/steps";
import Vehicle from "$lib/models/vehicle";

export const vehicleData = [
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
    entrances: [
      new Entrance({
        width: 1.3,
        height: 2.1,
        distanceFront: 5,
        side: "right",
        boardingHeight: 0.22,
      }),
      new Entrance({
        width: 1.3,
        height: 2.1,
        distanceFront: 15,
        side: "right",
        boardingHeight: 0.22,
        steps: {
          count: 2,
          height: 0.12,
        },
        ramp: true,
      }),
      new Entrance({
        width: 1.3,
        height: 2.1,
        distanceFront: 25,
        side: "right",
        boardingHeight: 0.22,
        steps: {
          count: 3,
          height: 0.12,
        }
      }),
    ],
  }),
  new Vehicle({
    name: "GT8-70D/N",
    width: 2.65,
    length: 39.68,
    height: 3.48,
    entrances: [],
  }),
];
