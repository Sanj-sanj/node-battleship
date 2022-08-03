// import inquirer, { Answers, Question } from "inquirer";
// const prompt = inquirer.createPromptModule();

import initiateApp from "./index.js";

// /*
//  ========================
//         TYPES
//  ========================
// */
// type TurnPlayer = "player" | "enemy";
// type TurnOpponent = "player" | "enemy";

// type BoardRow = [
//   string,
//   string,
//   string,
//   string,
//   string,
//   string,
//   string,
//   string,
//   string,
//   string
// ];
// type Board = [
//   BoardRow,
//   BoardRow,
//   BoardRow,
//   BoardRow,
//   BoardRow,
//   BoardRow,
//   BoardRow,
//   BoardRow,
//   BoardRow,
//   BoardRow
// ];

// type CompassDirectionSingles = "north" | "south" | "east" | "west";
// type CompassDirection = [CompassDirectionSingles];
// type XYCoords = { x: number; y: number };
// type ShipPlotPoints = XYCoords[];

// type ShipTilesHitAndSizeTuple = { counter: number; size: number };
// type ShipState = {
//   shipNo: number;
//   size: number;
//   shotsTaken: number;
//   isSunk: boolean;
// };

// interface InquirerTitleSelectAnswers extends Answers {
//   titleSelection: GameMenuChoices;
// }

// type GameMenuChoices =
//   | "Start Game"
//   | "Load Game*"
//   | "Highscores*"
//   | "Instructions"
//   | "Quit Application";

// type InquirerQuestionMenuSelect = {
//   type: "list";
//   name: "titleSelection";
//   message: "please select an option";
//   choices: GameMenuChoices[];
// };
// /*
//  ========================
//         TYPES
//  ========================
// */

// function print(message: string) {
//   return console.log(message);
// }

// function createEmptyBoard(size = 10) {
//   return new Array(10).fill(new Array(10).fill("0")) as Board;
// }

// function populateBoard(
//   board: Board,
//   updatePositions: (path: ShipPlotPoints, name: TurnPlayer) => void,
//   name: "player" | "enemy"
// ) {
//   //make empty board [[0x10]x10]
//   // let board = createEmptyBoard();
//   const sizes = [5, 4, 3, 3, 2];
//   sizes.forEach((size) => {
//     const getRandomInitialPlot = (): [number, number] => {
//       const y = Math.floor(Math.random() * board.length);
//       const x = Math.floor(Math.random() * board[y].length);
//       return [y, x];
//     };
//     const shipTile = size;
//     // const shipTile = "\x1b[35m" + size + "\x1b[0m";
//     // const shipInitialPlot = "\x1b[46m" + size + "\x1b[0m";
//     let initialTileToCheck = 1;
//     const coords = { x: 0, y: 0 };
//     let { x, y } = coords;

//     while (initialTileToCheck !== 0) {
//       [y, x] = getRandomInitialPlot();
//       initialTileToCheck = parseInt(board[y][x]);
//       const currentlyCheckingTile = board[y][x];
//       // print("this is initial before its alterd", initialPlot);
//       if (currentlyCheckingTile === "0") {
//         board[y] = [...board[y]];
//         board[y][x] = shipTile.toString();
//         const directions = ascertainDirections({ x, y }, board, size);
//         const validDirections = Object.entries(directions).filter((v) => v[1]);
//         if (!validDirections.length) {
//           // print("potential fuckup");
//           board[y][x] = initialTileToCheck.toString();
//           initialTileToCheck = 1;
//           continue;
//         }
//         //Pick a random valid direction
//         const buildDirection = validDirections[
//           Math.floor(Math.random() * validDirections.length)
//         ][0] as CompassDirectionSingles;

//         const [newBoard, shipPlotPoints] = buildShips(
//           { x, y },
//           board,
//           size,
//           buildDirection
//         );
//         updatePositions(shipPlotPoints, name);
//         board = newBoard;
//         break;
//       }
//     }
//   });
//   return board;
// }

