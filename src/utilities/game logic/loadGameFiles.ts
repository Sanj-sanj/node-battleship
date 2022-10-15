import { readFileSync } from "fs";
import { RawSaveFiles } from "../../types/GameTypes";
import print from "../print.js";

export default function loadGameFiles() {
  let saveFiles: RawSaveFiles;
  try {
    saveFiles = JSON.parse(
      readFileSync("./saves/saveFile.json", "utf-8")
    ) as RawSaveFiles;
    return saveFiles;
  } catch {
    print("No save files were found! \nTry starting a new game instead.");
  }
}
