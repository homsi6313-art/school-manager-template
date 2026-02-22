// src/storage.js
import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.resolve(process.cwd(), "data");
const TRAINEES_FILE = path.join(DATA_DIR, "trainees.json");
const COURSES_FILE = path.join(DATA_DIR, "Courses.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJsonArray(filePath) {
  ensureDataDir();

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]", "utf-8");
    return [];
  }

  const raw = fs.readFileSync(filePath, "utf-8").trim();
  if (!raw) return [];

  try {
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    // إذا الملف خربان لأي سبب: ما نفجّر البرنامج، بس نرجّع مصفوفة فاضية
    return [];
  }
}

function writeJsonArray(filePath, arr) {
  ensureDataDir();
  if (!Array.isArray(arr)) throw new Error("ERROR: Internal storage error");

  // كتابة آمنة: نكتب على temp ثم rename
  const tmpPath = `${filePath}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(arr, null, 2), "utf-8");
  fs.renameSync(tmpPath, filePath);
}

export function loadTrainees() {
  return readJsonArray(TRAINEES_FILE);
}

export function saveTrainees(trainees) {
  writeJsonArray(TRAINEES_FILE, trainees);
}

export function loadCourses() {
  return readJsonArray(COURSES_FILE);
}

export function saveCourses(courses) {
  writeJsonArray(COURSES_FILE, courses);
}
// Backward-compatible exports (old names)
export const loadCourseData = loadCourses;
export const saveCourseData = saveCourses;
export const loadTraineeData = loadTrainees;
export const saveTraineeData = saveTrainees;