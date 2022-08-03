import { Board } from "../../../types/GameTypes";

export default function createEmptyBoard(size = 10) {
  return new Array(10).fill(new Array(10).fill("0")) as Board;
}
