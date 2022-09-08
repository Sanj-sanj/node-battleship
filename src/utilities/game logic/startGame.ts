import print from "../print.js";
import gameLoop from "./gameLoop.js";
import setupGameState from "../game state/gameState.js";
import { GameFile } from "../../types/GameTypes.js";
import saveGameState from "./saveGameState.js";

export default async function startGame(
  salvo: boolean,
  playerName: string,
  id: number = Math.floor(Math.random() * 100000000)
) {
  //  to-do add a  function loadGameState somewhere, to pickup last game saved
  //  to-do add a  function saveTOHighscores to save completed games and time?

  const state = setupGameState();
  const gameState = await gameLoop(state, salvo);
  const gameFile: GameFile = {
    ...gameState,
    salvo,
    playerName,
    ID: id,
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
    saveGameState(gameFile, id);
  }

  return state.get().shipsState;
}
