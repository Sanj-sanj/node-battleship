import { readFileSync } from "fs";
import { SaveFile } from "../../types/GameTypes";

export default function loadGameFiles() {
  let saveFiles: SaveFile;
  try {
    saveFiles = JSON.parse(
      readFileSync("./saves/saveFile.json", "utf-8")
    ) as SaveFile;
    return saveFiles;
  } catch {
    console.log("whoops something went wrong, lets just ignore that!");
  }
}
