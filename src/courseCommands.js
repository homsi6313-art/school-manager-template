// src/courseCommands.js
import { loadCourses, saveCourses, loadTrainees, saveTrainees } from "./storage.js";

const MAX_COURSE_CAPACITY = 20;
const MAX_TRAINEE_COURSES = 5;

function parseId(value) {
  const n = Number(value);
  return Number.isInteger(n) ? n : NaN;
}

function isValidIsoDate(dateStr) {
  // yyyy-MM-dd
  if (typeof dateStr !== "string") return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;

  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === m - 1 &&
    dt.getUTCDate() === d
  );
}

function ensureParticipantsArray(course) {
  if (!course.participants || !Array.isArray(course.participants)) {
    return { ...course, participants: [] };
  }
  return course;
}

function generateUniqueId(existingIdsSet) {
  // random first
  for (let i = 0; i < 2000; i += 1) {
    const id = Math.floor(Math.random() * 100000);
    if (!existingIdsSet.has(id)) return id;
  }
  // fallback
  for (let id = 0; id <= 99999; id += 1) {
    if (!existingIdsSet.has(id)) return id;
  }
  throw new Error("ERROR: Could not generate a unique ID");
}

function getTraineeById(traineeId) {
  const trainees = loadTrainees();
  return trainees.find((t) => t.id === traineeId) || null;
}

function traineeCoursesCount(traineeId) {
  const courses = loadCourses().map(ensureParticipantsArray);
  return courses.filter((c) => c.participants.includes(traineeId)).length;
}

/* ---------------- Commands ---------------- */

function courseAdd(params) {
  if (!params || params.length < 2) {
    throw new Error("ERROR: Must provide course name and start date");
  }

  const [name, startDate] = params;

  if (!name || String(name).trim().length === 0) {
    throw new Error("ERROR: Course name can not be empty");
  }

  if (!isValidIsoDate(startDate)) {
    throw new Error("ERROR: Invalid start date. Must be in yyyy-MM-dd format");
  }

  const courses = loadCourses().map(ensureParticipantsArray);
  const existingIds = new Set(courses.map((c) => c.id));
  const id = generateUniqueId(existingIds);

  const newCourse = { id, name, startDate, participants: [] };
  courses.push(newCourse);
  saveCourses(courses);

  return `CREATED: ${id} ${name} ${startDate}`;
}

function courseGetAll() {
  const courses = loadCourses().map(ensureParticipantsArray);

  if (courses.length === 0) {
    return "Courses (FULL = capacity reached):\n(no courses)\nTotal: 0";
  }

  const lines = courses
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((c) => {
      const count = c.participants.length;
      const fullLabel = count >= MAX_COURSE_CAPACITY ? " FULL" : "";
      // FULL label required
      return `${c.id} ${c.name} ${c.startDate} ${count}/${MAX_COURSE_CAPACITY}${fullLabel}`;
    });

  return `Courses (FULL = capacity reached):\n${lines.join("\n")}\nTotal: ${
    courses.length
  }`;
}

function courseJoin(params) {
  if (!params || params.length < 2) {
    throw new Error("ERROR: Must provide course ID and trainee ID");
  }

  const [courseIdStr, traineeIdStr] = params;
  const courseId = parseId(courseIdStr);
  const traineeId = parseId(traineeIdStr);

  if (Number.isNaN(courseId) || Number.isNaN(traineeId)) {
    throw new Error("ERROR: IDs must be numbers");
  }

  const courses = loadCourses().map(ensureParticipantsArray);
  const idx = courses.findIndex((c) => c.id === courseId);
  if (idx === -1) throw new Error(`ERROR: Course with ID ${courseId} does not exist`);

  const trainee = getTraineeById(traineeId);
  if (!trainee) throw new Error(`ERROR: Trainee with ID ${traineeId} does not exist`);

  const course = courses[idx];

  if (course.participants.includes(traineeId)) {
    return `INFO: ${trainee.firstName} ${trainee.lastName} already joined ${course.name}`;
  }

  if (course.participants.length >= MAX_COURSE_CAPACITY) {
    throw new Error("ERROR: Course is FULL");
  }

  const count = traineeCoursesCount(traineeId);
  if (count >= MAX_TRAINEE_COURSES) {
    throw new Error(`ERROR: Trainee can not join more than ${MAX_TRAINEE_COURSES} courses`);
  }

  course.participants.push(traineeId);
  courses[idx] = course;
  saveCourses(courses);

  return `${trainee.firstName} ${trainee.lastName} joined ${course.name}`;
}

function courseLeave(params) {
  if (!params || params.length < 2) {
    throw new Error("ERROR: Must provide course ID and trainee ID");
  }

  const [courseIdStr, traineeIdStr] = params;
  const courseId = parseId(courseIdStr);
  const traineeId = parseId(traineeIdStr);

  if (Number.isNaN(courseId) || Number.isNaN(traineeId)) {
    throw new Error("ERROR: IDs must be numbers");
  }

  const courses = loadCourses().map(ensureParticipantsArray);
  const idx = courses.findIndex((c) => c.id === courseId);
  if (idx === -1) throw new Error(`ERROR: Course with ID ${courseId} does not exist`);

  const trainee = getTraineeById(traineeId);
  if (!trainee) throw new Error(`ERROR: Trainee with ID ${traineeId} does not exist`);

  const course = courses[idx];
  if (!course.participants.includes(traineeId)) {
    return `INFO: ${trainee.firstName} ${trainee.lastName} is not in ${course.name}`;
  }

  course.participants = course.participants.filter((id) => id !== traineeId);
  courses[idx] = course;
  saveCourses(courses);

  return `${trainee.firstName} ${trainee.lastName} left ${course.name}`;
}

/* ---------------- Router ---------------- */

export function handleCourseCommand(subCommand, params) {
  switch (String(subCommand).toUpperCase()) {
    case "ADD":
      return courseAdd(params);
    case "GETALL":
      return courseGetAll();
    case "JOIN":
      return courseJoin(params);
    case "LEAVE":
      return courseLeave(params);
    default:
      throw new Error("ERROR: Invalid COURSE subcommand");
  }
}