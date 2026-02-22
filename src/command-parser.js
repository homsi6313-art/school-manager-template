export function parseCommand(userInput) {
  if (!userInput || userInput.trim() === "") {
    return null;
  }

  const parts = userInput.trim().split(" ");

  const command = parts[0]?.toUpperCase();
  const subCommand = parts[1]?.toUpperCase();

  const params = parts.slice(2);

  return {
    command,
    subCommand,
    params,
  };
}