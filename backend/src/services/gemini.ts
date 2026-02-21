import {
  GoogleGenerativeAI,
  SchemaType,
  type Content,
  type Part,
  type Tool,
} from "@google/generative-ai";
import { config } from "../config/env.js";
import * as tourService from "./tourService.js";
import * as bookingService from "./bookingService.js";
import type { StructuredData } from "../types/index.js";

const genAI = new GoogleGenerativeAI(config.geminiApiKey);

let cachedSystemPrompt: string | null = null;

async function getSystemPrompt(): Promise<string> {
  if (cachedSystemPrompt) return cachedSystemPrompt;
  const summary = await tourService.getToursSummary();
  cachedSystemPrompt = `You are a friendly and knowledgeable Thailand tour booking assistant. Your name is "Sawasdee" (Thai greeting).

You help users:
1. Browse available tours in Thailand
2. Get details about specific tours
3. Book tours by collecting necessary information
4. Answer questions about Thailand travel

IMPORTANT RULES:
- Always be enthusiastic about Thailand and its culture
- When a user wants to book, you MUST collect: their name, email, preferred tour, date, and number of participants
- When you have all booking details, DO NOT immediately call book_tour. Instead, present a clear summary of the booking and ask the user: "Shall I confirm this booking?"
- ONLY call the book_tour function AFTER the user explicitly confirms (says yes, confirm, go ahead, etc.)
- If the user says no or wants to change something, help them modify the details
- When users ask about available tours, call the list_tours function
- When users search for specific types of tours, call the search_tours function
- Present tour information in a clear, appealing way
- Prices are per person in USD
- If a user is unsure, suggest popular tours based on their interests

Here is the current tour catalog:
${summary}`;
  return cachedSystemPrompt;
}

const tools: Tool[] = [
  {
    functionDeclarations: [
      {
        name: "list_tours",
        description: "List all available Thailand tours with their details",
        parameters: { type: SchemaType.OBJECT, properties: {} },
      },
      {
        name: "search_tours",
        description:
          "Search for tours by keyword (location, activity type, etc.)",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            query: {
              type: SchemaType.STRING,
              description: "Search query",
            },
          },
          required: ["query"],
        },
      },
      {
        name: "get_tour_details",
        description:
          "Get detailed information about a specific tour by its ID",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            tour_id: {
              type: SchemaType.STRING,
              description: "The tour ID",
            },
          },
          required: ["tour_id"],
        },
      },
      {
        name: "book_tour",
        description: "Book a tour for a customer.",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            tour_id: { type: SchemaType.STRING, description: "Tour ID" },
            selected_date: {
              type: SchemaType.STRING,
              description: "Date YYYY-MM-DD",
            },
            num_participants: {
              type: SchemaType.INTEGER,
              description: "Number of participants",
            },
            customer_name: {
              type: SchemaType.STRING,
              description: "Customer name",
            },
            customer_email: {
              type: SchemaType.STRING,
              description: "Customer email",
            },
          },
          required: [
            "tour_id",
            "selected_date",
            "num_participants",
            "customer_name",
            "customer_email",
          ],
        },
      },
      {
        name: "get_bookings",
        description: "Get all current bookings",
        parameters: { type: SchemaType.OBJECT, properties: {} },
      },
    ],
  },
];

async function handleFunctionCall(
  name: string,
  args: Record<string, unknown>
): Promise<{ result: string; structuredData: StructuredData | null }> {
  switch (name) {
    case "list_tours": {
      const tours = await tourService.getAllTours();
      const json = tours.map((t) => t.toJSON());
      return {
        result: JSON.stringify(json),
        structuredData: { type: "tours", data: json },
      };
    }
    case "search_tours": {
      const tours = await tourService.searchTours(String(args.query || ""));
      const json = tours.map((t) => t.toJSON());
      return {
        result: JSON.stringify(json),
        structuredData: { type: "tours", data: json },
      };
    }
    case "get_tour_details": {
      const tour = await tourService.getTourById(String(args.tour_id || ""));
      if (tour) {
        const json = tour.toJSON();
        return {
          result: JSON.stringify(json),
          structuredData: { type: "tour_detail", data: json },
        };
      }
      return {
        result: JSON.stringify({ error: "Tour not found" }),
        structuredData: null,
      };
    }
    case "book_tour": {
      const booking = await bookingService.createBooking({
        tourId: String(args.tour_id || ""),
        selectedDate: String(args.selected_date || ""),
        numParticipants: Number(args.num_participants || 1),
        customerName: String(args.customer_name || ""),
        customerEmail: String(args.customer_email || ""),
      });
      if (booking) {
        const json = booking.toJSON();
        return {
          result: JSON.stringify(json),
          structuredData: { type: "booking_confirmation", data: json },
        };
      }
      return {
        result: JSON.stringify({ error: "Could not create booking." }),
        structuredData: null,
      };
    }
    case "get_bookings": {
      const bookings = await bookingService.getAllBookings();
      const json = bookings.map((b) => b.toJSON());
      return {
        result: JSON.stringify(json),
        structuredData: { type: "bookings", data: json },
      };
    }
    default:
      return {
        result: JSON.stringify({ error: `Unknown function: ${name}` }),
        structuredData: null,
      };
  }
}

