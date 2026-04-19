export function detect(intent) {
  const text = intent.toLowerCase();
  const score =
    (/\bbooking\b/.test(text) ? 3 : 0) +
    (/\breservation\b/.test(text) ? 3 : 0) +
    (/\bscheduling\b/.test(text) ? 2 : 0) +
    (/\bappointment\b/.test(text) ? 2 : 0) +
    (/\brental\b/.test(text) ? 1 : 0) +
    (/\bvenue\b/.test(text) ? 1 : 0) +
    (/\bresource booking\b/.test(text) ? 2 : 0);
  return score > 0 ? score : false;
}

export function refine(intent) {
  return {
    ambiguities: [
      { layer: "ontology", description: "Bookable resources (people, rooms, equipment, services, vehicles, events)", governing: true },
      { layer: "ontology", description: "Customer model (guests, clients, members, anonymous, verified)", governing: true },
      { layer: "dynamics", description: "Booking workflow (request, confirm, hold, cancel, reschedule, no-show)", governing: true },
      { layer: "dynamics", description: "Availability model (calendar, shifts, blackout, recurring slots, duration rules)", governing: true },
      { layer: "normativity", description: "Who can book (self-booking, admin-only, member-only, referral, invitation)", governing: true },
      { layer: "normativity", description: "Cancellation and modification policy (deadlines, fees, grace periods, refunds)", governing: true },
      { layer: "environment", description: "Payment model if any (free, deposit, full payment, invoicing, pay-at-time)", governing: true },
      { layer: "environment", description: "Notifications and reminders (confirmation, reminder, cancellation, waitlist)", governing: true },
      { layer: "dynamics", description: "Waitlist and overbooking strategy", governing: true },
      { layer: "environment", description: "Integration with calendar, CRM, payment, or access control systems", governing: true },
      { layer: "normativity", description: "Capacity and concurrency rules (max bookings, group size, shared resources)", governing: true },
      { layer: "stopping", description: "MVP booking boundary — what resource types and features are in scope", governing: true },
    ],
    questions: [
      { question: "What types of resources can be booked?", authority: "principal", blocking: true },
      { question: "Who can make bookings (self, admin, members only)?", authority: "principal", blocking: true },
      { question: "What is the booking workflow (request, confirm, hold, cancel)?", authority: "principal", blocking: true },
      { question: "What availability model applies (fixed slots, flexible, recurring)?", authority: "principal", blocking: false },
      { question: "What cancellation and modification policy applies?", authority: "principal", blocking: false },
      { question: "Is payment required, and if so, what model?", authority: "principal", blocking: false },
      { question: "Are waitlists or overbooking required?", authority: "principal", blocking: false },
      { question: "What external integrations are required (calendar, CRM, access control)?", authority: "semantic", blocking: false },
    ],
    assumptions: [
      { assumption: "A request-and-confirm workflow is acceptable for MVP", confidence: "medium", reversible: true },
      { assumption: "Admin-mediated booking is acceptable initially if self-booking is not required", confidence: "medium", reversible: true },
      { assumption: "Fixed time slots with defined duration are sufficient for MVP", confidence: "medium", reversible: true },
      { assumption: "Free bookings with optional deposits are acceptable initially", confidence: "medium", reversible: true },
    ],
    suggested_closures: [
      { decision: "Booking construction will start with admin-mediated or self-booking under a request-and-confirm workflow with fixed time slots.", rationale: "A focused booking model with explicit actor control reduces risk while preserving principal authority over cancellation and payment policies.", authority: "principal" },
    ],
    seed_tasks: [
      { id: "T1", title: "Define bookable resources and attributes", authority_locus: "principal", transformation: "Document what can be booked, their capacities, and required attributes.", evidence_requirement: "Resource catalog exists with attributes.", review_predicate: "Every resource type has defined capacity and booking rules." },
      { id: "T2", title: "Define customer model and booking eligibility", authority_locus: "principal", transformation: "Document who can book, verification requirements, and eligibility rules.", evidence_requirement: "Customer model and eligibility rules exist.", review_predicate: "Every customer type has a defined booking path; no eligible customer is blocked." },
      { id: "T3", title: "Define booking workflow and states", authority_locus: "principal", transformation: "Document booking states, transitions, and who can trigger each.", evidence_requirement: "Booking workflow state diagram exists.", review_predicate: "Every state has a clear exit criteria and authorized actor." },
      { id: "T4", title: "Define availability and scheduling rules", authority_locus: "principal", transformation: "Document how availability is set, recurring patterns, blackout rules, and duration constraints.", evidence_requirement: "Availability and scheduling policy exists.", review_predicate: "Every resource has documented availability; no booking can exceed capacity." },
      { id: "T5", title: "Define cancellation and modification policy", authority_locus: "principal", transformation: "Document deadlines, fees, grace periods, and refund rules.", evidence_requirement: "Cancellation policy document exists.", review_predicate: "Every cancellation scenario has a documented outcome." },
      { id: "T6", title: "Define MVP booking boundary", authority_locus: "principal", transformation: "Explicitly list resource types and features in MVP and what is out of scope.", evidence_requirement: "MVP scope document exists with explicit inclusions and exclusions.", review_predicate: "Scope is achievable and every excluded feature is consciously deferred." },
    ],
    residuals: [
      { residual_id: "res-resources", class: "unresolved_principal_decision", description: "Bookable resources are not defined.", blocking: true },
      { residual_id: "res-eligibility", class: "unresolved_principal_decision", description: "Booking eligibility model is not decided.", blocking: true },
      { residual_id: "res-workflow", class: "unresolved_principal_decision", description: "Booking workflow and states are not established.", blocking: true },
      { residual_id: "res-availability", class: "missing_policy", description: "Availability and scheduling rules are undefined.", blocking: false },
      { residual_id: "res-cancellation", class: "missing_policy", description: "Cancellation and modification policy is undocumented.", blocking: false },
      { residual_id: "res-payments", class: "missing_policy", description: "Payment model is not decided.", blocking: false },
    ],
  };
}