// function buildShips(
//   { x, y }: XYCoords,
//   board: Board,
//   size: number,
//   direction: CompassDirectionSingles
// ): [Board, ShipPlotPoints] {
//   // y = parseInt(y), x = parseInt(x)
//   const shipPlots: ShipPlotPoints = [{ x, y }];
//   const tempBoard = [...board] as Board;
//   let counter = size;
//   const startPointer = direction === "north" || direction === "south" ? y : x;
//   for (
//     let i =
//       direction === "east" || direction === "south"
//         ? startPointer + 1
//         : startPointer - 1;
//     counter > 1 && i >= 0;
//     direction === "north" || direction === "west" ? i-- : i++, counter--
//   ) {
//     const horizontalPointer =
//       direction === "north" || direction === "south" ? x : i;
//     const verticalPointer =
//       direction === "north" || direction === "south" ? i : y;
//     const tempRow = [...tempBoard[verticalPointer]] as BoardRow;
//     //replaces the individual tile with a custom color tile if wanted
//     tempRow[horizontalPointer] = size.toString();
//     tempBoard[verticalPointer] = [...tempRow];
//     shipPlots.push({ x: horizontalPointer, y: verticalPointer });
//   }
//   return [tempBoard, shipPlots];
// }

// function ascertainDirections({ x, y }: XYCoords, board: Board, size: number) {
//   type MoveableDirectionState = null | true | false;
//   const directions = {
//     north: null as MoveableDirectionState,
//     south: null as MoveableDirectionState,
//     east: null as MoveableDirectionState,
//     west: null as MoveableDirectionState,
//   };

//   const compassDirections = Object.keys(directions) as CompassDirection;
//   compassDirections.forEach((direction) => {
//     let counter = size;
//     const tempBoard = [...board].map((row) => row.map((n) => n));
//     const pointer = direction === "north" || direction === "south" ? y : x;
//     for (
//       let i =
//         direction === "north" || direction === "west"
//           ? pointer - 1
//           : pointer + 1;
//       counter > 1;
//       direction === "north" || direction === "west" ? i-- : i++, counter--
//     ) {
//       const yIndex = direction === "north" || direction === "south" ? i : y;
//       const xIndex = direction === "north" || direction === "south" ? x : i;
//       try {
//         if (tempBoard[yIndex][xIndex] !== "0") {
//           directions[direction] = false;
//           break;
//         }
//       } catch (error) {
//         // print("unreachable coordinate, path failed");
//         directions[direction] = false;
//         break;
//       }
//     }
//     if (directions[direction] !== false) {
//       directions[direction] = true;
//     }
//   });
//   return directions;
// }

// const prettyPrintBoard = (board: Board) => {
//   print("\n     A B C D E F G H I J");
//   let lineNum = 1;
//   for (const line of board) {
//     print(
//       `${lineNum} `.padEnd(3) +
//         `|${line.reduce((acc, curr) => (acc += curr + " "), " ")}|`
//     );
//     lineNum++;
//   }
// };

// function tallySunken(sunkenShips: ShipTilesHitAndSizeTuple[]) {
//   return sunkenShips.map(({ counter, size }, i) => {
//     return {
//       shipNo: i,
//       size,
//       shotsTaken: counter,
//       isSunk: size !== 0 && counter === size ? true : false,
//     };
//   });
// }

// function mapSunkShips(enemyPositions: ShipPlotPoints[], coords: XYCoords[]) {
//   const mappedHits = enemyPositions.map((ship) => {
//     let counter = 0;
//     let size = 0;
//     ship.forEach((pos) =>
//       coords.find(({ x, y }) => {
//         pos.x === x && pos.y === y ? counter++ : null;
//         size = ship.length;
//       })
//     );
//     return { counter, size };
//   });
//   return mappedHits;
// }

// function fillTileWithHitMarker({ y, x }: XYCoords, tile: string, board: Board) {
//   const row = [...board[y]] as BoardRow;
//   row[x] = tile;
//   const newBoard = [...board] as Board;
//   newBoard[y] = row;
//   return newBoard;
// }
// function gameState() {
//   let isPlayersTurn = true;
//   let playerTurns = 0;
//   let cpuTurns = 0;
//   const shipsState = { player: [] as ShipState[], enemy: [] as ShipState[] };
//   const shipsHit = { player: [] as XYCoords[], enemy: [] as XYCoords[] };
//   const shotsFiredHistory = {
//     player: [] as XYCoords[],
//     enemy: [] as XYCoords[],
//   };
//   const positions = {
//     player: [] as ShipPlotPoints[],
//     enemy: [] as ShipPlotPoints[],
//   };

