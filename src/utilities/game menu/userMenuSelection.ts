import inquirer from "inquirer";
import {
  InquirerQuestionMenuSelect,
  InquirerTitleSelectAnswers,
} from "../../types/InquirerTypes";

const prompt = inquirer.createPromptModule();

export default async function userMenuSelect() {
  const titleChoices: InquirerQuestionMenuSelect = {
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
  };
  return (await prompt(titleChoices).then((response) => {
    return response;
  })) as InquirerTitleSelectAnswers;
}
