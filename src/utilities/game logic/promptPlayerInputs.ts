import inquirer from "inquirer";
import { XYCoords } from "../../types/GameTypes";
import { InquirerPlayerInputs } from "../../types/InquirerTypes";
import print from "../print.js";

const prompt = inquirer.createPromptModule();

export default function promptPlayersInputs(
  salvo: boolean,
  salvoRounds = 1
): Promise<XYCoords[] | "end"> {
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

  const output = [] as XYCoords[];
  let shotsFiredCounter = salvoRounds;
  function gatherInputs(): Promise<"end" | XYCoords[]> {
    return prompt(testQuestions).then((answers) => {
      if (answers.row === "end" || answers?.column === "end") {
        return "end";
      }
      const x = answers.row.toLowerCase().charCodeAt(0) - 97;
      const y = answers.column - 1;
      if (
        output.length > 0 &&
        output.some((acc) => acc.x === x && acc.y === y)
      ) {
        print("You've already selected that spot!");
        return gatherInputs();
      }
      output.push({ x, y });
      if (salvo && shotsFiredCounter > 1) {
        shotsFiredCounter--;
        return gatherInputs();
      } else {
        return output;
      }
    });
  }
  return gatherInputs();
  // if(salvo) return output;
}
