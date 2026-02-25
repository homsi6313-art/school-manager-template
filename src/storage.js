import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");

const TRAINEES_PATH = path.join(DATA_DIR, "trainees.json");
const COURSES_PATH = path.join(DATA_DIR, "courses.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function safeReadJsonArray(filePath) {
  ensureDataDir();

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]", "utf-8");
    return [];
  }

  const raw = fs.readFileSync(filePath, "utf-8").trim();
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeJsonArray(filePath, data) {
  ensureDataDir();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export function loadTrainees() {
  return safeReadJsonArray(TRAINEES_PATH);
}

export function saveTrainees(data) {
  writeJsonArray(TRAINEES_PATH, data);
}

export function loadCourses() {
  return safeReadJsonArray(COURSES_PATH);
}

export function saveCourses(data) {
  writeJsonArray(COURSES_PATH, data);
}