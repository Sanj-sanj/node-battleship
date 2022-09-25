import { readFileSync } from "fs";
import { GameSaveFile, SaveFile } from "../../types/GameTypes";

export default async function loadGameState(id: number) {
  const saveFiles: SaveFile = JSON.parse(
    readFileSync("./saves/saveFile.json", "utf-8")
  ) as SaveFile;
  return saveFiles.find((file) => file.ID === id) as GameSaveFile;
}
