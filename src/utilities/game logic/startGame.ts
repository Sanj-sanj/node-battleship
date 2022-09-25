import print from "../print.js";
import gameLoop from "./gameLoop.js";
import setupGameState from "../game state/gameState.js";
import { GameSaveFile, GameState } from "../../types/GameTypes.js";
import saveGameState from "./saveGameState.js";
import loadGameState from "./loadGameState.js";

export default async function startGame(
  salvoEnabled: boolean,
  playerName: string,
  id: number = Math.floor(Math.random() * 100000000),
  loadPreviousGame = false
) {
  //  to-do add a  function loadGameState somewhere, to pickup last game saved
  //  to-do add a  function saveTOHighscores to save completed games and time?
  let state: GameState;
  if (loadPreviousGame) {
    // load the previous save here
    //then pass the results of the state into setupGameState()
    const lemon = await loadGameState(id);
    const previousState = lemon.state;
    const {
      enemyTurns,
      playerTurns,
      positions,
      salvo,
      shipsHit,
      shipsState,
      shotsFiredHistory,
      lastBuiltBoard,
    } = previousState;
    state = setupGameState(
      playerTurns,
      enemyTurns,
      salvo,
      positions,
      shipsState,
      shipsHit,
      shotsFiredHistory
    );
  } else {
    state = setupGameState();
  }
  const gameState = await gameLoop(state, salvoEnabled);
  const gameFile: GameSaveFile = {
    playerName,
    ID: id,
    ...gameState,
    salvoEnabled,
  };
  if (state.get().gameHasEnded) {
    //below logic  shold become a return statement or change this fnc return statement
    if (state.get().playerHasWon) {
      print(
        `Good job\nAfter ${
          state.get().playerTurns
        } mighty blows,\nYou've taken out ${state
          .get()
          .shipsState?.enemy.reduce(
            (acc, curr) => (curr.isSunk ? (acc += 1) : acc),
            0
          )}\nThey've gone down yarr.`
      );
    } else {
      print(
        `Nice try\nAfter ${
          state.get().playerTurns
        } mighty blows,\nYou've taken out ${state
          .get()
          .shipsState.enemy.reduce(
            (acc, curr) => (curr.isSunk ? (acc += 1) : acc),
            0
          )}\nThey remain.`
      );
    }
  }
  return saveGameState(gameFile, id);

  // return state.get().shipsState;
}
