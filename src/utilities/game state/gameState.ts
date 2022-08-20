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
  let enemyTurns = 0;

  const salvo = {
    player: { total: 5, remaining: 5 },
    enemy: { total: 5, remaining: 5 },
  };

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

  function updateSalvoTotal(name: TurnPlayer, sunkShips: number) {
    salvo[name].remaining = salvo[name].total - sunkShips;
  }
  function checkIfPreviouslyHitTile(coords: XYCoords[], name: TurnPlayer) {
    return coords.map(({ x, y }) =>
      shotsFiredHistory[name].some((hist) => hist.x === x && hist.y === y)
    );

    // return shotsFiredHistory[name].some(
    //   (coord) => coord.x === x && coord.y === y
    // );
  }
  function updateShotsFiredHistory({ x, y }: XYCoords, name: TurnPlayer) {
    shotsFiredHistory[name].push({ x, y });
  }
  function incrementTurnCounter(whosTurn: TurnPlayer) {
    whosTurn === "player" ? playerTurns++ : enemyTurns++;
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
  //TO DO change accept param and type it
  function get() {
    //get(turns).player
    return {
      playerTurns,
      shipsHit,
      positions,
      shipsState,
      isPlayersTurn,
      playerHasWon,
      gameHasEnded,
      salvo,
    };
  }

  return {
    updateSalvoTotal,
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
