import type { Tour, Booking } from "./types";
import { getAllTours, getAllBookings } from "./tour-data";
import { ClientChatSession } from "./gemini-client";

const GEMINI_API_KEY =
  import.meta.env.VITE_GEMINI_API_KEY ||
  "AIzaSyC8fQ54RW5k1EFaKmKfYW6Y4IDIAdLloNc";

const sessions = new Map<string, ClientChatSession>();

function getSession(sessionId: string): ClientChatSession {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, new ClientChatSession(GEMINI_API_KEY));
  }
  return sessions.get(sessionId)!;
}

export async function fetchTours(): Promise<Tour[]> {
  return getAllTours();
}

export async function fetchTour(tourId: string): Promise<Tour> {
  const tour = getAllTours().find((t) => t.id === tourId);
  if (!tour) throw new Error("Tour not found");
  return tour;
}

export async function fetchBookings(): Promise<Booking[]> {
  return getAllBookings();
}

export async function sendTextMessage(
  message: string,
  sessionId: string
): Promise<{ response: string; session_id: string }> {
  const session = getSession(sessionId);
  const response = await session.sendMessage(message);
  return { response, session_id: sessionId };
}

export async function sendVoiceMessage(
  audioBase64: string,
  sessionId: string
): Promise<{
  transcribed_text: string;
  response: string;
  session_id: string;
}> {
  const session = getSession(sessionId);
  const { transcribed, response } = await session.processAudio(audioBase64);
  return { transcribed_text: transcribed, response, session_id: sessionId };
}
