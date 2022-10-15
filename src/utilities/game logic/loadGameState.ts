import { readFileSync } from "fs";
import { GameSaveFile, RawSaveFiles } from "../../types/GameTypes";

export default async function loadGameState(id: number) {
  const saveFiles: RawSaveFiles = JSON.parse(
    readFileSync("./saves/saveFile.json", "utf-8")
  ) as RawSaveFiles;
  return saveFiles.find((file) => file.ID === id) as GameSaveFile;
}
