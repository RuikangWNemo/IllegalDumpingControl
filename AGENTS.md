# Repository Guidelines

## Project Structure & Module Organization
The `app/` directory hosts Next.js route segments for alerts, analytics, devices, events, and rules, plus Supabase-backed API handlers under `app/api/hardware/**`. Shared feature components live in `components/`, with primitives in `components/ui/`. Use `lib/` for utilities and Supabase clients, `app/globals.css` for Tailwind tokens, `public/` for static assets, `scripts/` for SQL migrations, and `docs/` for specs such as the hardware API guide.

## Build, Test, and Development Commands
`pnpm install` sets up dependencies. `pnpm dev` serves the app on <http://localhost:3000>. Run `pnpm lint` (or `pnpm lint --fix`) before every push to enforce the Next/Tailwind rules. `pnpm build` verifies the production bundle, and `pnpm start` smoke-tests the compiled output.

## Coding Style & Naming Conventions
Write TypeScript modules with functional React components and the `@/*` alias configured in `tsconfig.json`. Match the existing two-space indentation. Keep file names in kebab-case, export PascalCase components, and prefer composing from `components/ui/` before crafting bespoke UI. Styling should rely on Tailwind utilities and the design tokens declared in `app/globals.css`.

## Testing Guidelines
Automated tests are not yet in place, so linting and a successful build are the current gates. When you add logic, include a plan for regression coverage—component or API specs can live alongside the feature as `*.spec.ts(x)` or in a future `tests/` folder. Discuss new tooling (Vitest, Testing Library, Playwright, etc.) before adding dependencies and document any new scripts.

## Commit & Pull Request Guidelines
Follow the conventional commit style already used (`feat:`, `fix:`, `refactor:`) with messages scoped to one change. Pull requests should explain the problem and solution, link issues or V0 chats, and attach UI screenshots when behaviour changes. Confirm `pnpm lint` and `pnpm build` locally, surface Supabase schema updates from `scripts/*.sql`, and note manual verification steps.

## Supabase & Configuration Tips
Provide `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local` so both browser and server clients in `lib/supabase` connect correctly. Apply the SQL files in `scripts/` through the Supabase SQL editor or CLI, keep credentials private, and reuse the existing helper functions when expanding `app/api/hardware/**`. Update `docs/` whenever you adjust external contracts.
