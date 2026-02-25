import { loadCourses, saveCourses, loadTrainees } from "./storage.js";
import { parseId, isValidId, generateUniqueId } from "./utils.js";

const MAX_COURSE_CAPACITY = 20;
const MAX_TRAINEE_COURSES = 5;

function ensureParticipantsArray(course) {
  if (!course || typeof course !== "object") return { participants: [] };
  if (!Array.isArray(course.participants)) return { ...course, participants: [] };
  return course;
}

function getTraineeById(id) {
  const trainees = loadTrainees();
  return trainees.find((t) => t.id === id) || null;
}

function traineeCoursesCount(traineeId) {
  const courses = loadCourses().map(ensureParticipantsArray);
  return courses.filter((c) => c.participants.includes(traineeId)).length;
}

function courseAdd(params) {
  if (!params || params.length < 2) {
    throw new Error("ERROR: Must provide course name and start date");
  }

  const [name, startDate] = params;

  if (!name || String(name).trim().length === 0) {
    throw new Error("ERROR: Course name can not be empty");
  }

  const courses = loadCourses().map(ensureParticipantsArray);
  const existingIds = new Set(courses.map((c) => c.id));
  const id = generateUniqueId(existingIds);

  courses.push({ id, name, startDate, participants: [] });
  saveCourses(courses);

  return `CREATED: ${id} ${name} ${startDate}`;
}

function courseGet(params) {
  if (!params || params.length < 1) {
    throw new Error("ERROR: Must provide ID");
  }

  const [idStr] = params;
  const id = parseId(idStr);

  if (!isValidId(id)) {
    throw new Error("ERROR: Invalid ID");
  }

  const courses = loadCourses().map(ensureParticipantsArray);
  const c = courses.find((x) => x.id === id);

  if (!c) {
    throw new Error(`ERROR: Course with ID ${idStr} does not exist`);
  }

  return `${c.id} ${c.name} ${c.startDate} ${c.participants.length}`;
}

function courseGetAll() {
  const courses = loadCourses()
    .map(ensureParticipantsArray)
    .slice()
    .sort((a, b) => String(a.startDate).localeCompare(String(b.startDate)));

  let result = "Courses:\n";
  for (const c of courses) {
    result += `${c.id} ${c.name} ${c.startDate} ${c.participants.length}\n`;
  }
  result += `Total: ${courses.length}`;
  return result;
}

function courseUpdate(params) {
  if (!params || params.length < 3) {
    throw new Error("ERROR: Must provide ID, course name and start date");
  }

  const [idStr, name, startDate] = params;
  const id = parseId(idStr);

  if (!isValidId(id)) {
    throw new Error("ERROR: Invalid ID");
  }

  if (!name || String(name).trim().length === 0) {
    throw new Error("ERROR: Course name can not be empty");
  }

  const courses = loadCourses().map(ensureParticipantsArray);
  const idx = courses.findIndex((c) => c.id === id);

  if (idx === -1) {
    throw new Error(`ERROR: Course with ID ${idStr} does not exist`);
  }

  const current = courses[idx];
  courses[idx] = { ...current, name, startDate };
  saveCourses(courses);

  return `UPDATED: ${id} ${name} ${startDate}`;
}

function courseDelete(params) {
  if (!params || params.length < 1) {
    throw new Error("ERROR: Must provide ID");
  }

  const [idStr] = params;
  const id = parseId(idStr);

  if (!isValidId(id)) {
    throw new Error("ERROR: Invalid ID");
  }

  const courses = loadCourses().map(ensureParticipantsArray);
  const idx = courses.findIndex((c) => c.id === id);

  if (idx === -1) {
    throw new Error(`ERROR: Course with ID ${idStr} does not exist`);
  }

  courses.splice(idx, 1);
  saveCourses(courses);

  return `DELETED: ${idStr}`;
}

function courseJoin(params) {
  if (!params || params.length < 2) {
    throw new Error("ERROR: Must provide course ID and trainee ID");
  }

  const [courseIdStr, traineeIdStr] = params;
  const courseId = parseId(courseIdStr);
  const traineeId = parseId(traineeIdStr);

  if (!isValidId(courseId) || !isValidId(traineeId)) {
    throw new Error("ERROR: Invalid ID");
  }

  const courses = loadCourses().map(ensureParticipantsArray);
  const idx = courses.findIndex((c) => c.id === courseId);

  if (idx === -1) {
    throw new Error(`ERROR: Course with ID ${courseIdStr} does not exist`);
  }

  const trainee = getTraineeById(traineeId);
  if (!trainee) {
    throw new Error(`ERROR: Trainee with ID ${traineeIdStr} does not exist`);
  }

  const course = courses[idx];

  if (course.participants.includes(traineeId)) {
    throw new Error("ERROR: The Trainee has already joined this course");
  }

  if (course.participants.length >= MAX_COURSE_CAPACITY) {
    throw new Error("ERROR: The course is full.");
  }

  const count = traineeCoursesCount(traineeId);
  if (count >= MAX_TRAINEE_COURSES) {
    throw new Error("ERROR: A trainee is not allowed to join more than 5 courses.");
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

  if (!isValidId(courseId) || !isValidId(traineeId)) {
    throw new Error("ERROR: Invalid ID");
  }

  const courses = loadCourses().map(ensureParticipantsArray);
  const idx = courses.findIndex((c) => c.id === courseId);

  if (idx === -1) {
    throw new Error(`ERROR: Course with ID ${courseIdStr} does not exist`);
  }

  const trainee = getTraineeById(traineeId);
  if (!trainee) {
    throw new Error(`ERROR: Trainee with ID ${traineeIdStr} does not exist`);
  }

  const course = courses[idx];

  if (!course.participants.includes(traineeId)) {
    throw new Error("ERROR: The Trainee did not join the course");
  }

  course.participants = course.participants.filter((id) => id !== traineeId);
  courses[idx] = course;
  saveCourses(courses);

  return `${trainee.firstName} ${trainee.lastName} left ${course.name}`;
}

export function handleCourseCommand(subCommand, params) {
  switch (String(subCommand).toUpperCase()) {
    case "ADD":
      return courseAdd(params);
    case "GET":
      return courseGet(params);
    case "GETALL":
    case "LIST":
      return courseGetAll();
    case "UPDATE":
      return courseUpdate(params);
    case "DELETE":
      return courseDelete(params);
    case "JOIN":
      return courseJoin(params);
    case "LEAVE":
      return courseLeave(params);
    default:
      throw new Error("ERROR: Invalid COURSE subcommand");
  }
}