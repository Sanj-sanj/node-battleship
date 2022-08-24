import {
  BothShipsCoords,
  BothShipsStates,
  BothShipPositions,
  ShipState,
  TurnOpponent,
  TurnPlayer,
  XYCoords,
  GameState,
} from "../../types/GameTypes";

export default function setupGameState(): GameState {
  let playerHasWon = false;
  let gameHasEnded = false;
  let isPlayersTurn = true;
  let playerTurns = 0;
  let enemyTurns = 0;

  const salvo = {
    player: { max: 5, remaining: 5 },
    enemy: { max: 5, remaining: 5 },
  };

  const positions = { player: [], enemy: [] } as BothShipPositions;
  const shipsState = { player: [], enemy: [] } as BothShipsStates;
  const shipsHit = { player: [], enemy: [] } as BothShipsCoords;
  const shotsFiredHistory = { player: [], enemy: [] } as BothShipsCoords;

  function updateSalvoTotal(name: TurnPlayer, sunkShips: number) {
    salvo[name].remaining = salvo[name].max - sunkShips;
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
  //TO DO change accept param and type it

  function get() {
    // key:
    //   | "playerTurns"
    //   | "shipsHit"
    //   | "positions"
    //   | "shipsState"
    //   | "isPlayersTurn"
    //   | "playerHasWon"
    //   | "gameHasEnded"
    return {
      playerTurns: playerTurns,
      shipsHit: shipsHit,
      positions: positions,
      shipsState: shipsState,
      isPlayersTurn: isPlayersTurn,
      playerHasWon: playerHasWon,
      gameHasEnded: gameHasEnded,
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
// const state = setupGameState();
// export default state;
