import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const traineesFile = path.join(__dirname, "../data/trainees.json");

export async function loadTrainees() {
  try {
    const data = await fs.readFile(traineesFile, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

export async function saveTrainees(trainees) {
  await fs.writeFile(traineesFile, JSON.stringify(trainees, null, 2));
}