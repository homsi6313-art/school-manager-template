import { describe, test, expect } from "vitest";
import { parseCommand } from "../src/command-parser.js";

describe("parseCommand", () => {
  test("parses TRAINEE ADD John Doe correctly", () => {
    const result = parseCommand("TRAINEE ADD John Doe");

    expect(result).toEqual({
      command: "TRAINEE",
      subCommand: "ADD",
      params: ["John", "Doe"],
    });
  });

  test("returns null for empty input", () => {
    const result = parseCommand("");
    expect(result).toBe(null);
  });

  test("handles command without parameters", () => {
    const result = parseCommand("TRAINEE GETALL");

    expect(result).toEqual({
      command: "TRAINEE",
      subCommand: "GETALL",
      params: [],
    });
  });
});