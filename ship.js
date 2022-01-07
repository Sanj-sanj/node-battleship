const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function print(message) {
  return console.log(message);
}

function createEmptyBoard(ships) {
  if (!ships) return new Array(10).fill(new Array(10).fill(0));
}

function populateBoard({ updatePositions }, name) {
  //make ships
  let board = createEmptyBoard();
  const sizes = [5, 4, 3, 3, 2];

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
        const validMoves = Object.entries(directions).filter((v) =>
          v.includes(true)
        );
        if (!validMoves.length) {
          // print("potential fuckup");
          board[y][x] = initialPlot;
          initialPlot = 1;
          continue;
        }

        const randomDirection =
          validMoves[Math.floor(Math.random() * validMoves.length)][0];
        let [newBoard, path] = fillWithShipTiles(
          { x, y },
          board,
          size,
          shipTile,
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

function fillWithShipTiles({ x, y }, board, size, tile, direction) {
  const path = [{ y, x }];
  let tempBoard = [...board];
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
    const tempRow = [...tempBoard[verticalPointer]];
    tempRow[horizontalPointer] = tile;
    tempBoard[verticalPointer] = [...tempRow];
    path.push({ y: verticalPointer, x: horizontalPointer });
  }
  return [tempBoard, path];
}

function ascertainDirections({ x, y }, board, size) {
  const directions = {
    north: null,
    south: null,
    east: null,
    west: null,
  };

  Object.keys(directions).forEach((direction) => {
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

const prettyPrintBoard = (board) => {
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

function gameState() {
  let playerTurns = 0;
  let shipsSunk = [];
  const shipsHit = { player: [], enemy: [] };
  const positions = { player: [], enemy: [] };

  function updateTurns() {
    playerTurns++;
  }
  function updateSunk(sunkShips) {
    shipsSunk = [...sunkShips];
  }
  function updateShipsHit(coords, name) {
    shipsHit[name].push(coords);
  }
  function updatePositions(item, name) {
    positions[name].push(item);
  }
  function retrieve() {
    return { playerTurns, shipsHit, positions, shipsSunk };
  }

  return { updateTurns, updateShipsHit, updatePositions, updateSunk, retrieve };
}

async function setupGame() {
  const state = gameState();
  let playerHasWon = false;
  async function gameLoop(plBoard, enBoard, guessBoard) {
    const playerBoard = plBoard || populateBoard(state, "player");
    const enemyBoard = enBoard || populateBoard(state, "enemy");
    const guessingBoard = guessBoard || createEmptyBoard();

    const sunkenShips = mapSunkShips(
      state.retrieve().positions["enemy"],
      state.retrieve().shipsHit
    );
    // console.log(sunkenShips);
    const sunkShips = tallySunken(sunkenShips);
    state.updateSunk(sunkShips);
    // console.log(sunkShips);
    if (sunkShips.every(({ isSunk }) => isSunk === true)) {
      playerHasWon = true;
      return;
    }
    print("\nempty board");
    prettyPrintBoard(guessingBoard);
    // print("player board is:");
    // prettyPrintBoard(playerBoard);
    print("enemy board is:");
    prettyPrintBoard(enemyBoard);
    const { y, x } = await gatherInputs(enemyBoard);

    if (typeof x === "string") {
      //end game
      console.log("\nthanks for playing ");
      return;
    }
    const { hit, val } = checkForHit(y, x, enemyBoard);
    let fill = "";
    console.clear();
    if (hit) {
      fill = "\x1b[41m" + val + "\x1b[0m";
      if (
        !state.retrieve().shipsHit["enemy"].length ||
        !state
          .retrieve()
          .shipsHit["enemy"].find((coords) => coords.x === x && coords.y === y)
      ) {
        state.updateShipsHit({ y, x }, "enemy");
      } else {
        console.log("you already hit that");
      }
    } else {
      fill = "\x1b[43m" + val + "\x1b[0m";
    }
    state.updateTurns();
    const newGuessingBoard = fillTileWithHitMarker(y, x, fill, guessingBoard);
    return await gameLoop(playerBoard, enemyBoard, newGuessingBoard);
  }
  await gameLoop();
  if (playerHasWon) {
    print(
      `Good job\nAfter ${
        state.retrieve().playerTurns
      } mighty blows,\nYou've taken out ${
        state.retrieve().shipsHit["enemy"].length
      }\nThey've gone down yarr.`
    );
  } else {
    print(
      `Nice try\nAfter ${
        state.retrieve().playerTurns
      } mighty blows,\nYou've taken out ${state
        .retrieve()
        .shipsSunk.reduce(
          (acc, curr) => (curr.isSunk ? (acc += 1) : 0),
          0
        )}\nThey remain.`
    );
  }
}

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
      coords["enemy"].find(({ x, y }) => {
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

function gatherInputs(board) {
  let x, y;
  print('\nType "end" to end the game');
  return new Promise((resolve, reject) => {
    rl.question("Pick a letter: ", (char) => {
      if (char === "end") return resolve({ x: char, y: char });
      x = char.toLowerCase().charCodeAt() - 97;
      if (x >= 0 && x < board[0].length) {
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
  "Hello And welcome to battleship, the board is automatically generated rn \n"
);
setupGame();
