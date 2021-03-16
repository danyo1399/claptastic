import { clapped } from "./claps/clap.events";
import PouchDB from "pouchdb-browser";

// Leave this here to migrate everyone off obsolete db migrating data and then destroying
const oldDb = new PouchDB("my_database", { skip_setup: true });

(async () => {
  try {
    await oldDb.info();
    const docs = await oldDb.allDocs({ include_docs: true });
    docs.rows.forEach((x) => {
      clapped.raiseEvent({});
    });
    oldDb.destroy();
  } catch (err) {
    // assume old db doesnt exist.
  }
})();
