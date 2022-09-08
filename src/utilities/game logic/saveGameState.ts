import { readFile, writeFileSync } from "fs";
import { GameFile } from "../../types/GameTypes";

export default function saveGameState(gameFile: GameFile, id: number) {
  const currSave = JSON.stringify([{ [id]: gameFile }]);
  const saves = readFile("./saves/saveFile.json", (err, data) => {
    console.log(data);
  });
  writeFileSync("./saves/saveFile.json", currSave);
}
