# On the Horizon: one-night build plan

Keep the first version small and demoable. This prototype has no server: the browser stores goals and deposits in `localStorage`. The `backend/` folder marks the future API boundary so server work can be added later without pretending it is needed for tonight's demo.

## Eight build chunks

1. **Project setup (30 min)** — Set up the React + Vite app in `frontend/`, add Tailwind, and confirm the app runs.
2. **Visual foundation (30 min)** — Add DM Sans, black background, violet/lilac palette, star mark, reusable buttons, cards, and mobile-first layout based on `inspo UI/`.
3. **Goal data and projection math (45 min)** — Define the goal/deposit shape and pure functions for elapsed days, price drift, progress, image filters, and plan estimates.
4. **Dashboard gallery (45 min)** — Show empty state and goal cards with blurred/grayscale photos, progress chips, current price, and Add money action.
5. **Create goal flow (45 min)** — Build the create-goal sheet with name, current price, photo upload/compression, yearly increase, and one of the planning modes.
6. **Goal details and plans (60 min)** — Add detail view, plan result in plain language, and photo previews for today, six months, and one year.
7. **Deposits, withdrawals, persistence (60 min)** — Add amount/date flows and deposit history; derive saved balance; persist and restore goals with a debounced localStorage write.
8. **Polish and demo pass (45 min)** — Check mobile and desktop layouts, empty/edge states, readability, and the main create → add money → sharpen photo journey. Fix only issues that block the demo.

Suggested order: finish each chunk before moving on, and keep a working demo after chunks 4 and 7. If time gets tight, defer future backend work and optional visual polish; preserve goal creation, adding money, progress imagery, and local persistence.

## Folder map

- `frontend/` — tonight's React app and browser-only prototype.
- `backend/` — reserved for a later API and database; no service is required for this prototype.
- `inspo UI/` — visual reference screenshots.
