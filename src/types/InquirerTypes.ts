import { Answers, Question } from "inquirer";

/*
 ==========================================
            GAME MENU TYPES
 ==========================================
*/

export interface InquirerTitleSelectAnswers extends Answers {
  titleSelection: GameMenuChoices;
  enableSalvo?: boolean;
  playerName?: string;
}

export type GameMenuChoices =
  | "Start Game"
  | "Load Game"
  | "Highscores*"
  | "Instructions"
  | "Quit Application";

export interface InquirerSalvoSelect extends Question {
  type: "list" | "confirm";
  name: "titleSelection" | "enableSalvo";
  message: string;
  choices: GameMenuChoices[] | ["Yes", "No"];
}
export interface InquirerNameSelect extends Question {
  type: "input";
  name: "playerName";
  message: string;
  validate: (value: string) => string | true;
}
export interface InquirerTitleMenuSelect extends Question {
  type: "list" | "confirm";
  name: "titleSelection" | "enableSalvo";
  message: string;
  choices: GameMenuChoices[] | ["Yes", "No"];
}
export interface InquirerLoadSaveFileSelect extends Question {
  type: "list";
  name: "saveFileSelect";
  message: string;
  choices: string[];
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
