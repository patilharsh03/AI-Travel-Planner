import { readFileSync } from "node:fs";
import { itinerarySchema } from "../schemas/itinerary.js";

const raw = JSON.parse(
    readFileSync(new URL("../sample/itinerary.json", import.meta.url), "utf-8")
);
const result = itinerarySchema.safeParse(raw);

if (result.success) {
    console.log("Sample is valid.", result.data.days.length, "days");
} else {
    console.error("Sample is INVALID");
    console.error(JSON.stringify(result.error.issues, null, 2));
    process.exit(1);
}