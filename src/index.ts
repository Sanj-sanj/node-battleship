import setupGame from "./utilities/game logic/setupGame";
import exitGame from "./utilities/game menu/exitGame";
import showInstructions from "./utilities/game menu/showInstructions";
import userMenuSelect from "./utilities/game menu/userMenuSelection";
import print from "./utilities/printToScreen";

export default async function initiateApp() {
  console.clear();
  print(`
    ____       _______ _______ _      ______  _____ _    _ _____ _____  
   |  _ \\   /\\|__   __|__   __| |    |  ____|/ ____| |  | |_   _|  __ \\ 
   | |_) | /  \\  | |     | |  | |    | |__  | (___ | |__| | | | | |__) |
   |  _ < / /\\ \\ | |     | |  | |    |  __|  \\___ \\|  __  | | | |  ___/ 
   | |_) / ____ \\| |     | |  | |____| |____ ____) | |  | |_| |_| |     
   |____/_/    \\_\\_|     |_|  |______|______|_____/|_|  |_|_____|_|     
                                             
  `);

  const { titleSelection } = await userMenuSelect();

  switch (titleSelection) {
    case "Start Game":
      new Promise((res) => res(setupGame())).then(() =>
        setTimeout(() => initiateApp(), 2000)
      );
      break;

    case "Quit Application":
      exitGame();
      break;

    case "Instructions":
      showInstructions(initiateApp);
      break;

    default:
      break;
  }
}
