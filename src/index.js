import readline from "node:readline";
import { parseCommand } from "./command-parser.js";
import { handleTraineeCommand } from "./traineeCommands.js";
import { handleCourseCommand } from "./courseCommands.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

function printOutput(output) {
  if (output === undefined || output === null) return;

  // If a handler returns an array/object, print it nicely
  if (typeof output === "object") {
    console.log(JSON.stringify(output, null, 2));
    return;
  }

  const text = String(output);
  if (text.trim().length > 0) console.log(text);
}

console.log("School Management CLI started.");
rl.setPrompt("> ");
rl.prompt();

rl.on("line", (line) => {
  try {
    const parsed = parseCommand(line);

    // Empty input -> just reprompt
    if (!parsed) {
      rl.prompt();
      return;
    }

    const { command, subCommand, params } = parsed;

    // Allow QUIT as a top-level command
    if (command === "QUIT") {
      rl.close();
      return;
    }

    let result;

    if (command === "TRAINEE") {
      result = handleTraineeCommand(subCommand, params);
    } else if (command === "COURSE") {
      result = handleCourseCommand(subCommand, params);
    } else {
      result = "ERROR: unknown command";
    }

    printOutput(result);
  } catch (err) {
    printOutput(`ERROR: ${err?.message ?? String(err)}`);
  }

  rl.prompt();
});

rl.on("close", () => {
  console.log("Goodbye!");
  process.exit(0);
});