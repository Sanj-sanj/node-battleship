import print from "../print.js";
import inquirer from "inquirer";

const prompt = inquirer.createPromptModule();

export default function showInstructions(returnToMenu: () => Promise<void>) {
  console.clear();
  print(`
    _____ _   _  _____ _______ _____  _    _  _____ _______ _____ ____  _   _  _____ 
   |_   _| \\ | |/ ____|__   __|  __ \\| |  | |/ ____|__   __|_   _/ __ \\| \\ | |/ ____|
     | | |  \\| | (___    | |  | |__) | |  | | |       | |    | || |  | |  \\| | (___  
     | | | . \` |\\___ \\   | |  |  _  /| |  | | |       | |    | || |  | | . \` |\\___ \\ 
    _| |_| |\\  |____) |  | |  | | \\ \\| |__| | |____   | |   _| || |__| | |\\  |____) |
   |_____|_| \\_|_____/   |_|  |_|  \\_\\\\____/ \\_____|  |_|  |_____\\____/|_| \\_|_____/ 
                                                                                     
    `);
  print(`
    Your board is automatically generated.
    Each battleships is laid out vertical or horizontal, they will never be diagonal.
  
    The board up top is used to track all the shots you have fire at your enemy.
    The bottom board contains your ships and the enemys shot's will be tracked here.
    Red coloured tiles indicate a hit, a yellow indicates a miss.
  
    The number of the tile represents the size of the battleship.
    (ex: A red 4 tile represents a hit on a battleship that's four tiles of size, either horizontal or veritcal)"
  
    When prompted: provide first: a letter from [ A - L ], and second a number from [ 1 - 10 ].
    
    Type "end" while its your turn to end the current game session and return to the title screen. 
    `);
  prompt({
    type: "input",
    name: "instructions",
    message: "Press enter to return to the title.",
    default: "Okay, all good!",
  }).then(() => {
    returnToMenu();
  });
}
