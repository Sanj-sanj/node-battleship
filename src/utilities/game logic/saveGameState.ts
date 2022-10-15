import { readFileSync, writeFileSync } from "fs";
import { GameSaveFile, RawSaveFiles } from "../../types/GameTypes";

export default function saveGameState(gameFile: GameSaveFile, id: number) {
  let saveFiles: RawSaveFiles;
  try {
    saveFiles = JSON.parse(
      readFileSync("./saves/saveFile.json", "utf-8")
    ) as RawSaveFiles;
    const fileIndex = saveFiles.findIndex((file) => file.ID === id);
    if (fileIndex === -1) saveFiles.push(gameFile);
    else saveFiles[fileIndex] = gameFile;
    writeFileSync("./saves/saveFile.json", JSON.stringify(saveFiles));
  } catch (err) {
    writeFileSync("./saves/error.json", JSON.stringify(err));
    writeFileSync("./saves/saveFile.json", JSON.stringify([gameFile]));
  }
}