//   function checkIfPreviouslyHitTile({ x, y }: XYCoords, name: TurnPlayer) {
//     return shotsFiredHistory[name].some(
//       (coord) => coord.x === x && coord.y === y
//     );
//   }
//   function updateShotsFiredHistory({ x, y }: XYCoords, name: TurnPlayer) {
//     shotsFiredHistory[name].push({ x, y });
//   }
//   function incrementTurnCounter(whosTurn: TurnPlayer) {
//     whosTurn === "player" ? playerTurns++ : cpuTurns++;
//   }
//   function updateShipStates(sunkShips: ShipState[], name: TurnPlayer) {
//     shipsState[name] = [...sunkShips];
//   }
//   function updateShipsHit(coords: XYCoords, name: TurnOpponent) {
//     shipsHit[name].push(coords);
//   }
//   function updatePositions(item: ShipPlotPoints, name: TurnPlayer) {
//     positions[name].push(item);
//   }
//   function swapTurn() {
//     isPlayersTurn = !isPlayersTurn;
//   }
//   function get() {
//     return { playerTurns, shipsHit, positions, shipsState, isPlayersTurn };
//   }

//   return {
//     checkIfPreviouslyHitTile,
//     updateShotsFiredHistory,
//     incrementTurnCounter,
//     updateShipsHit,
//     updatePositions,
//     updateShipStates,
//     swapTurn,
//     get,
//   };
// }

// async function setupGame() {
//   const state = gameState();
//   let playerHasWon = false;
//   let gameHasEnded = false;

//   async function gameLoop(
//     plBoard: void | Board,
//     enBoard: void | Board,
//     guessBoard: void | Board
//   ) {
//     console.clear();
//     const playerBoard =
//       plBoard ||
//       populateBoard(createEmptyBoard(), state.updatePositions, "player");
//     const enemyBoard =
//       enBoard ||
//       populateBoard(createEmptyBoard(), state.updatePositions, "enemy");
//     const guessingBoard = guessBoard || createEmptyBoard();

//     const playersTurn = state.get().isPlayersTurn;
//     const evaluationBoard = playersTurn ? enemyBoard : playerBoard;
//     const turnOpponent = playersTurn ? "enemy" : "player";
//     const turnPlayer = playersTurn ? "player" : "enemy";
//     const gameRenderMS = 2250;

//     //By updating the sunkenShips on the start of each gameLoop, the printed board will not reflect changes untill its time for the player's next turn.
//     const sunkenShips = mapSunkShips(
//       state.get().positions[turnOpponent],
//       state.get().shipsHit[turnOpponent]
//     );
//     const sunkShips = tallySunken(sunkenShips);
//     state.updateShipStates(sunkShips, turnOpponent);

//     if (sunkShips.every(({ isSunk }) => isSunk === true)) {
//       playerHasWon = true;
//       gameHasEnded = true;
//       return true;
//     }
//     function printBoards(debug = false) {
//       if (debug) {
//         print("\nYour ENEMY'S is:");
//         prettyPrintBoard(enemyBoard);
//       } else {
//         print("\nYour guess board");
//         prettyPrintBoard(guessingBoard);
//       }
//       print("\nYour board is:");
//       prettyPrintBoard(playerBoard);
//     }
//     print(playersTurn ? "Player's turn" : "AI turn");
//     // Board state shown while player plays their turn move.
//     // this function call will not print on enemy's turn
//     printBoards(true);

//     //If it is the players turn, we are evaluating the shots fired on the rival board. and updating that turn's (player/ai) board
//     const initialCoords: XYCoords = { x: 0, y: 0 };
//     let { y, x } = initialCoords;
//     if (playersTurn) {
//       const result = await gatherPlayersInputs();
//       if (typeof result === "object") {
//         (y = result.y), (x = result.x);
//       } else if (result === "end") {
//         //end game logic here?
//         gameHasEnded = true;
//         print("\nThanks for playing");
//         return true;
//       }
//     } else {
//       y = Math.floor(Math.random() * evaluationBoard.length);
//       x = Math.floor(Math.random() * evaluationBoard[y].length);
//     }
//     // UTILS ===================================
//     const red = (tile: string) => "\x1b[41m" + tile + "\x1b[0m";
//     const yellow = (tile: string) => "\x1b[43m" + tile + "\x1b[0m";
//     // UTILS ===================================

//     const { hit, tile } = checkForHit({ y, x }, evaluationBoard);
//     const repeatShot = state.checkIfPreviouslyHitTile({ x, y }, turnPlayer);
//     let fill = tile;

