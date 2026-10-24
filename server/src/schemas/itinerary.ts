import { z } from "zod";

export const categories = [
    "sightseeing", "food", "transport", "activity", "shopping", "rest",
] as const;

export const itemSchema = z.object({
    timeSlot: z.enum(["morning", "afternoon", "evening"]),
    startTime: z.string().regex(/^\d{2}:\d{2}$/), // "09:30"
    title: z.string().min(1),
    description: z.string(),
    category: z.enum(categories),
    durationMinutes: z.number().int().min(0),
    place: z.object({ name: z.string(), area: z.string() }),
    tip: z.string().default(""),
    costType: z.enum(["per_person", "group"]),
    amount: z.number().min(0),
});

export const daySchema = z.object({
    day: z.number().int().min(1),
    title: z.string(),
    items: z.array(itemSchema).min(1),
});

export const itinerarySchema = z.object({
    summary: z.string(),
    bestTimeNote: z.string(),
    stay: z.object({
        suggestion: z.string(),
        pricePerRoomPerNight: z.number().min(0),
    }),
    days: z.array(daySchema).min(1),
});

export const tripInputSchema = z
    .object({
        destination: z.string().trim().min(2).max(80),
        startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        travellers: z.number().int().min(1).max(10),
        budgetLevel: z.enum(["budget", "mid", "luxury"]),
        interests: z.array(z.string().trim().max(30)).max(8).default([]),
        currency: z.string().length(3).default("INR"),
    })
    .refine((t) => t.endDate >= t.startDate, {
        message: "End date must be on or after the start date.",
    });

export type Itinerary = z.infer<typeof itinerarySchema>;
export type TripInput = z.infer<typeof tripInputSchema>;