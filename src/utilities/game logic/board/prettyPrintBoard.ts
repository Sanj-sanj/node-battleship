import { Board } from "../../../types/GameTypes";
import print from "../../printToScreen";

export default function prettyPrintBoard(board: Board) {
  print("\n     A B C D E F G H I J");
  let lineNum = 1;
  for (const line of board) {
    print(
      `${lineNum} `.padEnd(3) +
        `|${line.reduce((acc, curr) => (acc += curr + " "), " ")}|`
    );
    lineNum++;
  }
}
