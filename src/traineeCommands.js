// src/traineeCommands.js
import { loadTrainees, saveTrainees } from "./storage.js";

function generateId() {
  return Math.floor(Math.random() * 100000);
}

// TRAINEE ADD FirstName LastName
export async function addTrainee(params) {
  if (!params || params.length < 2) {
    throw new Error("ERROR: Must provide first and last name");
  }

  const [firstName, lastName] = params;

  const trainees = await loadTrainees();

  const id = generateId();
  trainees.push({ id, firstName, lastName });

  await saveTrainees(trainees);

  return `CREATED: ${id} ${firstName} ${lastName}`;
}

// TRAINEE VIEW
export async function viewTrainees() {
  const trainees = await loadTrainees();

  if (!trainees || trainees.length === 0) {
    return "No trainees found.";
  }

  const lines = trainees.map((t) => `${t.id} - ${t.firstName} ${t.lastName}`);
  return `Trainees:\n${lines.join("\n")}\n\nTotal: ${trainees.length}`;
}

//  TRAINEE DELETE <id>
export async function deleteTrainee(params) {
  if (!params || params.length < 1) {
    throw new Error("ERROR: Must provide trainee id");
  }

  const [idStr] = params;
  const id = Number(idStr);

  if (Number.isNaN(id)) {
    throw new Error("ERROR: trainee id must be a number");
  }

  const trainees = await loadTrainees();

  const index = trainees.findIndex((t) => t.id === id);
  if (index === -1) {
    return `ERROR: Trainee with id ${id} not found`;
  }

  const removed = trainees.splice(index, 1)[0];
  await saveTrainees(trainees);

  return `DELETED: ${removed.id} ${removed.firstName} ${removed.lastName}`;
}