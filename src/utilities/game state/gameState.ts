import {
  BothShipsCoords,
  BothShipsStates,
  BothShipPositions,
  ShipState,
  TurnOpponent,
  TurnPlayer,
  XYCoords,
  GameState,
  Salvo,
} from "../../types/GameTypes";

export default function setupGameState(
  playerTurns = 0,
  enemyTurns = 0,
  salvo: Salvo = {
    player: { max: 5, remaining: 5 },
    enemy: { max: 5, remaining: 5 },
  },
  positions: BothShipPositions = { player: [], enemy: [] },
  shipsState: BothShipsStates = { player: [], enemy: [] },
  shipsHit: BothShipsCoords = { player: [], enemy: [] },
  shotsFiredHistory: BothShipsCoords = { player: [], enemy: [] }
): GameState {
  let playerHasWon = false;
  let gameHasEnded = false;
  let isPlayersTurn = true;

  function updateSalvoTotal(name: TurnPlayer, sunkShips: number) {
    salvo[name].remaining = salvo[name].max - sunkShips;
  }
  function checkIfPreviouslyHitTile(coords: XYCoords[], name: TurnPlayer) {
    return coords.map(({ x, y }) =>
      shotsFiredHistory[name].some((hist) => hist.x === x && hist.y === y)
    );
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
  function updatePositions(item: XYCoords[], name: TurnPlayer) {
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
      enemyTurns,
      shipsHit,
      positions,
      shipsState,
      shotsFiredHistory,
      isPlayersTurn,
      playerHasWon,
      gameHasEnded,
      salvo,
      checkIfPreviouslyHitTile,
    };
  }
  function modify() {
    return {
      updateSalvoTotal,
      updatePlayerHasWon,
      updateGameHasEnded,
      updateShotsFiredHistory,
      incrementTurnCounter,
      updateShipsHit,
      updatePositions,
      updateShipStates,
      swapTurn,
    };
  }
  return {
    modify,
    get,
  };
}
