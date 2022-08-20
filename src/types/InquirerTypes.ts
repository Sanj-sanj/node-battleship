import { Answers, Question } from "inquirer";

/*
 ==========================================
            GAME MENU TYPES
 ==========================================
*/

export interface InquirerTitleSelectAnswers extends Answers {
  titleSelection: GameMenuChoices;
  enableSalvo?: boolean;
}

export type GameMenuChoices =
  | "Start Game"
  | "Load Game*"
  | "Highscores*"
  | "Instructions"
  | "Quit Application";

export interface InquirerSalvoSelect extends Question {
  type: "list" | "confirm";
  name: "titleSelection" | "enableSalvo";
  message: string;
  choices: GameMenuChoices[] | ["Yes", "No"];
}
export interface InquirerTitleMenuSelect extends Question {
  type: "list" | "confirm";
  name: "titleSelection" | "enableSalvo";
  message: string;
  choices: GameMenuChoices[] | ["Yes", "No"];
}
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
