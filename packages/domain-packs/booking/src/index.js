import { detect, refine } from "./refinement.js";

/**
 * USC Domain Pack: Booking
 *
 * Reusable construction grammar for booking, scheduling, and reservation systems.
 * Does not assume payments or self-booking.
 * Does not contain app-specific decisions, product code, or secrets.
 */
export default {
  id: "booking",
  name: "Booking",
  detect,
  refine,
};

export { detect, refine };
