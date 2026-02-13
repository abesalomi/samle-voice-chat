import { GoogleGenerativeAI, SchemaType, type Content, type Part, type Tool } from "@google/generative-ai";
import {
  getAllTours,
  getTourById,
  searchTours,
  createBooking,
  getAllBookings,
  getToursSummary,
} from "./tour-data";

const SYSTEM_PROMPT = `You are a friendly and knowledgeable Thailand tour booking assistant. Your name is "Sawasdee" (Thai greeting).

You help users:
1. Browse available tours in Thailand
2. Get details about specific tours
3. Book tours by collecting necessary information
4. Answer questions about Thailand travel

IMPORTANT RULES:
- Always be enthusiastic about Thailand and its culture
- When a user wants to book, you MUST collect: their name, email, preferred tour, date, and number of participants
- When you have all booking details, call the book_tour function
- When users ask about available tours, call the list_tours function
- When users search for specific types of tours, call the search_tours function
- Present tour information in a clear, appealing way
- Prices are per person in USD
- If a user is unsure, suggest popular tours based on their interests

Here is the current tour catalog:
${getToursSummary()}
`;

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
        description: "Search for tours by keyword (location, activity type, etc.)",
        parameters: {
          type: SchemaType.OBJECT,
          properties: { query: { type: SchemaType.STRING, description: "Search query" } },
          required: ["query"],
        },
      },
      {
        name: "get_tour_details",
        description: "Get detailed information about a specific tour by its ID",
        parameters: {
          type: SchemaType.OBJECT,
          properties: { tour_id: { type: SchemaType.STRING, description: "The tour ID" } },
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
            selected_date: { type: SchemaType.STRING, description: "Date YYYY-MM-DD" },
            num_participants: { type: SchemaType.INTEGER, description: "Number of participants" },
            customer_name: { type: SchemaType.STRING, description: "Customer name" },
            customer_email: { type: SchemaType.STRING, description: "Customer email" },
          },
          required: ["tour_id", "selected_date", "num_participants", "customer_name", "customer_email"],
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

function handleFunctionCall(name: string, args: Record<string, unknown>): string {
  switch (name) {
    case "list_tours":
      return JSON.stringify(getAllTours());
    case "search_tours":
      return JSON.stringify(searchTours(String(args.query || "")));
    case "get_tour_details": {
      const tour = getTourById(String(args.tour_id || ""));
      return tour ? JSON.stringify(tour) : JSON.stringify({ error: "Tour not found" });
    }
    case "book_tour": {
      const booking = createBooking(
        String(args.tour_id || ""),
        String(args.selected_date || ""),
        Number(args.num_participants || 1),
        String(args.customer_name || ""),
        String(args.customer_email || "")
      );
      return booking ? JSON.stringify(booking) : JSON.stringify({ error: "Could not create booking." });
    }
    case "get_bookings":
      return JSON.stringify(getAllBookings());
    default:
      return JSON.stringify({ error: `Unknown function: ${name}` });
  }
}

export class ClientChatSession {
  private genAI: GoogleGenerativeAI;
  private history: Content[] = [];

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async sendMessage(userMessage: string): Promise<string> {
    this.history.push({
      role: "user",
      parts: [{ text: userMessage }],
    });

    const model = this.genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: SYSTEM_PROMPT,
      tools,
    });

    let result = await model.generateContent({
      contents: this.history,
      generationConfig: { temperature: 0.7 },
    });

    // Handle function calls in a loop
    let maxIterations = 5;
    while (maxIterations-- > 0) {
      const response = result.response;
      const candidate = response.candidates?.[0];
      if (!candidate?.content?.parts) break;

      const functionCalls = candidate.content.parts.filter(
        (p: Part) => "functionCall" in p && p.functionCall
      );

      if (functionCalls.length === 0) break;

      // Add assistant response with function calls to history
      this.history.push(candidate.content);

      // Process function calls and add responses
      const functionResponses: Part[] = functionCalls.map((p: Part) => {
        const fc = (p as { functionCall: { name: string; args: Record<string, unknown> } }).functionCall;
        const resultStr = handleFunctionCall(fc.name, fc.args || {});
        return {
          functionResponse: {
            name: fc.name,
            response: JSON.parse(resultStr),
          },
        };
      });

      this.history.push({
        role: "user",
        parts: functionResponses,
      });

      result = await model.generateContent({
        contents: this.history,
        generationConfig: { temperature: 0.7 },
      });
    }

    const finalResponse = result.response;
    const text = finalResponse.candidates?.[0]?.content?.parts?.[0];
    if (text && "text" in text) {
      this.history.push(finalResponse.candidates![0].content);
      return text.text as string;
    }

    return "I'm sorry, I couldn't process that. Could you try again?";
  }

  async processAudio(audioBase64: string): Promise<{ transcribed: string; response: string }> {
    const model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const transcriptionResult = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { mimeType: "audio/webm", data: audioBase64 } },
            { text: "Transcribe this audio exactly. Return ONLY the transcribed text, nothing else." },
          ],
        },
      ],
    });

    const transcribed = transcriptionResult.response.candidates?.[0]?.content?.parts?.[0];
    const transcribedText = transcribed && "text" in transcribed ? (transcribed.text as string).trim() : "";

    if (!transcribedText) {
      return { transcribed: "", response: "I couldn't understand the audio. Could you try again?" };
    }

    const response = await this.sendMessage(transcribedText);
    return { transcribed: transcribedText, response };
  }
}
