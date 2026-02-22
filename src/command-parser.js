// src/command-parser.js
export function parseCommand(input) {
  if (typeof input !== "string") {
    throw new Error("ERROR: Invalid command");
  }

  const trimmed = input.trim();
  if (!trimmed) {
    return null;
    throw new Error("ERROR: Invalid command");
  }

  const parts = trimmed.split(" ").filter(Boolean);
  const command = parts[0];
  const subCommand = parts[1];
  const params = parts.slice(2);

  if (!command || !subCommand) {
    throw new Error("ERROR: Invalid command");
  }

  return { command, subCommand, params };
}