// src/index.js
import promptSync from "prompt-sync";
import chalk from "chalk";
import { parseCommand } from "./command-parser.js";
import { addTrainee, viewTrainees, deleteTrainee } from "./traineeCommands.js";
const prompt = promptSync({ sigint: true });
console.log("School Manager CLI");
console.log("Type QUIT or q to exit.");

(async function main() {
  while (true) {
    const input = prompt("> ").trim();

    if (!input) {
      console.log(chalk.yellow("ERROR: Invalid command format"));
      continue;
    }

    if (input === "QUIT" || input === "q") {
      console.log("Bye!");
      break;
    }

    try {
      const parsed = parseCommand(input);
     

      // parseCommand 
      if (!parsed) {
        console.log(chalk.yellow("ERROR: Invalid command format"));
        continue;
      }

      // TRAINEE ADD
      if (parsed.command === "TRAINEE" && parsed.subCommand === "ADD") {
        const result = await addTrainee(parsed.params);
        console.log(chalk.green(result));
        continue;
      }

      // TRAINEE VIEW
      if (parsed.command === "TRAINEE" && parsed.subCommand === "VIEW") {
        const result = await viewTrainees(parsed.params);
        console.log(chalk.green(result));
        continue;
      }
      // TRAINEE DELETE
if (parsed.command === "TRAINEE" && parsed.subCommand === "DELETE") {
  const result = await deleteTrainee(parsed.params);
  console.log(chalk.green(result));
  continue;
}

      console.log(chalk.yellow("ERROR: Invalid command"));
    } catch (err) {
      console.log(chalk.red(err.message));
    }
  }
})();