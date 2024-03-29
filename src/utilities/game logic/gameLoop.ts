import {
  Board,
  GameSession,
  GameSessionState,
  GameState,
  XYCoords,
} from "../../types/GameTypes";
import print from "../print.js";
import checkForHit from "./board/checkForHit.js";
import createEmptyBoard from "./board/createEmptyBoard.js";
import mapSunkShips from "./board/mapSunkShips.js";
import populateBoard from "./board/populateBoard.js";
import tallySunken from "./board/tallySunken.js";
import promptPlayersInputs from "./promptPlayerInputs.js";
import printBoards from "./board/printBoards.js";
import logAndUpdateShotsFired from "./logAndUpdateShotsFired.js";
import getAiInputs from "./board/getAiInputs.js";

export default async function gameLoop(
  state: GameState,
  salvoEnabled: boolean,
  playerBoard: Board = populateBoard(
    createEmptyBoard(),
    state.modify().updatePositions,
    "player"
  ),
  enemyBoard: Board = populateBoard(
    createEmptyBoard(),
    state.modify().updatePositions,
    "enemy"
  ),
  guessBoard: Board = createEmptyBoard()
): Promise<GameSession> {
  console.clear();
  const playersTurn = state.get().isPlayersTurn;
  const opponentBoard = playersTurn ? enemyBoard : playerBoard;
  const turnOpponent = playersTurn ? "enemy" : "player";
  const turnPlayer = playersTurn ? "player" : "enemy";
  const gameRenderMS = 1000;

  // Board state shown while player plays their turn move.
  // this function call will not print on enemy's turn
  print(
    playersTurn
      ? `It's your turn, you have ${state.get().salvo.player.remaining}`
      : "Enemy's turn"
  );
  // [ [ ---> NOTE <--- ] ] : printBoards(a, b = true) enables debugging
  // if debuggin is enabled, the saveFile will save the debugging bord (the player's board with no hitmarkers), this is unintended for actual game 
  printBoards([guessBoard, playerBoard, enemyBoard]);

  const inputedCoords = [] as XYCoords[];
  const {
    playerTurns,
    enemyTurns,
    salvo,
    positions,
    shipsState,
    shipsHit,
    shotsFiredHistory,
  } = state.get();

  if (playersTurn) {
    const playerInputs = await promptPlayersInputs(
      salvoEnabled,
      state.get().salvo.player.remaining
    );
    if (playerInputs === "end") {
      state.modify().updateGameHasEnded(true);
      print("\nThanks for playing");

      const gameState = Object.entries({
        playerTurns,
        enemyTurns,
        salvo,
        positions,
        shipsState,
        shipsHit,
        shotsFiredHistory,
      }).reduce((acc, curr) => {
        return (acc = { ...acc, [curr[0]]: curr[1] });
      }, {}) as GameSessionState;
      return {
        state: gameState,
        salvoEnabled,
        boards: {player: playerBoard, enemy: enemyBoard, guessBoard: guessBoard}
      };
    } else {
      inputedCoords.push(...playerInputs);
    }
  } else {
    inputedCoords.push(
      ...getAiInputs(salvoEnabled, state.get().salvo.enemy.remaining)
    );
  }
  const validatedHits = checkForHit(inputedCoords, opponentBoard);
  const repeatShot = state
    .get()
    .checkIfPreviouslyHitTile(inputedCoords, turnPlayer);
  const [newPlayerBoard, newGuessBoard] = await logAndUpdateShotsFired(
    {
      updateShotsFiredHistory: state.modify().updateShotsFiredHistory,
      updateShipsHit: state.modify().updateShipsHit,
    },
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
  state.modify().updateShipStates(sunkShips, turnOpponent);

  if (sunkShips.every(({ isSunk }) => isSunk === true)) {
    state.modify().updatePlayerHasWon(true);
    state.modify().updateGameHasEnded(true);

    const gameState = Object.entries({
      playerTurns,
      enemyTurns,
      salvo,
      positions,
      shipsState,
      shipsHit,
      shotsFiredHistory,
    }).reduce((acc, curr) => {
      return (acc = { ...acc, [curr[0]]: curr[1] });
    }, {}) as GameSessionState;
    return {
      state: gameState,
      salvoEnabled,
      boards: {player: playerBoard, enemy: enemyBoard, guessBoard: guessBoard}

    };
  }

  const opponentShipsSunk = state
    .get()
    .shipsState[turnOpponent].reduce((acc, curr) => {
      return curr.isSunk ? acc + 1 : acc;
    }, 0);

  print("Your opponents gonna fire!");
  state.modify().swapTurn();
  state.modify().incrementTurnCounter(turnPlayer);
  state.modify().updateSalvoTotal(turnPlayer, opponentShipsSunk);
  //by enveloping gameLoop in a setTimeout to delay by `n` seconds, the promise guarantees it will not fire untill completion of the timeout AND we will not prematurely return a non promise based value, which will continue thread of execturion after first return
  return new Promise((res) => {
    setTimeout(async () => {
      res(
        await gameLoop(
          state,
          salvoEnabled,
          newPlayerBoard,
          enemyBoard,
          newGuessBoard
        )
      );
    }, gameRenderMS);
  });
}
