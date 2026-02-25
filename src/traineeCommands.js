import { loadTrainees, saveTrainees, loadCourses, saveCourses } from "./storage.js";
import { parseId, isValidId, generateUniqueId } from "./utils.js";

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

  const courses = loadCourses();
  const joinedCourseNames = courses
    .filter((c) => (c.participants || []).includes(id))
    .map((c) => c.name);

  const coursesLine = joinedCourseNames.length ? joinedCourseNames.join(", ") : "None";

  return `${t.id} ${t.firstName} ${t.lastName}\nCourses: ${coursesLine}`;
}

function traineeGetAll() {
  const trainees = loadTrainees().slice().sort((a, b) => a.id - b.id);

  let result = "Trainees:\n";
  for (const t of trainees) {
    result += `${t.id} ${t.firstName} ${t.lastName}\n`;
  }
  result += `Total: ${trainees.length}\n`;

  return result;
}

function deleteTrainee(params) {
  if (!params || params.length < 1) {
    throw new Error("ERROR: Must provide ID");
  }

  const [idStr] = params;
  const id = parseId(idStr);

  if (!isValidId(id)) {
    throw new Error("ERROR: Invalid ID");
  }

  const trainees = loadTrainees();
  const idx = trainees.findIndex((t) => t.id === id);

  if (idx === -1) {
    throw new Error(`ERROR: Trainee with ID ${idStr} does not exist`);
  }

  trainees.splice(idx, 1);
  saveTrainees(trainees);

  const courses = loadCourses();
  let changed = false;

  for (const course of courses) {
    const participants = Array.isArray(course.participants) ? course.participants : [];
    const filtered = participants.filter((pid) => pid !== id);

    if (filtered.length !== participants.length) {
      course.participants = filtered;
      changed = true;
    }
  }

  if (changed) {
    saveCourses(courses);
  }

  return `DELETED: ${idStr}`;
}

function updateTrainee(params) {
  if (!params || params.length < 3) {
    throw new Error("ERROR: Must provide ID, first name and last name");
  }

  const [idStr, firstName, lastName] = params;
  const id = parseId(idStr);

  if (!isValidId(id)) {
    throw new Error("ERROR: Invalid ID");
  }

  const trainees = loadTrainees();
  const t = trainees.find((x) => x.id === id);

  if (!t) {
    throw new Error(`ERROR: Trainee with ID ${idStr} does not exist`);
  }

  t.firstName = firstName;
  t.lastName = lastName;

  saveTrainees(trainees);

  return `UPDATED: ${id} ${firstName} ${lastName}`;
}

export function handleTraineeCommand(subCommand, params) {
  switch (String(subCommand).toUpperCase()) {
    case "ADD":
      return addTrainee(params);
    case "GET":
      return getTrainee(params);
    case "GETALL":
      return traineeGetAll();
    case "UPDATE":
      return updateTrainee(params);
    case "DELETE":
      return deleteTrainee(params);
    default:
      throw new Error("ERROR: Invalid TRAINEE subcommand");
  }
}