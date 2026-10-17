export type Scheme = {
  id: string;
  name: string;
  who: string;
  what: string;
  check: string;
};

export const SCHEMES: Scheme[] = [
  {
    id: "eshram",
    name: "e-Shram",
    who: "Unorganised workers, including many gig and daily-wage workers.",
    what: "Free registration on eshram.gov.in. It gives a Universal Account Number. Registration itself is not a cash payment.",
    check: "eshram.gov.in",
  },
  {
    id: "pmsym",
    name: "PM-SYM pension",
    who: "Unorganised workers aged 18 to 40 with monthly income up to ₹15,000.",
    what: "A voluntary pension. The worker contributes each month and the government matches it. The publicly stated pension is ₹3,000 a month after age 60. Confirm the current rules before joining.",
    check: "maandhan.in",
  },
  {
    id: "pmjay",
    name: "Ayushman Bharat PM-JAY",
    who: "Eligible families, not every gig worker automatically.",
    what: "Health cover of up to ₹5 lakh per family per year for listed beneficiaries.",
    check: "Ayushman Bharat app or the official beneficiary website",
  },
  {
    id: "ration",
    name: "Ration card / NFSA",
    who: "Households that already have an eligible ration card.",
    what: "Subsidised food grain. Rules differ by state.",
    check: "State food and civil supplies department",
  },
  {
    id: "bocw",
    name: "BOCW welfare board",
    who: "Construction daily-wage workers registered with the state board.",
    what: "State benefits can include accident help, education support, and maternity support. Amounts differ by state.",
    check: "State Building and Other Construction Workers welfare board",
  },
  {
    id: "state-gig",
    name: "State gig-worker welfare",
    who: "Platform delivery partners and drivers in states that have a board, cess, or registration.",
    what: "Rajasthan, Karnataka, Telangana, Jharkhand, and some other states have announced or passed rules. Benefits differ and can change.",
    check: "State labour department",
  },
  {
    id: "platform-cover",
    name: "Platform accident cover",
    who: "Delivery partners and drivers on an app that offers cover.",
    what: "Often applies only during an active order or trip. The amount is in that app's policy, not a government promise.",
    check: "The help section of the worker's own app",
  },
];

export function schemeNotes(): string {
  return SCHEMES.map(
    (scheme) =>
      `${scheme.name}: Who: ${scheme.who} What: ${scheme.what} Check: ${scheme.check}`,
  ).join("\n");
}
