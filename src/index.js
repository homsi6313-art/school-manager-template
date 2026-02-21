import promptSync from "prompt-sync";
import chalk from "chalk";
import { parseCommand } from "./command-parser.js";
import { addTrainee } from "./TraineeCommands.js";

const prompt = promptSync({ sigint: true });

console.log("School Manager CLI");
console.log("Type QUIT or q to exit.");

(async function () {
  while (true) {
    const input = prompt("> ");

    if (input === "QUIT" || input === "q") {
      console.log("Bye!");
      break;
    }

    try {
      const parsed = parseCommand(input);
      if (!parsed) continue;

      if (parsed.command === "TRAINEE" && parsed.subCommand === "ADD") {
        const result = await addTrainee(parsed.params);
        console.log(chalk.green(result));
        continue;
      }

      console.log(chalk.yellow("ERROR: Invalid command"));
    } catch (err) {
      console.log(chalk.red(err.message));
    }
  }
})();