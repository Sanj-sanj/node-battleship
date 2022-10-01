import prompWhichLoadToResume from "./game logic/promptWhichLoadToResume.js";
import startGame from "./game logic/startGame.js";
import exitGame from "./game menu/exitGame.js";
import showInstructions from "./game menu/showInstructions.js";
import userMenuSelect from "./game menu/userMenuSelection.js";
import print from "./print.js";

export default async function initiateTitle() {
  console.clear(); // eslint-disable-line
  print(`
    ____       _______ _______ _      ______  _____ _    _ _____ _____  
   |  _ \\   /\\|__   __|__   __| |    |  ____|/ ____| |  | |_   _|  __ \\ 
   | |_) | /  \\  | |     | |  | |    | |__  | (___ | |__| | | | | |__) |
   |  _ < / /\\ \\ | |     | |  | |    |  __|  \\___ \\|  __  | | | |  ___/ 
   | |_) / ____ \\| |     | |  | |____| |____ ____) | |  | |_| |_| |     
   |____/_/    \\_\\_|     |_|  |______|______|_____/|_|  |_|_____|_|     
                                             
  `);
  const result = await userMenuSelect();

  const { titleSelection, playerName, enableSalvo } = result;

  switch (titleSelection) {
    case "New Game":
      new Promise((res) =>
        setTimeout(
          () => res(startGame(enableSalvo as boolean, playerName as string)),
          1250
        )
        // game finished, restart title.
      ).then(() => setTimeout(() => initiateTitle(), 2000));
      break;

    case "Instructions":
      showInstructions(initiateTitle);
      break;

    case "Load Game": {
      const loadFile = await prompWhichLoadToResume();
      if (loadFile) {
        new Promise((res) =>
          setTimeout(
            () =>
              res(
                startGame(
                  loadFile.salvoEnabled,
                  loadFile.playerName,
                  loadFile.ID,
                  true
                )
              ),
            1250
          )
        ).then(() => {
        // game finished, restart title.
          setTimeout(() => initiateTitle(), 2000);
        });
      } else {
        // No save files found, restart title.
        setTimeout(() => initiateTitle(), 2000)
      }
      break;
    }

    case "Quit Application":
      exitGame();
      break;

    default:
      break;
  }
}
