

export function parseId(idStr) {
  const id = Number(idStr);
  return id;
}

export function isValidId(id) {
  return Number.isInteger(id) && id > 0;
}

export function generateUniqueId(existingIds) {
  
  let id;
  do {
    id = Math.floor(Math.random() * 100000) + 1; 
  } while (existingIds.has(id));
  return id;
}