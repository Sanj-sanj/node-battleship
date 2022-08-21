import print from "../print.js";
import gameLoop from "./gameLoop.js";
import state from "../game state/gameState.js";

export default async function startGame(salvo = false) {
  await gameLoop(salvo);
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

  return state.get().shipsState;
}
