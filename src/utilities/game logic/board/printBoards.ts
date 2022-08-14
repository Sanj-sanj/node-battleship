import { Board } from "../../../types/GameTypes";
import print from "../../print.js";
import prettyPrintBoard from "./prettyPrintBoard.js";

export default function printBoards(
  [...boards]: [Board, Board, Board?],
  debug = false
) {
  if (debug && boards[2]) {
    print("\nYour ENEMY'S is:");
    prettyPrintBoard(boards[2]); //enemyBoard
  } else {
    print("\nYour guess board");
    prettyPrintBoard(boards[0]); //guessingBoard
  }
  print("\nYour board is:");
  prettyPrintBoard(boards[1]); //playerBoard
}
