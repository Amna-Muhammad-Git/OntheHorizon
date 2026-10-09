# Frontend

React + Vite + Tailwind single-page app for the On the Horizon prototype. Keep app state and persistence in the browser for the first demo; store only goals, deposits, and plan settings. Derive progress, price projections, blur, and grayscale at render time.

## Run locally

```sh
npm install
npm run dev
```

The starter app is served at the local URL printed by Vite (normally `http://localhost:5173`).

Planned source areas:

- `src/components/` — shared UI components and sheets.
- `src/pages/` — dashboard and goal detail views.
- `src/features/goals/` — goal creation, deposits, and goal-specific UI.
- `src/utils/` — projection math, image compression, and localStorage helpers.
- `src/styles/` — theme and global styles.
