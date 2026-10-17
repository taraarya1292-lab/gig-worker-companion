# Gig Worker Companion

Assistant for delivery partners, drivers, and daily-wage workers.

Gemini runs on the server. Earnings stay in the browser. There is no login.

## Run

1. Add `GEMINI_API_KEY` to `.env.local`.
2. `npm run dev`
3. Open http://localhost:3000

## Walkthrough

1. Choose role, state, and language.
2. Add an earning, then ask Gemini for the week summary.
3. Complete the safety check.
4. Ask which schemes to check.
5. Paste a notice and ask for plain language.
6. Draft a complaint. It uses the logged earnings and the last document note.
