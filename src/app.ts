const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/*
 ========================
        TYPES
 ========================
*/
type BoardRow = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number
];
type Board = [
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

type CompassDirectionSingles = "north" | "south" | "east" | "west";
type CompassDirection = [CompassDirectionSingles];
type XYCoords = { x: number; y: number };
/*
 ========================
        TYPES
 ========================
*/

function print(message: string) {
  return console.log(message);
}

function createEmptyBoard(size: number = 10) {
  return new Array(10).fill(new Array(10).fill(0)) as Board;
}

function populateBoard(
  {
    updatePositions,
  }: { updatePositions: (path: XYCoords, name: "player" | "enemy") => void },
  name: "player" | "enemy"
) {
  //make ships
  let board = createEmptyBoard();
  const sizes = [5, 4, 3, 3, 2];
  let a = board[1][0];
  sizes.forEach((size) => {
    const getXY = () => {
      const y = Math.floor(Math.random() * board.length);
      const x = Math.floor(Math.random() * board[y].length);
      return [y, x];
    };
    const shipTile = size;
    const shipTOP = size;
    // const shipTile = "\x1b[35m" + size + "\x1b[0m";
    // const shipTOP = "\x1b[46m" + size + "\x1b[0m";
    let initialPlot = 1;
    let x, y;

    while (initialPlot !== 0) {
      [y, x] = getXY();
      initialPlot = board[y][x];
      // print("this is initial before its alterd", initialPlot);
      if (initialPlot === 0) {
        board[y] = [...board[y]];
        board[y][x] = shipTOP;
        const directions = ascertainDirections({ x, y }, board, size);
        const validMoves = Object.entries(directions).filter((v) => v);
        if (!validMoves.length) {
          // print("potential fuckup");
          board[y][x] = initialPlot;
          initialPlot = 1;
          continue;
        }
        //randomDirection : CompassDirection
        const randomDirection = validMoves[
          Math.floor(Math.random() * validMoves.length)
        ][0] as CompassDirectionSingles;
        let [newBoard, path] = fillWithShipTiles(
          { x, y },
          board,
          size,
          randomDirection
        );
        updatePositions(path, name);
        board = newBoard;
        break;
      }
    }
  });
  return board;
}

function fillWithShipTiles(
  { x, y }: XYCoords,
  board: Board,
  size: number,
  direction: "north" | "south" | "east" | "west"
): [Board, XYCoords] {
  const path = [{ y, x }];
  let tempBoard = [...board] as Board;
  let counter = size;
  const startPointer = direction === "north" || direction === "south" ? y : x;
  for (
    let i =
      direction === "east" || direction === "south"
        ? startPointer + 1
        : startPointer - 1;
    counter > 1 && i >= 0;
    direction === "north" || direction === "west" ? i-- : i++, counter--
  ) {
    const horizontalPointer =
      direction === "north" || direction === "south" ? x : i;
    const verticalPointer =
      direction === "north" || direction === "south" ? i : y;
    const tempRow = [...tempBoard[verticalPointer]] as BoardRow;
    tempRow[horizontalPointer] = size;
    tempBoard[verticalPointer] = [...tempRow];
    path.push({ y: verticalPointer, x: horizontalPointer });
  }
  return [tempBoard, path];
}

function ascertainDirections(
  { x, y }: { x: number; y: number },
  board: Board,
  size: number
) {
  type MoveableDirectionState = null | true | false;
  const directions = {
    north: null as MoveableDirectionState,
    south: null as MoveableDirectionState,
    east: null as MoveableDirectionState,
    west: null as MoveableDirectionState,
  };

  const compassDirections = Object.keys(directions) as CompassDirection;
  compassDirections.forEach((direction) => {
    let counter = size;
    const tempBoard = [...board];
    const pointer = direction === "north" || direction === "south" ? y : x;
    for (
      let i =
        direction === "north" || direction === "west"
          ? pointer - 1
          : pointer + 1;
      counter > 1;
      direction === "north" || direction === "west" ? i-- : i++, counter--
    ) {
      const yIndex = direction === "north" || direction === "south" ? i : y;
      const xIndex = direction === "north" || direction === "south" ? x : i;
      try {
        if (tempBoard[yIndex][xIndex] !== 0) {
          directions[direction] = false;
          break;
        }
      } catch (error) {
        // print("unreachable coordinate, path failed");
        directions[direction] = false;
        break;
      }
    }
    if (directions[direction] !== false) {
      directions[direction] = true;
    }
  });
  return directions;
}

const prettyPrintBoard = (board: Board) => {
  print("\n     A B C D E F G H I J");
  let lineNum = 1;
  for (const line of board) {
    print(
      `${lineNum} `.padEnd(3) +
        `|${line.reduce((acc, curr) => (acc += curr + " "), " ")}|`
    );
    lineNum++;
  }
};

function tallySunken(sunkenShips) {
  return sunkenShips.map(({ counter, size }, i) => {
    return {
      shipNo: i,
      size,
      isSunk: size !== 0 && counter === size ? true : false,
    };
  });
}

function mapSunkShips(enemyPositions, coords) {
  const mappedHits = enemyPositions.map((ship) => {
    let counter = 0;
    let size = 0;
    ship.forEach((pos) =>
      coords.find(({ x, y }) => {
        pos.x === x && pos.y === y ? counter++ : null;
        size = ship.length;
      })
    );
    return { counter, size };
  });
  return mappedHits;
}

function fillTileWithHitMarker(y, x, newFill, board) {
  const row = [...board[y]];
  row[x] = newFill;
  let temp = [...board];
  temp[y] = row;
  return temp;
}

function gameState() {
  let isPlayersTurn = true;
  let playerTurns = 0;
  let cpuTurns = 0;
  const shipsSunk = { player: [], enemy: [] };
  const shipsHit = { player: [], enemy: [] };
  const positions = { player: [], enemy: [] };

  function updateTurns(whosTurn) {
    whosTurn === "player" ? playerTurns++ : cpuTurns++;
  }
  function updateSunk(sunkShips, name) {
    shipsSunk[name] = [...sunkShips];
  }
  function updateShipsHit(coords, name) {
    shipsHit[name].push(coords);
  }
  function updatePositions(item, name) {
    positions[name].push(item);
  }
  function retrieve() {
    return { playerTurns, shipsHit, positions, shipsSunk, isPlayersTurn };
  }
  function swapTurn() {
    isPlayersTurn = !isPlayersTurn;
  }

  return {
    updateTurns,
    updateShipsHit,
    updatePositions,
    updateSunk,
    swapTurn,
    retrieve,
  };
}

async function setupGame() {
  const state = gameState();
  let playerHasWon = false;
  let gameHasEnded = false;

  async function gameLoop(plBoard, enBoard, guessBoard) {
    console.clear();
    const playerBoard = plBoard || populateBoard(state, "player");
    const enemyBoard = enBoard || populateBoard(state, "enemy");
    const guessingBoard = guessBoard || createEmptyBoard();

    const playersTurn = state.retrieve().isPlayersTurn;
    const evaluationBoard = playersTurn ? enemyBoard : playerBoard;
    const evaluateAgainst = playersTurn ? "enemy" : "player";
    const currentTurn = playersTurn ? "player" : "enemy";
    // console.log(evaluateAgainst)
    //By updating the sunkenShips on the start of each gameLoop, the printed board will not reflect changes untill its time for the player's next turn.
    const sunkenShips = mapSunkShips(
      state.retrieve().positions[evaluateAgainst],
      state.retrieve().shipsHit[evaluateAgainst]
    );

    console.log(state.retrieve().positions);
    const sunkShips = tallySunken(sunkenShips);
    state.updateSunk(sunkShips, evaluateAgainst);
    if (sunkShips.every(({ isSunk }) => isSunk === true)) {
      playerHasWon = true;
      gameHasEnded = true;
      return true;
    }
    function printBoards(debug = false) {
      print("\nYour guess board");
      prettyPrintBoard(guessingBoard);
      if (debug) {
        print("\nYour ENEMY'S is:");
        prettyPrintBoard(enemyBoard);
      } else {
        print("\nYour board is:");
        prettyPrintBoard(playerBoard);
      }
    }
    console.log(playersTurn ? "Player's turn" : "AI turn");
    // Board state shown while player plays their turn move.
    // this function call will not print on enemy's turn
    printBoards();

    //If it is the players turn, we are evaluating the shots fired on the rival board. and updating that turn's (player/ai) board

    let y, x;
    if (playersTurn) ({ y, x } = await gatherInputs(evaluationBoard));
    else {
      y = Math.floor(Math.random() * evaluationBoard.length);
      x = Math.floor(Math.random() * evaluationBoard[y].length);
    }
    if (typeof x === "string") {
      //end game
      gameHasEnded = true;
      print("\nThanks for playing");
      return true;
    }
    const { hit, val } = checkForHit(y, x, evaluationBoard);
    let fill = "";
    console.clear();
    // NEED A WAY TO BLOCK THE PROCESS DURING ENEMY TURN SO PLAYER CAN SEE THEIR MOVES INREALTIME RATHER THAN ALL AT ONCE
    if (hit) {
      print(
        playersTurn
          ? `You land a hit at Y: ${y + 1}, X: ${x + 1}`
          : `The enemy lands a hit at Y: ${y + 1}, X: ${x + 1}`
      );
      fill = "\x1b[41m" + val + "\x1b[0m";
      if (
        !state.retrieve().shipsHit[evaluateAgainst].length ||
        !state
          .retrieve()
          .shipsHit[evaluateAgainst].find(
            (coords) => coords.x === x && coords.y === y
          )
      ) {
        state.updateShipsHit({ y, x }, evaluateAgainst);
      } else {
        print("You've already shot a cannonball there, try another space.");
      }
    } else {
      //turn player shot misses
      print(
        playersTurn
          ? `Your shot misses at Y: ${y + 1}, X: ${x + 1}`
          : `The enemy's shot misses at Y: ${y + 1}, X: ${x + 1}`
      );
      state.swapTurn();
      fill = "\x1b[43m" + val + "\x1b[0m";
    }
    state.updateTurns(currentTurn);
    const newPlayerBoard = !playersTurn
      ? fillTileWithHitMarker(y, x, fill, playerBoard)
      : playerBoard;
    const newGuessingBoard = playersTurn
      ? fillTileWithHitMarker(y, x, fill, guessingBoard)
      : guessingBoard;

    //printBoards() here because without it, the function moves out to the outter body before the setTimeout executes.
    // board printed right after either player or the AI finish their moves
    // After the AI finishes their move, this function call is the one that persists on screen
    printBoards();

    //by enveloping gameLoop in a setTimeout to delay by `n` seconds, the promise guarantees it will not fire untill completion of the timeout AND we will not prematurely return a non promise based value, which will continue thread of execturion after first return
    return new Promise((res) => {
      setTimeout(async () => {
        res(await gameLoop(newPlayerBoard, enemyBoard, newGuessingBoard));
      }, 3000);
    });
  }
  await gameLoop();
  if (gameHasEnded) {
    if (playerHasWon) {
      print(
        `Good job\nAfter ${
          state.retrieve().playerTurns
        } mighty blows,\nYou've taken out ${state
          .retrieve()
          .shipsHit.enemy.reduce(
            (acc, curr) => (curr.isSunk ? (acc += 1) : acc),
            0
          )}\nThey've gone down yarr.`
      );
    } else {
      print(
        `Nice try\nAfter ${
          state.retrieve().playerTurns
        } mighty blows,\nYou've taken out ${state
          .retrieve()
          .shipsSunk.enemy.reduce(
            (acc, curr) => (curr.isSunk ? (acc += 1) : acc),
            0
          )}\nThey remain.`
      );
    }
  }
  /*
  !!!! once the game goes past one turn, the thread of execution continues on and does the rest of 
  this outter body function which isnt what we want, completing the game just skips out on stats stuff. 

  create gameHasEnded:boolean, if bool === true, display these messages else void to avoid skipping to these
  outter body if statements during the period inbetween setTimeout and await gameLoop
  */
}

function gatherInputs(board) {
  let x, y;
  print('\nType "end" to end the game');
  return new Promise((resolve, reject) => {
    rl.question("Pick a letter: ", (char) => {
      if (char === "end") return resolve({ x: char, y: char });
      x = char.toLowerCase().charCodeAt() - 97;
      if (char.length === 1 && x >= 0 && x < board[0].length) {
        // print(x, char);
        rl.question("Pick a number: ", (num) => {
          y = parseInt(num) - 1;
          if (y >= 0 && y < board.length) {
            resolve({ y, x });
          } else {
            reject(print("Number not in range try again."));
          }
        });
      } else {
        reject(print("Character not in range try another input."));
      }
    });
  })
    .then((coordinates) => coordinates)
    .catch(() => gatherInputs(board));
}

function checkForHit(y, x, boardToCheck) {
  return boardToCheck[y][x] === 0
    ? { hit: false, val: boardToCheck[y][x] }
    : { hit: true, val: boardToCheck[y][x] };
}

print(
  "\nHello And welcome to battleship, the boards are automatically generated currently.\nThe board up top tracks where all the shots you fire on your enemy land.\nRed colored tiles indicate a hit, the number represents the size of the battleship.\n\n(A red 4 tile represents a hit on a battleship that's four tiles of size, either horizontal or veritcal)"
);
setupGame();
