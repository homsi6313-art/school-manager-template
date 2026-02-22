// src/index.js
import promptSync from "prompt-sync";
import chalk from "chalk";

import { parseCommand } from "./command-parser.js";
import { handleTraineeCommand } from "./traineeCommands.js";
import { handleCourseCommand } from "./courseCommands.js";

const prompt = promptSync({ sigint: true });

console.log("School Management CLI started.");

while (true) {
  const input = prompt("> ").trim();

  if (input === "q" || input.toUpperCase() === "QUIT") {
    console.log("Goodbye!");
    process.exit(0);
  }

  try {
    const parsed = parseCommand(input);

    const command = parsed.command.toUpperCase();
    const subCommand = parsed.subCommand.toUpperCase();

    let result;

    if (command === "TRAINEE") {
      result = handleTraineeCommand(subCommand, parsed.params);
    } else if (command === "COURSE") {
      result = handleCourseCommand(subCommand, parsed.params);
    } else {
      throw new Error("ERROR: Invalid command");
    }

    // print string or object
    if (result !== undefined && result !== null) {
      if (typeof result === "string") {
        if (result.trim().length > 0) console.log(result);
      } else {
        console.log(JSON.stringify(result, null, 2));
      }
    }
  } catch (err) {
    console.log(chalk.red(err.message));
  }
}