import inquirer from "inquirer";
import { XYCoords } from "../../types/GameTypes";
import { InquirerPlayerInputs } from "../../types/InquirerTypes";
import print from "../print.js";

const prompt = inquirer.createPromptModule();

export default function promptPlayersInputs(): Promise<XYCoords | "end"> {
  print('\nType "end" to end the game');

  const testQuestions: InquirerPlayerInputs[] = [
    {
      type: "input",
      name: "row",
      message: "Select a letter: ",
      validate(value) {
        if (typeof value === "string" && value.toLocaleLowerCase() === "end") {
          return true;
        } else if (
          typeof value === "string" &&
          value.length === 1 &&
          value.toLowerCase().match(/[a-j]/g)
        ) {
          return true;
        }
        return "Please enter a valid letter [A - J].";
      },
    },
    {
      type: "input",
      name: "column",
      message: "Select a number: ",
      validate(value) {
        if (typeof value === "string" && value.toLowerCase() === "end") {
          return true;
        } else if (
          typeof value === "string" &&
          !Number.isNaN(parseInt(value)) &&
          parseInt(value) >= 1 &&
          parseInt(value) <= 10
        ) {
          return true;
        }
        return "Please enter a valid number [1 - 10].";
      },
      when(answer) {
        return answer.row !== "end";
      },
    },
  ];

  return prompt(testQuestions).then((answers) => {
    if (answers.row === "end" || answers?.column === "end") {
      return "end";
    }
    return {
      x: answers.row.toLowerCase().charCodeAt(0) - 97,
      y: answers.column - 1,
    } as XYCoords;
  });
}
