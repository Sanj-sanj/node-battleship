import inquirer from "inquirer";
const output = [];

const questions = [
  {
    type: "input",
    name: "tvShow",
    message: "What's your favorite TV show?",
  },
  {
    type: "confirm",
    name: "askAgain",
    message: "Want to enter another TV show favorite (just hit enter for YES)?",
    default: true,
  },
];

function ask() {
  inquirer.prompt(questions).then((answers) => {
    output.push(answers.tvShow);
    if (answers.askAgain) {
      ask();
    } else {
      console.log("Your favorite TV Shows:", answers);
    }
  });
}

ask();
