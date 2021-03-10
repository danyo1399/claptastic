import PouchDB from "pouchdb-browser";
import { ClapModel } from "./state/clapsState";
const db = new PouchDB("my_database");

export async function addClap(clap: ClapModel) {
  const result = await db.put({
    ...clap,
    _id: new Date().toJSON(),
  });
  console.log("lol put result", result);
  return result;
}

export async function updateClap(clap) {
  return await db.put(clap);
}

export async function getAllClaps() {
  const result = await db.allDocs({ include_docs: true });
  return result.rows.map((x) => x.doc);
}
