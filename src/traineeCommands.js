import { loadTrainees, saveTrainees } from "./storage.js";

function generateId() {
  return Math.floor(Math.random() * 100000);
}

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

export async function viewTrainees() {
  const trainees = await loadTrainees();

  if (!trainees || trainees.length === 0) {
    return "No trainees found.";
  }

  const lines = trainees.map((t) => `${t.id} - ${t.firstName} ${t.lastName}`);
  return `Trainees:\n${lines.join("\n")}\n\nTotal: ${trainees.length}`;
}