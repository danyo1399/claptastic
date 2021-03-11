let nextId = 0;

export function uniqueId(prefix: string) {
  nextId++;
  return `${prefix}#${(nextId + Date.now()).toString(36)}`;
}
