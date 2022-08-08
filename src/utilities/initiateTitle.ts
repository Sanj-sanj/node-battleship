import startGame from "./game logic/startGame.js";
import exitGame from "./game menu/exitGame.js";
import showInstructions from "./game menu/showInstructions.js";
import userMenuSelect from "./game menu/userMenuSelection.js";
import print from "./print.js";

export default async function initiateTitle() {
  console.clear();
  print(`
    ____       _______ _______ _      ______  _____ _    _ _____ _____  
   |  _ \\   /\\|__   __|__   __| |    |  ____|/ ____| |  | |_   _|  __ \\ 
   | |_) | /  \\  | |     | |  | |    | |__  | (___ | |__| | | | | |__) |
   |  _ < / /\\ \\ | |     | |  | |    |  __|  \\___ \\|  __  | | | |  ___/ 
   | |_) / ____ \\| |     | |  | |____| |____ ____) | |  | |_| |_| |     
   |____/_/    \\_\\_|     |_|  |______|______|_____/|_|  |_|_____|_|     
                                             
  `);

  const result = await userMenuSelect();
  const { titleSelection } = result;
  switch (titleSelection) {
    case "Start Game":
      new Promise((res) =>
        setTimeout(() => res(startGame(result.enableSalvo)), 2222)
      ).then(() => setTimeout(() => initiateTitle(), 2000));
      break;

    case "Instructions":
      showInstructions(initiateTitle);
      break;

    case "Quit Application":
      exitGame();
      break;

    default:
      break;
  }
}
