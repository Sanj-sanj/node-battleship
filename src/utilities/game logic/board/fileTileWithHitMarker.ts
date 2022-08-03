import { Board, BoardRow, XYCoords } from "../../../types/GameTypes";

export default function fillTileWithHitMarker(
  { y, x }: XYCoords,
  tile: string,
  board: Board
) {
  const row = [...board[y]] as BoardRow;
  row[x] = tile;
  const newBoard = [...board] as Board;
  newBoard[y] = row;
  return newBoard;
}
