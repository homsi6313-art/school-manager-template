
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