import inquirer from "inquirer";
import { InquirerLoadSaveFileSelect } from "../../types/InquirerTypes";
import loadGameFiles from "./loadGameFiles.js";
const prompt = inquirer.createPromptModule();

export default async function prompWhichLoadToResume(): Promise<{
  salvoEnabled: boolean;
  playerName: string;
  ID: number;
} | null> {
  const saveFiles = loadGameFiles();
  if (saveFiles) {
    const saveFileChoices = {
      type: "list",
      name: "saveFileSelect",
      message: "Please select a save file",
      choices: saveFiles.map((file) => file.playerName),
    } as InquirerLoadSaveFileSelect;

    return await prompt(saveFileChoices).then(({ saveFileSelect }) => {
      const file = saveFiles.find((file) => file.playerName === saveFileSelect);
      if (file) {
        const { salvoEnabled, playerName, ID } = file;
        return { salvoEnabled, playerName, ID };
      } else return null;
    });
  } 
  return null
}
