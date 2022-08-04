import {
  ShipPlotPoints,
  ShipState,
  TurnOpponent,
  TurnPlayer,
  XYCoords,
} from "../../types/GameTypes";

function setupGameState() {
  let playerHasWon = false;
  let gameHasEnded = false;
  let isPlayersTurn = true;
  let playerTurns = 0;
  let cpuTurns = 0;
  const shipsState = { player: [] as ShipState[], enemy: [] as ShipState[] };
  const shipsHit = { player: [] as XYCoords[], enemy: [] as XYCoords[] };
  const shotsFiredHistory = {
    player: [] as XYCoords[],
    enemy: [] as XYCoords[],
  };
  const positions = {
    player: [] as ShipPlotPoints[],
    enemy: [] as ShipPlotPoints[],
  };

  function checkIfPreviouslyHitTile({ x, y }: XYCoords, name: TurnPlayer) {
    return shotsFiredHistory[name].some(
      (coord) => coord.x === x && coord.y === y
    );
  }
  function updateShotsFiredHistory({ x, y }: XYCoords, name: TurnPlayer) {
    shotsFiredHistory[name].push({ x, y });
  }
  function incrementTurnCounter(whosTurn: TurnPlayer) {
    whosTurn === "player" ? playerTurns++ : cpuTurns++;
  }
  function updateShipStates(sunkShips: ShipState[], name: TurnPlayer) {
    shipsState[name] = [...sunkShips];
  }
  function updateShipsHit(coords: XYCoords, name: TurnOpponent) {
    shipsHit[name].push(coords);
  }
  function updatePositions(item: ShipPlotPoints, name: TurnPlayer) {
    positions[name].push(item);
  }
  function swapTurn() {
    isPlayersTurn = !isPlayersTurn;
  }
  function updatePlayerHasWon(bool: boolean) {
    playerHasWon = bool;
  }
  function updateGameHasEnded(bool: boolean) {
    gameHasEnded = bool;
  }

  function get() {
    return {
      playerTurns,
      shipsHit,
      positions,
      shipsState,
      isPlayersTurn,
      playerHasWon,
      gameHasEnded,
    };
  }

  return {
    checkIfPreviouslyHitTile,
    updatePlayerHasWon,
    updateGameHasEnded,
    updateShotsFiredHistory,
    incrementTurnCounter,
    updateShipsHit,
    updatePositions,
    updateShipStates,
    swapTurn,
    get,
  };
}
const state = setupGameState();
export default state;
