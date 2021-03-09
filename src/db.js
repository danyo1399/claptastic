import { default as PouchDB } from "pouchdb-browser";
var db = new PouchDB("my_database");

export async function addClap(message, x, y) {
  const result = await db.put({
    _id: Date.now().toString().padStart(15, "0"),
    message,
    x,
    y,
    date: Date.now(),
  });
  return result;
}

export async function updateClap(clap) {
  return await db.put(clap);
}

export async function getAllClaps() {
  return await db.allDocs();
}
