// src/traineeCommands.js
import { loadTrainees, saveTrainees, loadCourses } from "./storage.js";

function parseId(value) {
  const n = Number(value);
  return Number.isInteger(n) ? n : NaN;
}

function isValidId(id) {
  return Number.isInteger(id) && id >= 0 && id <= 99999;
}

function generateUniqueId(existingIdsSet) {
  for (let i = 0; i < 2000; i += 1) {
    const id = Math.floor(Math.random() * 100000);
    if (!existingIdsSet.has(id)) return id;
  }
  for (let id = 0; id <= 99999; id += 1) {
    if (!existingIdsSet.has(id)) return id;
  }
  throw new Error("ERROR: Could not generate a unique ID");
}

function traineeCoursesNames(traineeId) {
  const courses = loadCourses();
  return courses
    .filter((c) => Array.isArray(c.participants) && c.participants.includes(traineeId))
    .map((c) => c.name)
    .sort((a, b) => a.localeCompare(b));
}

function addTrainee(params) {
  if (!params || params.length < 2) {
    throw new Error("ERROR: Must provide first and last name");
  }

  const [firstName, lastName] = params;

  const trainees = loadTrainees();
  const existingIds = new Set(trainees.map((t) => t.id));

  const id = generateUniqueId(existingIds);
  trainees.push({ id, firstName, lastName });

  saveTrainees(trainees);

  return `CREATED: ${id} ${firstName} ${lastName}`;
}

function getTrainee(params) {
  if (!params || params.length < 1) {
    throw new Error("ERROR: Must provide ID");
  }

  const [idStr] = params;
  const id = parseId(idStr);

  if (!isValidId(id)) {
    throw new Error("ERROR: Invalid ID");
  }

  const trainees = loadTrainees();
  const t = trainees.find((x) => x.id === id);

  if (!t) {
    throw new Error(`ERROR: Trainee with ID ${idStr} does not exist`);
  }

  // ✅ return object so index.js prints it with JSON.stringify
  return {
    ...t,
    courses: traineeCoursesNames(t.id),
  };
}

// ✅ هذا هو الـ handler اللي لازم index.js يناديه
export function handleTraineeCommand(subCommand, params) {
  switch (subCommand) {
    case "ADD":
      return addTrainee(params);
    case "GET":
      return getTrainee(params);
    default:
      throw new Error("ERROR: Invalid TRAINEE subcommand");
  }
}