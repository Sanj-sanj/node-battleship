import { Answers, Question } from "inquirer";

/*
 ==========================================
            GAME MENU TYPES
 ==========================================
*/

export interface InquirerTitleSelectAnswers extends Answers {
  titleSelection: GameMenuChoices;
}

export type GameMenuChoices =
  | "Start Game"
  | "Load Game*"
  | "Highscores*"
  | "Instructions"
  | "Quit Application";

export type InquirerQuestionMenuSelect = {
  type: "list";
  name: "titleSelection";
  message: "please select an option";
  choices: GameMenuChoices[];
};

/*
 ==========================================
            GAME LOGIC TYPES
 ==========================================
*/

export interface InquirerPlayerInputs extends Question {
  type: "input";
  name: "row" | "column";
  message: string;
  validate: (value: string | number) => boolean | string;
}
