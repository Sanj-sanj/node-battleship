import inquirer from "inquirer";
import {
  InquirerTitleMenuSelect,
  InquirerSalvoSelect,
  InquirerTitleSelectAnswers,
  InquirerNameSelect,
} from "../../types/InquirerTypes";

const prompt = inquirer.createPromptModule();

export default async function userMenuSelect() {
  const titleChoices = [
    {
      type: "list",
      name: "titleSelection",
      message: "please select an option",
      choices: [
        "Start Game",
        "Load Game*",
        "Highscores*",
        "Instructions",
        "Quit Application",
      ],
    } as InquirerTitleMenuSelect,
    {
      type: "list",
      name: "enableSalvo",
      message: "Would you like to enable salvo?",
      choices: ["Yes", "No"],
      default: "No",
      filter(input) {
        return input === "No" ? false : true;
      },
      when(answer) {
        return answer.titleSelection === "Start Game";
      },
    } as InquirerSalvoSelect,
    {
      type: "input",
      name: "playerName",
      message: "Please enter a name equal to or under 8 characters:",
      when(answer) {
        return answer.titleSelection === "Start Game";
      },
      validate(value: string) {
        if (
          typeof value === "string" &&
          value.length >= 1 &&
          value.length <= 8
        ) {
          return true;
        }
        return "Please enter a valid name. [1-8 characters]";
      },
    } as InquirerNameSelect,
  ];
  return (await prompt(titleChoices).then((response) => {
    return response;
  })) as InquirerTitleSelectAnswers;
}
