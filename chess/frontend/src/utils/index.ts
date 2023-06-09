import type { TickEvent } from "@src/paima";
import { format } from "date-fns";

export const formatDate = (dateISO: string | Date): string => {
  const date = new Date(dateISO);
  return format(date, "yyyy-MM-dd, HH:mm:ss");
};

export const formatTime = (time: number): string => {
  const seconds = time % 60;
  const minutes = Math.floor(time / 60) % 60;
  const hours = Math.floor(time / 3600);

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
};

export function isTickEvent(event: any): event is TickEvent {
  return (event as TickEvent).pgn_move !== undefined;
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
