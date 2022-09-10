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

export type Salvo = {
  player: { max: number; remaining: number };
  enemy: { max: number; remaining: number };
};
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
export interface GameState {
  modify: () => {
    updateSalvoTotal: (name: TurnPlayer, sunkShips: number) => void;
    updatePlayerHasWon: (bool: boolean) => void;
    updateGameHasEnded: (bool: boolean) => void;
    updateShotsFiredHistory: ({ x, y }: XYCoords, name: TurnPlayer) => void;
    incrementTurnCounter: (whosTurn: TurnPlayer) => void;
    updateShipsHit: (coords: XYCoords, name: TurnOpponent) => void;
    updatePositions: (item: XYCoords[], name: TurnPlayer) => void;
    updateShipStates: (sunkShips: ShipState[], name: TurnPlayer) => void;
    swapTurn: () => void;
  };
  get: () => {
    playerTurns: number;
    enemyTurns: number;
    shipsHit: BothShipsCoords;
    positions: BothShipPositions;
    shipsState: BothShipsStates;
    shotsFiredHistory: BothShipsCoords;
    isPlayersTurn: boolean;
    playerHasWon: boolean;
    gameHasEnded: boolean;
    salvo: {
      player: { max: number; remaining: number };
      enemy: { max: number; remaining: number };
    };
    checkIfPreviouslyHitTile: (
      coords: XYCoords[],
      name: TurnPlayer
    ) => boolean[];
  };
}

export interface GameFile {
  playerName: string;
  ID: number;
  state: [
    string,
    (
      | number
      | BothShipsStates
      | BothShipsCoords
      | {
          player: {
            max: number;
            remaining: number;
          };
          enemy: {
            max: number;
            remaining: number;
          };
        }
      | BothShipPositions
    )
  ][];
  salvo: boolean;
  playerBoard: Board;
  enemyBoard: Board;
}

export type SaveFile = GameFile[];
