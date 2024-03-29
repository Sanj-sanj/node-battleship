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
  Board,
  LastBuiltBoards,
} from "../../types/GameTypes";
import createEmptyBoard from '../game logic/board/createEmptyBoard.js'

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
  shotsFiredHistory: BothShipsCoords = { player: [], enemy: [] },
  boards: LastBuiltBoards = { player: createEmptyBoard(), enemy: createEmptyBoard(), guessBoard: createEmptyBoard()}
): GameState {
  let playerHasWon = false;
  let gameHasEnded = false;
  let isPlayersTurn = true;

  function saveBoards(bothBoards: { player: Board; enemy: Board, guessBoard: Board }) {
    boards = bothBoards;
  }
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
      boards,
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
      saveBoards,
    };
  }
  return {
    modify,
    get,
  };
}
