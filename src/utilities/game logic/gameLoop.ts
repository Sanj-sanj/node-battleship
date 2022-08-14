import { Board, XYCoords } from "../../types/GameTypes";
import print from "../print.js";
import checkForHit from "./board/checkForHit.js";
import createEmptyBoard from "./board/createEmptyBoard.js";
import mapSunkShips from "./board/mapSunkShips.js";
import populateBoard from "./board/populateBoard.js";
import tallySunken from "./board/tallySunken.js";
import state from "../game state/gameState.js";
import promptPlayersInputs from "./promptPlayerInputs.js";
import printBoards from "./board/printBoards.js";
import logAndUpdateShotsFired from "./logAndUpdateShotsFired.js";

export default async function gameLoop(
  salvo: boolean,
  playerBoard: Board = populateBoard(
    createEmptyBoard(),
    state.updatePositions,
    "player"
  ),
  enemyBoard: Board = populateBoard(
    createEmptyBoard(),
    state.updatePositions,
    "enemy"
  ),
  guessBoard: Board = createEmptyBoard()
) {
  console.clear();
  const playersTurn = state.get().isPlayersTurn;
  const opponentBoard = playersTurn ? enemyBoard : playerBoard;
  const turnOpponent = playersTurn ? "enemy" : "player";
  const turnPlayer = playersTurn ? "player" : "enemy";
  const gameRenderMS = 2250;

  /*
    TO DO, CLEAR STATE ON EACH NEW GAME STARTED 
*/

  // By updating the sunkenShips on the start of each gameLoop,
  // The printed board will not reflect changes untill its time for the player's next turn.
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

  // Board state shown while player plays their turn move.
  // this function call will not print on enemy's turn
  print(playersTurn ? "It's your turn, make a move!" : "Enemy's turn");
  // [ [ ---> NOTE <--- ] ] : printBoards(a, b = true) enables debugging
  printBoards([guessBoard, playerBoard, enemyBoard], false);

  const inputedCoords = [] as XYCoords[];

  if (playersTurn) {
    const result = await promptPlayersInputs(
      salvo,
      state.get().salvo.player.total
    );
    if (result === "end") {
      state.updateGameHasEnded(true);
      print("\nThanks for playing");
      return true;
    } else {
      inputedCoords.push(...result);
    }
  } else {
    /* to do support this ai to use salvo modes */
    const y = Math.floor(Math.random() * opponentBoard.length),
      x = Math.floor(Math.random() * opponentBoard[y].length);
    inputedCoords.push({ x, y });
  }

  const validatedHits = checkForHit(inputedCoords, opponentBoard);
  const repeatShot = state.checkIfPreviouslyHitTile(inputedCoords, turnPlayer);

  const [newPlayerBoard, newGuessBoard] = await logAndUpdateShotsFired(
    inputedCoords,
    repeatShot,
    validatedHits,
    [turnPlayer, turnOpponent, playerBoard, guessBoard],
    gameRenderMS,
    0,
    []
  );

  state.swapTurn();
  state.incrementTurnCounter(turnPlayer);

  //by enveloping gameLoop in a setTimeout to delay by `n` seconds, the promise guarantees it will not fire untill completion of the timeout AND we will not prematurely return a non promise based value, which will continue thread of execturion after first return
  return new Promise((res) => {
    setTimeout(async () => {
      res(await gameLoop(salvo, newPlayerBoard, enemyBoard, newGuessBoard));
    }, gameRenderMS);
  });
}
