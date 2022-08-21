export type TurnPlayer = "player" | "enemy";
export type TurnOpponent = "player" | "enemy";

export type BoardRow = [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string
];
export type Board = [
  BoardRow,
  BoardRow,
  BoardRow,
  BoardRow,
  BoardRow,
  BoardRow,
  BoardRow,
  BoardRow,
  BoardRow,
  BoardRow
];

export type CompassDirectionSingles = "north" | "south" | "east" | "west";
export type CompassDirection = [CompassDirectionSingles];
export type XYCoords = { x: number; y: number };
export type ShipPlotPoints = XYCoords[];

export type ShipTilesHitAndSizeTuple = { counter: number; size: number };
export type ShipState = {
  shipNo: number;
  size: number;
  shotsTaken: number;
  isSunk: boolean;
};
export type BothShipsCoords = { player: XYCoords[]; enemy: XYCoords[] };
export type BothShipsStates = { player: ShipState[]; enemy: ShipState[] };
export type BothShipPositions = {
  player: ShipPlotPoints[];
  enemy: ShipPlotPoints[];
};
