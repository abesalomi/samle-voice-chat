export interface Tour {
  id: string;
  name: string;
  location: string;
  description: string;
  duration: string;
  price_usd: number;
  available_dates: string[];
  max_participants: number;
  image_url: string;
}

export interface Booking {
  id: string;
  tour_id: string;
  tour_name: string;
  location: string;
  selected_date: string;
  num_participants: number;
  customer_name: string;
  customer_email: string;
  total_price_usd: number;
  status: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isVoice?: boolean;
  transcribedText?: string;
}
