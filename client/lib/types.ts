export type Category =
    | "sightseeing" | "food" | "transport" | "activity" | "shopping" | "rest";

export type ItineraryItem = {
    timeSlot: "morning" | "afternoon" | "evening";
    startTime: string;
    title: string;
    description: string;
    category: Category;
    durationMinutes: number;
    place: { name: string; area: string };
    tip: string;
    costType: "per_person" | "group";
    amount: number;
};

export type ItineraryDay = {
    day: number;
    title: string;
    items: ItineraryItem[];
};

export type Itinerary = {
    summary: string;
    bestTimeNote: string;
    stay: { suggestion: string; pricePerRoomPerNight: number };
    days: ItineraryDay[];
};

export type TripInput = {
    destination: string;
    startDate: string;
    endDate: string;
    travellers: number;
    budgetLevel: "budget" | "mid" | "luxury";
    interests: string[];
    currency: string;
};