import {
  Board,
  CompassDirectionSingles,
  ShipPlotPoints,
  TurnPlayer,
} from "../../../types/GameTypes";
import ascertainDirections from "./ascertainDirections.js";
import buildShips from "./buildShips.js";

export default function populateBoard(
  board: Board,
  updatePositions: (path: ShipPlotPoints, name: TurnPlayer) => void,
  name: "player" | "enemy"
) {
  //make empty board [[0x10]x10]
  // let board = createEmptyBoard();
  const sizes = [5, 4, 3, 3, 2];
  sizes.forEach((size) => {
    const getRandomInitialPlot = (): [number, number] => {
      const y = Math.floor(Math.random() * board.length);
      const x = Math.floor(Math.random() * board[y].length);
      return [y, x];
    };
    const shipTile = size;
    // const shipTile = "\x1b[35m" + size + "\x1b[0m";
    // const shipInitialPlot = "\x1b[46m" + size + "\x1b[0m";
    let initialTileToCheck = 1;
    const coords = { x: 0, y: 0 };
    let { x, y } = coords;

    while (initialTileToCheck !== 0) {
      [y, x] = getRandomInitialPlot();
      initialTileToCheck = parseInt(board[y][x]);
      const currentlyCheckingTile = board[y][x];
      // print("this is initial before its alterd", initialPlot);
      if (currentlyCheckingTile === "0") {
        board[y] = [...board[y]];
        board[y][x] = shipTile.toString();
        const directions = ascertainDirections({ x, y }, board, size);
        const validDirections = Object.entries(directions).filter((v) => v[1]);
        if (!validDirections.length) {
          // print("potential fuckup");
          board[y][x] = initialTileToCheck.toString();
          initialTileToCheck = 1;
          continue;
        }
        //Pick a random valid direction
        const buildDirection = validDirections[
          Math.floor(Math.random() * validDirections.length)
        ][0] as CompassDirectionSingles;

        const [newBoard, shipPlotPoints] = buildShips(
          { x, y },
          board,
          size,
          buildDirection
        );
        updatePositions(shipPlotPoints, name);
        board = newBoard;
        break;
      }
    }
  });
  return board;
}
