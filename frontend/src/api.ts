import type { Tour, Booking, StructuredData } from "./types";

const API_BASE = import.meta.env.VITE_API_URL || "";

export async function fetchTours(): Promise<Tour[]> {
  const res = await fetch(`${API_BASE}/api/tours`);
  const data = await res.json();
  return data.tours;
}

export async function fetchTour(tourId: string): Promise<Tour> {
  const res = await fetch(`${API_BASE}/api/tours/${tourId}`);
  if (!res.ok) throw new Error("Tour not found");
  return res.json();
}

export async function fetchBookings(): Promise<Booking[]> {
  const res = await fetch(`${API_BASE}/api/bookings`);
  const data = await res.json();
  return data.bookings;
}

export interface ChatResponse {
  response: string;
  session_id: string;
  structured_data?: StructuredData;
}

export async function sendTextMessage(
  message: string,
  sessionId: string
): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, session_id: sessionId }),
  });
  return res.json();
}

export async function sendVoiceMessage(
  audioBase64: string,
  sessionId: string
): Promise<ChatResponse & { transcribed_text: string }> {
  const res = await fetch(`${API_BASE}/api/voice`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ audio_base64: audioBase64, session_id: sessionId }),
  });
  return res.json();
}
