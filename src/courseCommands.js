import {
  loadCourseData,
  saveCourseData,
  loadTraineeData,
} from "./storage.js";

function normalizeSpaces(str) {
  return String(str).trim().replace(/\s+/g, " ");
}

function findTraineeByName(trainees, name) {
  const target = normalizeSpaces(name).toLowerCase();
  return trainees.find((t) => normalizeSpaces(t.name).toLowerCase() === target);
}

function findCourseById(courses, id) {
  return courses.find((c) => Number(c.id) === Number(id));
}

function addCourse(args) {
  if (!args || args.length < 3) {
    return "ERROR: Usage: COURSE ADD <id> <name> <startDate>";
  }

  const id = Number(args[0]);
  const startDate = String(args[args.length - 1]);
  const name = normalizeSpaces(args.slice(1, -1).join(" "));

  if (!Number.isInteger(id)) return "ERROR: invalid course id";
  if (!name) return "ERROR: invalid course name";
  if (!startDate) return "ERROR: invalid startDate";

  const courses = loadCourseData();
  if (findCourseById(courses, id)) return "ERROR: course already exists";

  courses.push({
    id,
    name,
    startDate,
    participants: [],
  });

  saveCourseData(courses);
  return "OK: course added";
}

function getAllCourses() {
  const courses = loadCourseData();

  let out = "Courses:\n";
  for (const c of courses) {
    const count = Array.isArray(c.participants) ? c.participants.length : 0;
    out += `${c.id} ${c.name} ${c.startDate} ${count}\n`;
  }
  out += `Total: ${courses.length}`;
  return out;
}

function joinCourse(args) {
  if (!args || args.length < 2) {
    return "ERROR: Usage: COURSE JOIN <id> <trainee name>";
  }

  const courseId = Number(args[0]);
  const traineeName = normalizeSpaces(args.slice(1).join(" "));

  if (!Number.isInteger(courseId)) return "ERROR: invalid course id";
  if (!traineeName) return "ERROR: invalid trainee name";

  const courses = loadCourseData();
  const trainees = loadTraineeData();

  const course = findCourseById(courses, courseId);
  if (!course) return "ERROR: course not found";

  const trainee = findTraineeByName(trainees, traineeName);
  if (!trainee) return "ERROR: trainee not found";

  if (!Array.isArray(course.participants)) course.participants = [];

  const already = course.participants.some(
    (p) => normalizeSpaces(p).toLowerCase() === normalizeSpaces(trainee.name).toLowerCase()
  );
  if (already) return "ERROR: trainee already enrolled";

  course.participants.push(trainee.name);
  saveCourseData(courses);

  return "OK: trainee joined course";
}

function leaveCourse(args) {
  if (!args || args.length < 2) {
    return "ERROR: Usage: COURSE LEAVE <id> <trainee name>";
  }

  const courseId = Number(args[0]);
  const traineeName = normalizeSpaces(args.slice(1).join(" "));

  if (!Number.isInteger(courseId)) return "ERROR: invalid course id";
  if (!traineeName) return "ERROR: invalid trainee name";

  const courses = loadCourseData();
  const course = findCourseById(courses, courseId);
  if (!course) return "ERROR: course not found";

  if (!Array.isArray(course.participants)) course.participants = [];

  const index = course.participants.findIndex(
    (p) => normalizeSpaces(p).toLowerCase() === traineeName.toLowerCase()
  );

  if (index === -1) return "ERROR: trainee not enrolled";

  course.participants.splice(index, 1);
  saveCourseData(courses);

  return "OK: trainee left course";
}
function getCourse(args) {
  if (!args || args.length < 1) {
    return "ERROR: Usage: COURSE GET <id>";
  }
  const courseId = Number(args[0]);
  if (!Number.isInteger(courseId)) return "ERROR: invalid course id";

  const courses = loadCourseData();
  const course = findCourseById(courses, courseId);
  if (!course) return "ERROR: course not found";

  const count = Array.isArray(course.participants) ? course.participants.length : 0;
  const participants = Array.isArray(course.participants) ? course.participants.join(", ") : "";

  let out = `Course:\n`;
  out += `id: ${course.id}\n`;
  out += `name: ${course.name}\n`;
  out += `startDate: ${course.startDate}\n`;
  out += `participants (${count}): ${participants}`;

  return out;
}

export function handleCourseCommand(subCommand, args = []) {
  const cmd = String(subCommand || "").toUpperCase();

  switch (cmd) {
    case "ADD":
      return addCourse(args);
    case "GETALL":
      return getAllCourses();
    case "GET":
      return getCourse(args);
    case "JOIN":
      return joinCourse(args);
    case "LEAVE":
      return leaveCourse(args);
    default:
      return "ERROR: unknown COURSE subcommand";
  }
}