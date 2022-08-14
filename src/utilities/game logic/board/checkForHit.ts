import { Board, XYCoords } from "../../../types/GameTypes";

export default function checkForHit(coords: XYCoords[], boardToCheck: Board) {
  return coords.map(({ x, y }) =>
    boardToCheck[y][x] === "0"
      ? { hit: false, tile: boardToCheck[y][x] }
      : { hit: true, tile: boardToCheck[y][x] }
  );
}
