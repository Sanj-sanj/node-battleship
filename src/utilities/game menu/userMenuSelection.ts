import inquirer from "inquirer";
import {
  InquirerQuestionMenuSelect,
  InquirerTitleSelectAnswers,
} from "../../types/InquirerTypes";

const prompt = inquirer.createPromptModule();

export default async function userMenuSelect() {
  const titleChoices: InquirerQuestionMenuSelect[] = [
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
    },
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
    },
  ];
  return (await prompt(titleChoices).then((response) => {
    return response;
  })) as InquirerTitleSelectAnswers;
}