//     console.clear();
//     if (!hit && repeatShot && turnPlayer === "player") {
//       print("You've already shot a cannonball there, try another space.");
//       fill = yellow(tile);
//     } else if (hit && repeatShot && turnPlayer === "player") {
//       print("You've already shot a cannonball there, try another space.");
//       fill = red(tile);
//     } else {
//       state.updateShotsFiredHistory({ x, y }, turnPlayer);
//       if (hit) {
//         state.updateShipsHit({ x, y }, turnOpponent);
//         print(
//           playersTurn
//             ? `You land a hit at Y: ${y + 1}, X: ${x + 1}`
//             : `The enemy lands a hit at Y: ${y + 1}, X: ${x + 1}`
//         );
//         fill = red(tile);
//       } else {
//         //turn player shot misses
//         print(
//           playersTurn
//             ? `Your shot misses at Y: ${y + 1}, X: ${x + 1}`
//             : `The enemy's shot misses at Y: ${y + 1}, X: ${x + 1}`
//         );
//         fill = yellow(tile);
//       }
//       state.swapTurn();
//       state.incrementTurnCounter(turnPlayer);
//     }

//     const newPlayerBoard = !playersTurn
//       ? fillTileWithHitMarker({ x, y }, fill, playerBoard)
//       : playerBoard;
//     const newGuessingBoard = playersTurn
//       ? fillTileWithHitMarker({ x, y }, fill, guessingBoard)
//       : guessingBoard;

//     //printBoards() here because without it, the function moves out to the outter body before the setTimeout executes.
//     // board printed right after either player or the AI finish their moves and persists during the timeout for the new board.
//     // After the turnPlayer finishes their move, this function call is the one that persists on screen
//     printBoards();

//     //by enveloping gameLoop in a setTimeout to delay by `n` seconds, the promise guarantees it will not fire untill completion of the timeout AND we will not prematurely return a non promise based value, which will continue thread of execturion after first return
//     return new Promise((res) => {
//       setTimeout(async () => {
//         res(await gameLoop(newPlayerBoard, enemyBoard, newGuessingBoard));
//       }, gameRenderMS);
//     });
//   }
//   await gameLoop();
//   if (gameHasEnded) {
//     //below logic  shold become a return statement or change this fnc return statement
//     if (playerHasWon) {
//       print(
//         `Good job\nAfter ${
//           state.get().playerTurns
//         } mighty blows,\nYou've taken out ${state
//           .get()
//           .shipsState.enemy.reduce(
//             (acc, curr) => (curr.isSunk ? (acc += 1) : acc),
//             0
//           )}\nThey've gone down yarr.`
//       );
//     } else {
//       print(
//         `Nice try\nAfter ${
//           state.get().playerTurns
//         } mighty blows,\nYou've taken out ${state
//           .get()
//           .shipsState.enemy.reduce(
//             (acc, curr) => (curr.isSunk ? (acc += 1) : acc),
//             0
//           )}\nThey remain.`
//       );
//     }
//   }

//   return state.get().shipsState;
// }

// type ValidGameInputTypes = (value: string | number) => boolean | string;

// interface InquirerPlayerInputs extends Question {
//   type: "input";
//   name: "row" | "column";
//   message: string;
//   validate: (value: string | number) => boolean | string;
// }
// function gatherPlayersInputs(): Promise<XYCoords | "end"> {
//   print('\nType "end" to end the game');

//   const testQuestions: InquirerPlayerInputs[] = [
//     {
//       type: "input",
//       name: "row",
//       message: "Select a letter: ",
//       validate(value) {
//         if (typeof value === "string" && value.toLocaleLowerCase() === "end") {
//           return true;
//         } else if (
//           typeof value === "string" &&
//           value.length === 1 &&
//           value.toLowerCase().match(/[a-j]/g)
//         ) {
//           return true;
//         }
//         return "Please enter a valid letter [A - J].";
//       },
//     },
//     {
//       type: "input",
//       name: "column",
//       message: "Select a number: ",
//       validate(value) {
//         if (typeof value === "string" && value.toLowerCase() === "end") {
//           return true;
//         } else if (
//           typeof value === "string" &&
//           !Number.isNaN(parseInt(value)) &&
//           parseInt(value) >= 1 &&
//           parseInt(value) <= 10
//         ) {
//           return true;
//         }
//         return "Please enter a valid number [1 - 10].";
//       },
//       when(answer) {
//         return answer.row !== "end";
//       },
//     },
//   ];

