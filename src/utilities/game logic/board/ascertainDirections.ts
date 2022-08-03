import { Board, CompassDirection, XYCoords } from "../../../types/GameTypes";

export default function ascertainDirections(
  { x, y }: XYCoords,
  board: Board,
  size: number
) {
  type MoveableDirectionState = null | true | false;
  const directions = {
    north: null as MoveableDirectionState,
    south: null as MoveableDirectionState,
    east: null as MoveableDirectionState,
    west: null as MoveableDirectionState,
  };

  const compassDirections = Object.keys(directions) as CompassDirection;
  compassDirections.forEach((direction) => {
    let counter = size;
    const tempBoard = [...board].map((row) => row.map((n) => n));
    const pointer = direction === "north" || direction === "south" ? y : x;
    for (
      let i =
        direction === "north" || direction === "west"
          ? pointer - 1
          : pointer + 1;
      counter > 1;
      direction === "north" || direction === "west" ? i-- : i++, counter--
    ) {
      const yIndex = direction === "north" || direction === "south" ? i : y;
      const xIndex = direction === "north" || direction === "south" ? x : i;
      try {
        if (tempBoard[yIndex][xIndex] !== "0") {
          directions[direction] = false;
          break;
        }
      } catch (error) {
        // print("unreachable coordinate, path failed");
        directions[direction] = false;
        break;
      }
    }
    if (directions[direction] !== false) {
      directions[direction] = true;
    }
  });
  return directions;
}
