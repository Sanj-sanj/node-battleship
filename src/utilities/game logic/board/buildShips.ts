import {
  Board,
  BoardRow,
  CompassDirectionSingles,
  ShipPlotPoints,
  XYCoords,
} from "../../../types/GameTypes";

export default function buildShips(
  { x, y }: XYCoords,
  board: Board,
  size: number,
  direction: CompassDirectionSingles
): [Board, ShipPlotPoints] {
  // y = parseInt(y), x = parseInt(x)
  const shipPlots: ShipPlotPoints = [{ x, y }];
  const tempBoard = [...board] as Board;
  let counter = size;
  const startPointer = direction === "north" || direction === "south" ? y : x;
  for (
    let i =
      direction === "east" || direction === "south"
        ? startPointer + 1
        : startPointer - 1;
    counter > 1 && i >= 0;
    direction === "north" || direction === "west" ? i-- : i++, counter--
  ) {
    const horizontalPointer =
      direction === "north" || direction === "south" ? x : i;
    const verticalPointer =
      direction === "north" || direction === "south" ? i : y;
    const tempRow = [...tempBoard[verticalPointer]] as BoardRow;
    //replaces the individual tile with a custom color tile if wanted
    tempRow[horizontalPointer] = size.toString();
    tempBoard[verticalPointer] = [...tempRow];
    shipPlots.push({ x: horizontalPointer, y: verticalPointer });
  }
  return [tempBoard, shipPlots];
}
