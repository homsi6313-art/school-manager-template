export function parseCommand(input) {
  if (!input) return null;

  const parts = input.trim().split(/\s+/);

  if (parts.length < 2) {
    throw new Error("ERROR: Invalid command format");
  }

  return {
    command: parts[0].toUpperCase(),
    subCommand: parts[1].toUpperCase(),
    params: parts.slice(2)
  };
}