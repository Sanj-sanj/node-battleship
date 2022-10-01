import { readFileSync } from "fs";
import { SaveFile } from "../../types/GameTypes";
import print from "../print.js";

export default function loadGameFiles() {
  let saveFiles: SaveFile;
  try {
    saveFiles = JSON.parse(
      readFileSync("./saves/saveFile.json", "utf-8")
    ) as SaveFile;
    return saveFiles;
  } catch {
    print("No save files were found! \nTry starting a new game instead.");
  }
}
