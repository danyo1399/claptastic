// @ts-ignore
import audioFileUrl from "../media/audio.mp3";
import { blobs } from "./clap.db";
import getLogger from "../utils/logger";

const logger = getLogger("audio");

async function loadMp3() {
  // Noticed some odd behavior in android where if offline for certain amount of time looks like audio is
  // removed from cache?
  // store in indexdb just to be safe
  // If we have previous saved version in db, we may still live
  try {
    const response = await fetch(audioFileUrl);
    if (!response.ok) {
      logger.warn("Failed to load default audio file", audioFileUrl);
      throw response;
    }

    const blob = await response.blob();
    await blobs.setItem("default-audio", blob);
    return blob;
  } catch (e) {}

  return await blobs.getItem("default-audio");
}

async function getDefaultAudio() {
  const blob = await loadMp3();
  return URL.createObjectURL(blob);
}

export const defaultAudioUrlPromise = getDefaultAudio();

export let defaultAudioUrl;
(async () => {
  defaultAudioUrl = await defaultAudioUrlPromise;
})();
