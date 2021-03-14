import { createEventFn } from "../events/events.db";

export interface ClapEventData {
  lat?: number;
  long?: number;
  message?: string;
}

export const clapped = createEventFn<ClapEventData>("CLAPPED");

export interface ClapperAudioEventData {
  clapperId: number;
  name: string;
  type: string;
  docId: string;
  docRev: string;
}
export const clapperAudioUpdated = createEventFn<ClapperAudioEventData>(
  "clapperAudioUpdated"
);

export interface ClapperEventData {
  clapperId: number;
  buttonType: string;
}
export const clapperCreated = createEventFn<ClapperEventData>("clapperCreated");

export const clapperCustomAudioRemoved = createEventFn<{ clapperId: number }>(
  "clapperCustomAudioRemoved"
);
