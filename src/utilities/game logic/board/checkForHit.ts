import { Board, XYCoords } from "../../../types/GameTypes";

export default function checkForHit({ y, x }: XYCoords, boardToCheck: Board) {
  return boardToCheck[y][x] === "0"
    ? { hit: false, tile: boardToCheck[y][x] }
    : { hit: true, tile: boardToCheck[y][x] };
}
