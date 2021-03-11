import { createEventFn } from "../events/events.db";

const type = "CLAPPED";
export interface ClapEventData {
  lat?: number;
  long?: number;
  message?: string;
}

export const clapped = createEventFn<ClapEventData>(type);
