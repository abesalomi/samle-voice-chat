"""Gemini AI service for chat and voice interactions."""

import json
import os
from google import genai
from google.genai import types

from app.tour_data import (
    get_tours_summary,
    get_all_tours,
    get_tour_by_id,
    search_tours,
    create_booking,
    get_all_bookings,
)

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")

SYSTEM_PROMPT = """You are a friendly and knowledgeable Thailand tour booking assistant. Your name is "Sawasdee" (Thai greeting).

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
{tours_summary}
"""


# Define function declarations for Gemini
TOOL_FUNCTIONS = types.Tool(
    function_declarations=[
        types.FunctionDeclaration(
            name="list_tours",
            description="List all available Thailand tours with their details",
            parameters=types.Schema(
                type=types.Type.OBJECT,
                properties={},
            ),
        ),
        types.FunctionDeclaration(
            name="search_tours",
            description="Search for tours by keyword (location, activity type, etc.)",
            parameters=types.Schema(
                type=types.Type.OBJECT,
                properties={
                    "query": types.Schema(
                        type=types.Type.STRING,
                        description="Search query (e.g., 'Bangkok', 'snorkeling', 'food')",
                    ),
                },
                required=["query"],
            ),
        ),
        types.FunctionDeclaration(
            name="get_tour_details",
            description="Get detailed information about a specific tour by its ID",
            parameters=types.Schema(
                type=types.Type.OBJECT,
                properties={
                    "tour_id": types.Schema(
                        type=types.Type.STRING,
                        description="The tour ID (e.g., 'tour-001')",
                    ),
                },
                required=["tour_id"],
            ),
        ),
        types.FunctionDeclaration(
            name="book_tour",
            description="Book a tour for a customer. Call this when you have all required information.",
            parameters=types.Schema(
                type=types.Type.OBJECT,
                properties={
                    "tour_id": types.Schema(
                        type=types.Type.STRING,
                        description="The tour ID to book",
                    ),
                    "selected_date": types.Schema(
                        type=types.Type.STRING,
                        description="The selected date in YYYY-MM-DD format",
                    ),
                    "num_participants": types.Schema(
                        type=types.Type.INTEGER,
                        description="Number of participants",
                    ),
                    "customer_name": types.Schema(
                        type=types.Type.STRING,
                        description="Customer's full name",
                    ),
                    "customer_email": types.Schema(
                        type=types.Type.STRING,
                        description="Customer's email address",
                    ),
                },
                required=[
                    "tour_id",
                    "selected_date",
                    "num_participants",
                    "customer_name",
                    "customer_email",
                ],
            ),
        ),
        types.FunctionDeclaration(
            name="get_bookings",
            description="Get all current bookings for the user",
            parameters=types.Schema(
                type=types.Type.OBJECT,
                properties={},
            ),
        ),
    ]
)


def _handle_function_call(function_call) -> str:
    """Execute a function call from Gemini and return the result."""
    name = function_call.name
    args = dict(function_call.args) if function_call.args else {}

    if name == "list_tours":
        tours = get_all_tours()
        return json.dumps(tours, default=str)
    elif name == "search_tours":
        results = search_tours(args.get("query", ""))
        return json.dumps(results, default=str)
    elif name == "get_tour_details":
        tour = get_tour_by_id(args.get("tour_id", ""))
        if tour:
            return json.dumps(tour, default=str)
        return json.dumps({"error": "Tour not found"})
    elif name == "book_tour":
        booking = create_booking(
            tour_id=args.get("tour_id", ""),
            selected_date=args.get("selected_date", ""),
            num_participants=int(args.get("num_participants", 1)),
            customer_name=args.get("customer_name", ""),
            customer_email=args.get("customer_email", ""),
        )
        if booking:
            return json.dumps(booking, default=str)
        return json.dumps({"error": "Could not create booking. Check tour ID and date availability."})
    elif name == "get_bookings":
        bookings = get_all_bookings()
        return json.dumps(bookings, default=str)
    else:
        return json.dumps({"error": f"Unknown function: {name}"})


class ChatSession:
    """Manages a chat session with Gemini."""

    def __init__(self):
        self.client = genai.Client(api_key=GEMINI_API_KEY)
        self.history: list = []
        self.system_prompt = SYSTEM_PROMPT.format(tours_summary=get_tours_summary())

    async def send_message(self, user_message: str) -> str:
        """Send a text message and get a response, handling function calls."""
        self.history.append(
            types.Content(
                role="user",
                parts=[types.Part.from_text(text=user_message)],
            )
        )

        response = self.client.models.generate_content(
            model="gemini-2.0-flash",
            contents=self.history,
            config=types.GenerateContentConfig(
                system_instruction=self.system_prompt,
                tools=[TOOL_FUNCTIONS],
                temperature=0.7,
            ),
        )

        # Handle function calls in a loop
        while response.candidates and response.candidates[0].content.parts:
            parts = response.candidates[0].content.parts
            function_calls = [p for p in parts if p.function_call]

            if not function_calls:
                break

            # Add the assistant's response with function calls to history
            self.history.append(response.candidates[0].content)

            # Process each function call
            function_responses = []
            for part in function_calls:
                result = _handle_function_call(part.function_call)
                function_responses.append(
                    types.Part.from_function_response(
                        name=part.function_call.name,
                        response=json.loads(result),
                    )
                )

            # Add function responses to history
            self.history.append(
                types.Content(
                    role="user",
                    parts=function_responses,
                )
            )

            # Get next response
            response = self.client.models.generate_content(
                model="gemini-2.0-flash",
                contents=self.history,
                config=types.GenerateContentConfig(
                    system_instruction=self.system_prompt,
                    tools=[TOOL_FUNCTIONS],
                    temperature=0.7,
                ),
            )

        # Extract text response
        if response.candidates and response.candidates[0].content.parts:
            assistant_text = response.candidates[0].content.parts[0].text
            self.history.append(response.candidates[0].content)
            return assistant_text

        return "I'm sorry, I couldn't process that. Could you try again?"

    async def process_audio(self, audio_bytes: bytes) -> tuple[str, str]:
        """Process audio input: transcribe with Gemini, get chat response.

        Returns (transcribed_text, assistant_response).
        """
        # Use Gemini to transcribe the audio
        transcription_response = self.client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[
                types.Content(
                    role="user",
                    parts=[
                        types.Part.from_bytes(data=audio_bytes, mime_type="audio/webm"),
                        types.Part.from_text(
                            text="Transcribe this audio exactly. Return ONLY the transcribed text, nothing else."
                        ),
                    ],
                )
            ],
        )

        transcribed = ""
        if transcription_response.candidates:
            transcribed = transcription_response.candidates[0].content.parts[0].text.strip()

        if not transcribed:
            return "", "I couldn't understand the audio. Could you try again?"

        # Now send the transcribed text through the normal chat flow
        response = await self.send_message(transcribed)
        return transcribed, response
