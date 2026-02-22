import fs from "node:fs";

const TRAINEE_DATA_FILE_PATH = new URL("../data/trainees.json", import.meta.url);
const COURSE_DATA_FILE_PATH = new URL("../data/courses.json", import.meta.url);

function readJsonArray(fileUrl) {
  try {
    if (!fs.existsSync(fileUrl)) return [];

    const raw = fs.readFileSync(fileUrl, "utf-8").trim();
    if (!raw) return [];

    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function writeJsonArray(fileUrl, arr, errorMessage) {
  if (!Array.isArray(arr)) {
    throw new Error(errorMessage);
  }

  fs.writeFileSync(fileUrl, JSON.stringify(arr, null, 2), "utf-8");
}

export function loadTraineeData() {
  return readJsonArray(TRAINEE_DATA_FILE_PATH);
}

export function saveTraineeData(trainees) {
  writeJsonArray(
    TRAINEE_DATA_FILE_PATH,
    trainees,
    "ERROR: trainee data must be an array"
  );
}

export function loadCourseData() {
  return readJsonArray(COURSE_DATA_FILE_PATH);
}

export function saveCourseData(courses) {
  writeJsonArray(
    COURSE_DATA_FILE_PATH,
    courses,
    "ERROR: course data must be an array"
  );
}