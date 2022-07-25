"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var readline = require("readline");
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
/*
 ========================
        TYPES
 ========================
*/
function print(message) {
    return console.log(message);
}
function createEmptyBoard(size) {
    if (size === void 0) { size = 10; }
    return new Array(10).fill(new Array(10).fill(0));
}
function populateBoard(_a, name) {
    var updatePositions = _a.updatePositions;
    //make ships
    var board = createEmptyBoard();
    var sizes = [5, 4, 3, 3, 2];
    var a = board[1][0];
    sizes.forEach(function (size) {
        var _a;
        var getXY = function () {
            var y = Math.floor(Math.random() * board.length);
            var x = Math.floor(Math.random() * board[y].length);
            return [y, x];
        };
        var shipTile = size;
        var shipTOP = size;
        // const shipTile = "\x1b[35m" + size + "\x1b[0m";
        // const shipTOP = "\x1b[46m" + size + "\x1b[0m";
        var initialPlot = 1;
        var x, y;
        while (initialPlot !== 0) {
            _a = getXY(), y = _a[0], x = _a[1];
            initialPlot = board[y][x];
            // print("this is initial before its alterd", initialPlot);
            if (initialPlot === 0) {
                board[y] = __spreadArray([], board[y], true);
                board[y][x] = shipTOP;
                var directions = ascertainDirections({ x: x, y: y }, board, size);
                var validMoves = Object.entries(directions).filter(function (v) { return v; });
                if (!validMoves.length) {
                    // print("potential fuckup");
                    board[y][x] = initialPlot;
                    initialPlot = 1;
                    continue;
                }
                //randomDirection : CompassDirection
                var randomDirection = validMoves[Math.floor(Math.random() * validMoves.length)][0];
                var _b = fillWithShipTiles({ x: x, y: y }, board, size, randomDirection), newBoard = _b[0], path = _b[1];
                updatePositions(path, name);
                board = newBoard;
                break;
            }
        }
    });
    return board;
}
function fillWithShipTiles(_a, board, size, direction) {
    var x = _a.x, y = _a.y;
    var path = [{ y: y, x: x }];
    var tempBoard = __spreadArray([], board, true);
    var counter = size;
    var startPointer = direction === "north" || direction === "south" ? y : x;
    for (var i = direction === "east" || direction === "south"
        ? startPointer + 1
        : startPointer - 1; counter > 1 && i >= 0; direction === "north" || direction === "west" ? i-- : i++, counter--) {
        var horizontalPointer = direction === "north" || direction === "south" ? x : i;
        var verticalPointer = direction === "north" || direction === "south" ? i : y;
        var tempRow = __spreadArray([], tempBoard[verticalPointer], true);
        tempRow[horizontalPointer] = size;
        tempBoard[verticalPointer] = __spreadArray([], tempRow, true);
        path.push({ y: verticalPointer, x: horizontalPointer });
    }
    return [tempBoard, path];
}
function ascertainDirections(_a, board, size) {
    var x = _a.x, y = _a.y;
    var directions = {
        north: null,
        south: null,
        east: null,
        west: null,
    };
    var compassDirections = Object.keys(directions);
    compassDirections.forEach(function (direction) {
        var counter = size;
        var tempBoard = __spreadArray([], board, true);
        var pointer = direction === "north" || direction === "south" ? y : x;
        for (var i = direction === "north" || direction === "west"
            ? pointer - 1
            : pointer + 1; counter > 1; direction === "north" || direction === "west" ? i-- : i++, counter--) {
            var yIndex = direction === "north" || direction === "south" ? i : y;
            var xIndex = direction === "north" || direction === "south" ? x : i;
            try {
                if (tempBoard[yIndex][xIndex] !== 0) {
                    directions[direction] = false;
                    break;
                }
            }
            catch (error) {
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
var prettyPrintBoard = function (board) {
    print("\n     A B C D E F G H I J");
    var lineNum = 1;
    for (var _i = 0, board_1 = board; _i < board_1.length; _i++) {
        var line = board_1[_i];
        print("".concat(lineNum, " ").padEnd(3) +
            "|".concat(line.reduce(function (acc, curr) { return (acc += curr + " "); }, " "), "|"));
        lineNum++;
    }
};
function tallySunken(sunkenShips) {
    return sunkenShips.map(function (_a, i) {
        var counter = _a.counter, size = _a.size;
        return {
            shipNo: i,
            size: size,
            isSunk: size !== 0 && counter === size ? true : false,
        };
    });
}
function mapSunkShips(enemyPositions, coords) {
    var mappedHits = enemyPositions.map(function (ship) {
        var counter = 0;
        var size = 0;
        ship.forEach(function (pos) {
            return coords.find(function (_a) {
                var x = _a.x, y = _a.y;
                pos.x === x && pos.y === y ? counter++ : null;
                size = ship.length;
            });
        });
        return { counter: counter, size: size };
    });
    return mappedHits;
}
function fillTileWithHitMarker(y, x, newFill, board) {
    var row = __spreadArray([], board[y], true);
    row[x] = newFill;
    var temp = __spreadArray([], board, true);
    temp[y] = row;
    return temp;
}
function gameState() {
    var isPlayersTurn = true;
    var playerTurns = 0;
    var cpuTurns = 0;
    var shipsSunk = { player: [], enemy: [] };
    var shipsHit = { player: [], enemy: [] };
    var positions = { player: [], enemy: [] };
    function updateTurns(whosTurn) {
        whosTurn === "player" ? playerTurns++ : cpuTurns++;
    }
    function updateSunk(sunkShips, name) {
        shipsSunk[name] = __spreadArray([], sunkShips, true);
    }
    function updateShipsHit(coords, name) {
        shipsHit[name].push(coords);
    }
    function updatePositions(item, name) {
        positions[name].push(item);
    }
    function retrieve() {
        return { playerTurns: playerTurns, shipsHit: shipsHit, positions: positions, shipsSunk: shipsSunk, isPlayersTurn: isPlayersTurn };
    }
    function swapTurn() {
        isPlayersTurn = !isPlayersTurn;
    }
    return {
        updateTurns: updateTurns,
        updateShipsHit: updateShipsHit,
        updatePositions: updatePositions,
        updateSunk: updateSunk,
        swapTurn: swapTurn,
        retrieve: retrieve,
    };
}
function setupGame() {
    return __awaiter(this, void 0, void 0, function () {
        function gameLoop(plBoard, enBoard, guessBoard) {
            return __awaiter(this, void 0, void 0, function () {
                function printBoards(debug) {
                    if (debug === void 0) { debug = false; }
                    print("\nYour guess board");
                    prettyPrintBoard(guessingBoard);
                    if (debug) {
                        print("\nYour ENEMY'S is:");
                        prettyPrintBoard(enemyBoard);
                    }
                    else {
                        print("\nYour board is:");
                        prettyPrintBoard(playerBoard);
                    }
                }
                var playerBoard, enemyBoard, guessingBoard, playersTurn, evaluationBoard, evaluateAgainst, currentTurn, sunkenShips, sunkShips, y, x, _a, hit, val, fill, newPlayerBoard, newGuessingBoard;
                var _b;
                var _this = this;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            console.clear();
                            playerBoard = plBoard || populateBoard(state, "player");
                            enemyBoard = enBoard || populateBoard(state, "enemy");
                            guessingBoard = guessBoard || createEmptyBoard();
                            playersTurn = state.retrieve().isPlayersTurn;
                            evaluationBoard = playersTurn ? enemyBoard : playerBoard;
                            evaluateAgainst = playersTurn ? "enemy" : "player";
                            currentTurn = playersTurn ? "player" : "enemy";
                            sunkenShips = mapSunkShips(state.retrieve().positions[evaluateAgainst], state.retrieve().shipsHit[evaluateAgainst]);
                            console.log(state.retrieve().positions);
                            sunkShips = tallySunken(sunkenShips);
                            state.updateSunk(sunkShips, evaluateAgainst);
                            if (sunkShips.every(function (_a) {
                                var isSunk = _a.isSunk;
                                return isSunk === true;
                            })) {
                                playerHasWon = true;
                                gameHasEnded = true;
                                return [2 /*return*/, true];
                            }
                            console.log(playersTurn ? "Player's turn" : "AI turn");
                            // Board state shown while player plays their turn move.
                            // this function call will not print on enemy's turn
                            printBoards();
                            if (!playersTurn) return [3 /*break*/, 2];
                            return [4 /*yield*/, gatherInputs(evaluationBoard)];
                        case 1:
                            (_b = _c.sent(), y = _b.y, x = _b.x);
                            return [3 /*break*/, 3];
                        case 2:
                            y = Math.floor(Math.random() * evaluationBoard.length);
                            x = Math.floor(Math.random() * evaluationBoard[y].length);
                            _c.label = 3;
                        case 3:
                            if (typeof x === "string") {
                                //end game
                                gameHasEnded = true;
                                print("\nThanks for playing");
                                return [2 /*return*/, true];
                            }
                            _a = checkForHit(y, x, evaluationBoard), hit = _a.hit, val = _a.val;
                            fill = "";
                            console.clear();
                            // NEED A WAY TO BLOCK THE PROCESS DURING ENEMY TURN SO PLAYER CAN SEE THEIR MOVES INREALTIME RATHER THAN ALL AT ONCE
                            if (hit) {
                                print(playersTurn
                                    ? "You land a hit at Y: ".concat(y + 1, ", X: ").concat(x + 1)
                                    : "The enemy lands a hit at Y: ".concat(y + 1, ", X: ").concat(x + 1));
                                fill = "\x1b[41m" + val + "\x1b[0m";
                                if (!state.retrieve().shipsHit[evaluateAgainst].length ||
                                    !state
                                        .retrieve()
                                        .shipsHit[evaluateAgainst].find(function (coords) { return coords.x === x && coords.y === y; })) {
                                    state.updateShipsHit({ y: y, x: x }, evaluateAgainst);
                                }
                                else {
                                    print("You've already shot a cannonball there, try another space.");
                                }
                            }
                            else {
                                //turn player shot misses
                                print(playersTurn
                                    ? "Your shot misses at Y: ".concat(y + 1, ", X: ").concat(x + 1)
                                    : "The enemy's shot misses at Y: ".concat(y + 1, ", X: ").concat(x + 1));
                                state.swapTurn();
                                fill = "\x1b[43m" + val + "\x1b[0m";
                            }
                            state.updateTurns(currentTurn);
                            newPlayerBoard = !playersTurn
                                ? fillTileWithHitMarker(y, x, fill, playerBoard)
                                : playerBoard;
                            newGuessingBoard = playersTurn
                                ? fillTileWithHitMarker(y, x, fill, guessingBoard)
                                : guessingBoard;
                            //printBoards() here because without it, the function moves out to the outter body before the setTimeout executes.
                            // board printed right after either player or the AI finish their moves
                            // After the AI finishes their move, this function call is the one that persists on screen
                            printBoards();
                            //by enveloping gameLoop in a setTimeout to delay by `n` seconds, the promise guarantees it will not fire untill completion of the timeout AND we will not prematurely return a non promise based value, which will continue thread of execturion after first return
                            return [2 /*return*/, new Promise(function (res) {
                                    setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                        var _a;
                                        return __generator(this, function (_b) {
                                            switch (_b.label) {
                                                case 0:
                                                    _a = res;
                                                    return [4 /*yield*/, gameLoop(newPlayerBoard, enemyBoard, newGuessingBoard)];
                                                case 1:
                                                    _a.apply(void 0, [_b.sent()]);
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); }, 3000);
                                })];
                    }
                });
            });
        }
        var state, playerHasWon, gameHasEnded;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    state = gameState();
                    playerHasWon = false;
                    gameHasEnded = false;
                    return [4 /*yield*/, gameLoop()];
                case 1:
                    _a.sent();
                    if (gameHasEnded) {
                        if (playerHasWon) {
                            print("Good job\nAfter ".concat(state.retrieve().playerTurns, " mighty blows,\nYou've taken out ").concat(state
                                .retrieve()
                                .shipsHit.enemy.reduce(function (acc, curr) { return (curr.isSunk ? (acc += 1) : acc); }, 0), "\nThey've gone down yarr."));
                        }
                        else {
                            print("Nice try\nAfter ".concat(state.retrieve().playerTurns, " mighty blows,\nYou've taken out ").concat(state
                                .retrieve()
                                .shipsSunk.enemy.reduce(function (acc, curr) { return (curr.isSunk ? (acc += 1) : acc); }, 0), "\nThey remain."));
                        }
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function gatherInputs(board) {
    var x, y;
    print('\nType "end" to end the game');
    return new Promise(function (resolve, reject) {
        rl.question("Pick a letter: ", function (char) {
            if (char === "end")
                return resolve({ x: char, y: char });
            x = char.toLowerCase().charCodeAt() - 97;
            if (char.length === 1 && x >= 0 && x < board[0].length) {
                // print(x, char);
                rl.question("Pick a number: ", function (num) {
                    y = parseInt(num) - 1;
                    if (y >= 0 && y < board.length) {
                        resolve({ y: y, x: x });
                    }
                    else {
                        reject(print("Number not in range try again."));
                    }
                });
            }
            else {
                reject(print("Character not in range try another input."));
            }
        });
    })
        .then(function (coordinates) { return coordinates; })
        .catch(function () { return gatherInputs(board); });
}
function checkForHit(y, x, boardToCheck) {
    return boardToCheck[y][x] === 0
        ? { hit: false, val: boardToCheck[y][x] }
        : { hit: true, val: boardToCheck[y][x] };
}
print("\nHello And welcome to battleship, the boards are automatically generated currently.\nThe board up top tracks where all the shots you fire on your enemy land.\nRed colored tiles indicate a hit, the number represents the size of the battleship.\n\n(A red 4 tile represents a hit on a battleship that's four tiles of size, either horizontal or veritcal)");
setupGame();
