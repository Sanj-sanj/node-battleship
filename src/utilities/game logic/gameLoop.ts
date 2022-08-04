import { Board, XYCoords } from "../../types/GameTypes";
import print from "../print.js";
import checkForHit from "./board/checkForHit.js";
import createEmptyBoard from "./board/createEmptyBoard.js";
import fillTileWithHitMarker from "./board/fileTileWithHitMarker.js";
import mapSunkShips from "./board/mapSunkShips.js";
import populateBoard from "./board/populateBoard.js";
import prettyPrintBoard from "./board/prettyPrintBoard.js";
import tallySunken from "./board/tallySunken.js";
import state from "../game state/gameState.js";
import promptPlayersInputs from "./promptPlayerInputs.js";

export default async function gameLoop(
  plBoard: void | Board,
  enBoard: void | Board,
  guessBoard: void | Board
) {
  console.clear();
  const playerBoard =
    plBoard ||
    populateBoard(createEmptyBoard(), state.updatePositions, "player");
  const enemyBoard =
    enBoard ||
    populateBoard(createEmptyBoard(), state.updatePositions, "enemy");
  const guessingBoard = guessBoard || createEmptyBoard();

  const playersTurn = state.get().isPlayersTurn;
  const evaluationBoard = playersTurn ? enemyBoard : playerBoard;
  const turnOpponent = playersTurn ? "enemy" : "player";
  const turnPlayer = playersTurn ? "player" : "enemy";
  const gameRenderMS = 2250;

  //By updating the sunkenShips on the start of each gameLoop, the printed board will not reflect changes untill its time for the player's next turn.
  const sunkenShips = mapSunkShips(
    state.get().positions[turnOpponent],
    state.get().shipsHit[turnOpponent]
  );
  const sunkShips = tallySunken(sunkenShips);
  state.updateShipStates(sunkShips, turnOpponent);

  if (sunkShips.every(({ isSunk }) => isSunk === true)) {
    state.updatePlayerHasWon(true);
    state.updateGameHasEnded(true);
    return true;
  }
  function printBoards(debug = false) {
    if (debug) {
      print("\nYour ENEMY'S is:");
      prettyPrintBoard(enemyBoard);
    } else {
      print("\nYour guess board");
      prettyPrintBoard(guessingBoard);
    }
    print("\nYour board is:");
    prettyPrintBoard(playerBoard);
  }
  print(playersTurn ? "Player's turn" : "AI turn");
  // Board state shown while player plays their turn move.
  // this function call will not print on enemy's turn
  printBoards(true);

  //If it is the players turn, we are evaluating the shots fired on the rival board. and updating that turn's (player/ai) board
  const initialCoords: XYCoords = { x: 0, y: 0 };
  let { y, x } = initialCoords;
  if (playersTurn) {
    const result = await promptPlayersInputs();
    if (typeof result === "object") {
      (y = result.y), (x = result.x);
    } else if (result === "end") {
      //end game logic here?
      state.updateGameHasEnded(true);
      print("\nThanks for playing");
      return true;
    }
  } else {
    y = Math.floor(Math.random() * evaluationBoard.length);
    x = Math.floor(Math.random() * evaluationBoard[y].length);
  }
  // UTILS ===================================
  const red = (tile: string) => "\x1b[41m" + tile + "\x1b[0m";
  const yellow = (tile: string) => "\x1b[43m" + tile + "\x1b[0m";
  // UTILS ===================================

  const { hit, tile } = checkForHit({ y, x }, evaluationBoard);
  const repeatShot = state.checkIfPreviouslyHitTile({ x, y }, turnPlayer);
  let fill = tile;

  console.clear();
  if (!hit && repeatShot && turnPlayer === "player") {
    print("You've already shot a cannonball there, try another space.");
    fill = yellow(tile);
  } else if (hit && repeatShot && turnPlayer === "player") {
    print("You've already shot a cannonball there, try another space.");
    fill = red(tile);
  } else {
    state.updateShotsFiredHistory({ x, y }, turnPlayer);
    if (hit) {
      state.updateShipsHit({ x, y }, turnOpponent);
      print(
        playersTurn
          ? `You land a hit at Y: ${y + 1}, X: ${x + 1}`
          : `The enemy lands a hit at Y: ${y + 1}, X: ${x + 1}`
      );
      fill = red(tile);
    } else {
      //turn player shot misses
      print(
        playersTurn
          ? `Your shot misses at Y: ${y + 1}, X: ${x + 1}`
          : `The enemy's shot misses at Y: ${y + 1}, X: ${x + 1}`
      );
      fill = yellow(tile);
    }
    state.swapTurn();
    state.incrementTurnCounter(turnPlayer);
  }

  const newPlayerBoard = !playersTurn
    ? fillTileWithHitMarker({ x, y }, fill, playerBoard)
    : playerBoard;
  const newGuessingBoard = playersTurn
    ? fillTileWithHitMarker({ x, y }, fill, guessingBoard)
    : guessingBoard;

  //printBoards() here because without it, the function moves out to the outter body before the setTimeout executes.
  // board printed right after either player or the AI finish their moves and persists during the timeout for the new board.
  // After the turnPlayer finishes their move, this function call is the one that persists on screen
  printBoards();

  //by enveloping gameLoop in a setTimeout to delay by `n` seconds, the promise guarantees it will not fire untill completion of the timeout AND we will not prematurely return a non promise based value, which will continue thread of execturion after first return
  return new Promise((res) => {
    setTimeout(async () => {
      res(await gameLoop(newPlayerBoard, enemyBoard, newGuessingBoard));
    }, gameRenderMS);
  });
}
