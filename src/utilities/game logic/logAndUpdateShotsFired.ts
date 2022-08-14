import {
  XYCoords,
  TurnPlayer,
  TurnOpponent,
  Board,
} from "../../types/GameTypes";
import { red, yellow } from "../fillTile.js";
import state from "../game state/gameState.js";
import print from "../print.js";
import fillTileWithHitMarker from "./board/fileTileWithHitMarker.js";
import printBoards from "./board/printBoards.js";

export default async function logAndUpdateShotsFired(
  coords: XYCoords[],
  repeatShot: boolean[],
  validatedHits: { hit: boolean; tile: string }[],
  [turnPlayer, turnOpponent, playerBoard, guessBoard]: [
    TurnPlayer,
    TurnOpponent,
    Board,
    Board
  ],
  gameRenderMS: number,
  i: number,
  acc: string[]
): Promise<[Board, Board]> {
  if (i >= repeatShot.length) return [playerBoard, guessBoard];
  console.clear();

  const { hit, tile } = validatedHits[i];
  const previouslyHit = repeatShot[i];
  let filledTile = tile;
  const { x, y } = coords[i];

  if (!hit && previouslyHit && turnPlayer === "player") {
    print("You've already shot a cannonball there, try another space.");
    filledTile = yellow(tile);
  } else if (hit && previouslyHit && turnPlayer === "player") {
    print("You've already shot a cannonball there, try another space.");
    filledTile = red(tile);
  } else {
    state.updateShotsFiredHistory({ x, y }, turnPlayer);

    if (hit) {
      //update to take array of XYcoords
      state.updateShipsHit({ x, y }, turnOpponent);
      print(
        turnPlayer === "player"
          ? `You land a hit at Y: ${y + 1}, X: ${x + 1}`
          : `The enemy lands a hit at Y: ${y + 1}, X: ${x + 1}`
      );
      filledTile = red(tile);
    } else {
      //turn player shot misses
      print(
        turnPlayer === "player"
          ? `Your shot misses at Y: ${y + 1}, X: ${x + 1}`
          : `The enemy's shot misses at Y: ${y + 1}, X: ${x + 1}`
      );
      filledTile = yellow(tile);
    }
  }

  playerBoard =
    turnPlayer === "enemy"
      ? fillTileWithHitMarker({ x, y }, filledTile, playerBoard)
      : playerBoard;
  guessBoard =
    turnPlayer === "player"
      ? fillTileWithHitMarker({ x, y }, filledTile, guessBoard)
      : guessBoard;

  printBoards([guessBoard, playerBoard]);

  acc = [...acc, filledTile];
  return new Promise((res) =>
    setTimeout(
      async () =>
        res(
          await logAndUpdateShotsFired(
            coords,
            repeatShot,
            validatedHits,
            [turnPlayer, turnOpponent, playerBoard, guessBoard],
            gameRenderMS,
            i + 1,
            acc
          )
        ),
      gameRenderMS
    )
  );
}
