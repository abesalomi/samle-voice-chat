export interface TourResponse {
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

export interface BookingResponse {
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

export interface StructuredData {
  type: "tours" | "tour_detail" | "booking_confirmation" | "bookings";
  data: TourResponse[] | TourResponse | BookingResponse | BookingResponse[];
}
