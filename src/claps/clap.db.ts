import PouchDB from "pouchdb-browser";
import { uniqueId } from "../utils/id.utils";
import { clapperAudioUpdated, clapperCustomAudioRemoved } from "./clap.events";
import { blobStorage, upsert } from "../utils/db";

// Leave this here to migrate everyone off obsolete db migrating data and then destroying
export const clapsDb = new PouchDB("claptastic", { auto_compaction: true });

export const blobs = blobStorage(clapsDb);

function genId(id: number) {
  return uniqueId(`${id}#audio`);
}

export async function setClapperAudio(id: number, name: string, blob: Blob) {
  const docId = genId(id);
  const ref = await blobs.setItem(docId, blob);

  await clapperAudioUpdated.raiseEvent({
    clapperId: id,
    key: docId,
    name: name,
    type: blob.type,
  });
}