// In-memory session store
interface ChatSessionState {
  history: Content[];
  lastAccess: number;
}

const sessions = new Map<string, ChatSessionState>();

const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes

function getOrCreateSession(sessionId: string): ChatSessionState {
  let session = sessions.get(sessionId);
  if (!session) {
    session = { history: [], lastAccess: Date.now() };
    sessions.set(sessionId, session);
  }
  session.lastAccess = Date.now();
  return session;
}

// Clean up stale sessions periodically
setInterval(() => {
  const now = Date.now();
  for (const [id, session] of sessions) {
    if (now - session.lastAccess > SESSION_TTL_MS) {
      sessions.delete(id);
    }
  }
}, 5 * 60 * 1000);

export interface ChatResult {
  response: string;
  structuredData: StructuredData | null;
}

export async function sendMessage(
  sessionId: string,
  userMessage: string
): Promise<ChatResult> {
  const session = getOrCreateSession(sessionId);
  const systemPrompt = await getSystemPrompt();

  session.history.push({
    role: "user",
    parts: [{ text: userMessage }],
  });

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: systemPrompt,
    tools,
  });

  let result = await model.generateContent({
    contents: session.history,
    generationConfig: { temperature: 0.7 },
  });

  let lastStructuredData: StructuredData | null = null;
  let maxIterations = 5;

  while (maxIterations-- > 0) {
    const candidate = result.response.candidates?.[0];
    if (!candidate?.content?.parts) break;

    const functionCalls = candidate.content.parts.filter(
      (p: Part) => "functionCall" in p && p.functionCall
    );
    if (functionCalls.length === 0) break;

    // Add assistant response with function calls to history
    session.history.push(candidate.content);

    // Process function calls
    const functionResponses: Part[] = [];
    for (const p of functionCalls) {
      const fc = (
        p as { functionCall: { name: string; args: Record<string, unknown> } }
      ).functionCall;
      const { result: resultStr, structuredData } =
        await handleFunctionCall(fc.name, fc.args || {});
      if (structuredData) lastStructuredData = structuredData;
      functionResponses.push({
        functionResponse: {
          name: fc.name,
          response: JSON.parse(resultStr),
        },
      });
    }

    session.history.push({ role: "user", parts: functionResponses });

    result = await model.generateContent({
      contents: session.history,
      generationConfig: { temperature: 0.7 },
    });
  }

  const finalCandidate = result.response.candidates?.[0];
  const textPart = finalCandidate?.content?.parts?.[0];
  if (textPart && "text" in textPart) {
    session.history.push(finalCandidate!.content);
    return {
      response: textPart.text as string,
      structuredData: lastStructuredData,
    };
  }

  return {
    response: "I'm sorry, I couldn't process that. Could you try again?",
    structuredData: null,
  };
}

export async function processAudio(
  sessionId: string,
  audioBase64: string
): Promise<{
  transcribed: string;
  response: string;
  structuredData: StructuredData | null;
}> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const transcriptionResult = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          { inlineData: { mimeType: "audio/webm", data: audioBase64 } },
          {
            text: "Transcribe this audio exactly. Return ONLY the transcribed text, nothing else.",
          },
        ],
      },
    ],
  });

  const transcribed =
    transcriptionResult.response.candidates?.[0]?.content?.parts?.[0];
  const transcribedText =
    transcribed && "text" in transcribed
      ? (transcribed.text as string).trim()
      : "";

  if (!transcribedText) {
    return {
      transcribed: "",
      response: "I couldn't understand the audio. Could you try again?",
      structuredData: null,
    };
  }

  const chatResult = await sendMessage(sessionId, transcribedText);
  return { transcribed: transcribedText, ...chatResult };
}
