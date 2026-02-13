import type { Tour, Booking } from "./types";

const API_BASE = "/api";

export async function fetchTours(): Promise<Tour[]> {
  const res = await fetch(`${API_BASE}/tours`);
  const data = await res.json();
  return data.tours;
}

export async function fetchTour(tourId: string): Promise<Tour> {
  const res = await fetch(`${API_BASE}/tours/${tourId}`);
  return res.json();
}

export async function fetchBookings(): Promise<Booking[]> {
  const res = await fetch(`${API_BASE}/bookings`);
  const data = await res.json();
  return data.bookings;
}

export async function sendTextMessage(
  message: string,
  sessionId: string
): Promise<{ response: string; session_id: string }> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, session_id: sessionId }),
  });
  return res.json();
}

export async function sendVoiceMessage(
  audioBase64: string,
  sessionId: string
): Promise<{
  transcribed_text: string;
  response: string;
  session_id: string;
}> {
  const res = await fetch(`${API_BASE}/voice`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ audio_base64: audioBase64, session_id: sessionId }),
  });
  return res.json();
}
