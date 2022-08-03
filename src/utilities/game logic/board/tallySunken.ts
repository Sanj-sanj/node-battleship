import { ShipTilesHitAndSizeTuple } from "../../../types/GameTypes";

export default function tallySunken(sunkenShips: ShipTilesHitAndSizeTuple[]) {
  return sunkenShips.map(({ counter, size }, i) => {
    return {
      shipNo: i,
      size,
      shotsTaken: counter,
      isSunk: size !== 0 && counter === size ? true : false,
    };
  });
}
