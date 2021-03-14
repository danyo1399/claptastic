import PouchDB from "pouchdb-browser";
import { uniqueId } from "../utils/id.utils";
import { clapperAudioUpdated, clapperCustomAudioRemoved } from "./clap.events";
import { blobStorage, upsert } from "../utils/db";

// Leave this here to migrate everyone off obsolete db migrating data and then destroying
export const clapsDb = new PouchDB("claptastic", { auto_compaction: true });

export const blobs = blobStorage(clapsDb);

function genId(id: number) {
  return `${id}#clapper-audio`;
}
export async function getClapperAudio(id: number) {
  const docId = genId(id);
  return await blobs.getItem(docId);
}

export async function deleteClapperAudio(id: number) {
  const docId = genId(id);
  await blobs.deleteItem(docId);
  clapperCustomAudioRemoved.raiseEvent({ clapperId: id });
}

export async function setClapperAudio(id: number, name: string, blob: Blob) {
  const docId = genId(id);
  const ref = await blobs.setItem(docId, blob);

  await clapperAudioUpdated.raiseEvent({
    clapperId: id,
    docId: ref.id,
    docRev: ref.rev,
    name: name,
    type: blob.type,
  });
}
