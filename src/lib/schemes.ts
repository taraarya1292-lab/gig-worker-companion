export type Scheme = {
  id: string;
  name: string;
  who: string;
  what: string;
  check: string;
  url?: string;
  papers: string;
};

export const SCHEMES: Scheme[] = [
  {
    id: "eshram",
    name: "e-Shram",
    who: "Unorganised workers, including many gig and daily-wage workers.",
    what: "Free registration on eshram.gov.in. It gives a Universal Account Number. Registration itself is not a cash payment.",
    check: "eshram.gov.in",
    url: "https://eshram.gov.in",
    papers: "The official form may ask for identity proof. Do not paste those numbers here.",
  },
  {
    id: "pmsym",
    name: "PM-SYM pension",
    who: "Unorganised workers aged 18 to 40 with monthly income up to ₹15,000.",
    what: "A voluntary pension. The worker contributes each month and the government matches it. The publicly stated pension is ₹3,000 a month after age 60. Confirm the current rules before joining.",
    check: "maandhan.in",
    url: "https://maandhan.in",
    papers: "The official form asks for age and income. Confirm the current rules on the site. Do not enter those details here.",
  },
  {
    id: "pmjay",
    name: "Ayushman Bharat PM-JAY",
    who: "Eligible families, not every gig worker automatically.",
    what: "Health cover of up to ₹5 lakh per family per year for listed beneficiaries.",
    check: "Ayushman Bharat app or the official beneficiary website",
    papers: "Eligibility is a family list, not automatic. Check the official app. No verification date is stored here.",
  },
  {
    id: "ration",
    name: "Ration card / NFSA",
    who: "Households that already have an eligible ration card.",
    what: "Subsidised food grain. Rules differ by state.",
    check: "State food and civil supplies department",
    papers: "A ration card is issued by the state. This app does not store a state application link.",
  },
  {
    id: "bocw",
    name: "BOCW welfare board",
    who: "Construction daily-wage workers registered with the state board.",
    what: "State benefits can include accident help, education support, and maternity support. Amounts differ by state.",
    check: "State Building and Other Construction Workers welfare board",
    papers: "Registration is with the state board. Ask the board which papers it wants. Do not upload them here.",
  },
  {
    id: "state-gig",
    name: "State gig-worker welfare",
    who: "Platform delivery partners and drivers in states that have a board, cess, or registration.",
    what: "Rajasthan, Karnataka, Telangana, Jharkhand, and some other states have announced or passed rules. Benefits differ and can change.",
    check: "State labour department",
    papers: "Rules differ by state and can change. No verification date is stored in this app.",
  },
  {
    id: "platform-cover",
    name: "Platform accident cover",
    who: "Delivery partners and drivers on an app that offers cover.",
    what: "Often applies only during an active order or trip. The amount is in that app's policy, not a government promise.",
    check: "The help section of the worker's own app",
    papers: "Read the policy inside the work app. Cover amounts are not a government promise.",
  },
];

export function schemeNotes(): string {
  return SCHEMES.map(
    (scheme) =>
      `${scheme.name}: Who: ${scheme.who} What: ${scheme.what} Check: ${scheme.check}`,
  ).join("\n");
}
