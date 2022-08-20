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
import getAiInputs from "./board/getAiInputs.js";

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

  // Board state shown while player plays their turn move.
  // this function call will not print on enemy's turn
  print(playersTurn ? "It's your turn, make a move!" : "Enemy's turn");
  // [ [ ---> NOTE <--- ] ] : printBoards(a, b = true) enables debugging
  printBoards([guessBoard, playerBoard, enemyBoard], true);

  const inputedCoords = [] as XYCoords[];

  if (playersTurn) {
    const playerInputs = await promptPlayersInputs(
      salvo,
      state.get().salvo.player.remaining
    );
    if (playerInputs === "end") {
      state.updateGameHasEnded(true);
      print("\nThanks for playing");
      return true;
    } else {
      inputedCoords.push(...playerInputs);
    }
  } else {
    /* to do support this ai to use salvo modes */
    inputedCoords.push(
      ...getAiInputs(salvo, state.get().salvo.enemy.remaining)
    );
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

  // By updating the sunkenShips on the end of each gameLoop,
  // The game state will update changes before the next turn.
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

  const opponentShipsSunk = state
    .get()
    .shipsState[turnOpponent].reduce((acc, curr) => {
      return curr.isSunk ? acc + 1 : acc;
    }, 0);

  print("Your opponents gonna fire!");
  state.swapTurn();
  state.incrementTurnCounter(turnPlayer);
  state.updateSalvoTotal(turnPlayer, opponentShipsSunk);
  //by enveloping gameLoop in a setTimeout to delay by `n` seconds, the promise guarantees it will not fire untill completion of the timeout AND we will not prematurely return a non promise based value, which will continue thread of execturion after first return
  return new Promise((res) => {
    setTimeout(async () => {
      res(await gameLoop(salvo, newPlayerBoard, enemyBoard, newGuessBoard));
    }, gameRenderMS);
  });
}