//   return prompt(testQuestions).then((answers) => {
//     if (answers.row === "end" || answers?.column === "end") {
//       return "end";
//     }
//     return {
//       x: answers.row.toLowerCase().charCodeAt(0) - 97,
//       y: answers.column - 1,
//     } as XYCoords;
//   });
// }

// function checkForHit({ y, x }: XYCoords, boardToCheck: Board) {
//   return boardToCheck[y][x] === "0"
//     ? { hit: false, tile: boardToCheck[y][x] }
//     : { hit: true, tile: boardToCheck[y][x] };
// }

// async function initiateApp() {
//   console.clear();
//   print(`
//   ____       _______ _______ _      ______  _____ _    _ _____ _____
//  |  _ \\   /\\|__   __|__   __| |    |  ____|/ ____| |  | |_   _|  __ \\
//  | |_) | /  \\  | |     | |  | |    | |__  | (___ | |__| | | | | |__) |
//  |  _ < / /\\ \\ | |     | |  | |    |  __|  \\___ \\|  __  | | | |  ___/
//  | |_) / ____ \\| |     | |  | |____| |____ ____) | |  | |_| |_| |
//  |____/_/    \\_\\_|     |_|  |______|______|_____/|_|  |_|_____|_|

// `);

//   const { titleSelection } = await userMenuSelect();

//   switch (titleSelection) {
//     case "Start Game":
//       new Promise((res) => res(setupGame())).then(() =>
//         setTimeout(() => initiateApp(), 2000)
//       );
//       break;

//     case "Quit Application":
//       exitGame();
//       break;

//     case "Instructions":
//       showInstructions();
//       break;

//     default:
//       break;
//   }
// }

// function showInstructions() {
//   console.clear();
//   print(`
//   _____ _   _  _____ _______ _____  _    _  _____ _______ _____ ____  _   _  _____
//  |_   _| \\ | |/ ____|__   __|  __ \\| |  | |/ ____|__   __|_   _/ __ \\| \\ | |/ ____|
//    | | |  \\| | (___    | |  | |__) | |  | | |       | |    | || |  | |  \\| | (___
//    | | | . \` |\\___ \\   | |  |  _  /| |  | | |       | |    | || |  | | . \` |\\___ \\
//   _| |_| |\\  |____) |  | |  | | \\ \\| |__| | |____   | |   _| || |__| | |\\  |____) |
//  |_____|_| \\_|_____/   |_|  |_|  \\_\\\\____/ \\_____|  |_|  |_____\\____/|_| \\_|_____/

//   `);
//   print(`
//   Your board is automatically generated.
//   Each battleships is laid out vertical or horizontal, they will never be diagonal.

//   The board up top is used to track all the shots you have fire at your enemy.
//   The bottom board contains your ships and the enemys shot's will be tracked here.
//   Red coloured tiles indicate a hit, a yellow indicates a miss.

//   The number of the tile represents the size of the battleship.
//   (ex: A red 4 tile represents a hit on a battleship that's four tiles of size, either horizontal or veritcal)"

//   When prompted: provide first: a letter from [ A - L ], and second a number from [ 1 - 10 ].

//   Type "end" while its your turn to end the current game session and return to the title screen.
//   `);
//   prompt({
//     type: "input",
//     name: "instructions",
//     message: "Press enter to return to the title.",
//     default: "Okay, all good!",
//   }).then(() => {
//     initiateApp();
//   });
// }

// function exitGame(n = 3) {
//   let timer = n;
//   print("The game will end in: ");
//   setInterval(() => {
//     print(timer.toString());
//     timer--;
//   }, 1000);
//   setTimeout(() => process.kill(process.pid), (n + 1) * 1000);
// }

// async function userMenuSelect() {
//   const titleChoices: InquirerQuestionMenuSelect = {
//     type: "list",
//     name: "titleSelection",
//     message: "please select an option",
//     choices: [
//       "Start Game",
//       "Load Game*",
//       "Highscores*",
//       "Instructions",
//       "Quit Application",
//     ],
//   };
//   return (await prompt(titleChoices).then((response) => {
//     return response;
//   })) as InquirerTitleSelectAnswers;
// }

// initiateApp();
console.log(initiateApp);
