# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Purpose

Convert Figma designs into React + TypeScript components using Tailwind CSS v4.
Figma file: `weather-app` (fileKey `50FODCFOVjYv6Rhh0prm9F`).

## Commands

- `npm run dev` — start the Vite dev server
- `npm run build` — type-check (`tsc -b`) then production build via Vite
- `npm run lint` — run ESLint over the repo
- `npm run preview` — preview the production build

There is no test suite/runner configured in this project.

React Compiler (`babel-plugin-react-compiler`, wired up in `vite.config.ts` via `@rolldown/plugin-babel`) runs on every build/dev session — don't manually add `useMemo`/`useCallback`/`memo` purely for render-perf reasons, the compiler handles it. `useMemo` is still fine (and expected) when it's deriving/transforming a value from state for a specific use case (e.g. filtering/mapping a prop into the shape a component needs) — that's a data-derivation concern, not a perf optimization.

## Workflow Rules

- I will provide one Figma frame/screen/component at a time via a screenshot or Figma URL
- Work on ONE screen/section/component at a time — do not build ahead or assume what's next
- After each one, stop and wait for my confirmation before moving to the next
- Use the Figma MCP (`get_design_context`, `get_screenshot`, `get_metadata`) to pull exact specs (spacing, colors, typography, radii); if it hits a rate limit or isn't accessible, ask me for the values or a closer screenshot instead of guessing
- For icons: check `src/assets/images/icon-*.svg` first and copy the exact path data into a new component in `Icons.tsx` (swapping the hardcoded fill for `currentColor`). Only hand-draw an icon from scratch if no matching asset exists — see the existing SearchIcon/DropdownIcon/CheckIcon/UnitsIcon, which were all converted this way.
- This Figma file typically only has a desktop frame for a given screen. Mobile/tablet behavior must be inferred by following the responsive patterns already established in sibling components (see Tailwind v4 Rules below) rather than waiting for separate mobile/tablet frames.
- Don't wire a newly-built component into `WeatherApp.tsx` unless asked — new sections/skeletons are built standalone until I say to integrate them.

## Architecture

- `src/main.tsx` mounts `App`, which renders `src/pages/WeatherApp.tsx` — the only page.
- `App.tsx` owns all real app state and exposes it through two contexts:
  - `UnitsContext` (via `useUnitsContext()`): `units: UnitSettings`, `switchSystem`, `setUnits`. `units` holds `system` ("Metric"/"Imperial"), `temperature`, `windSpeed`, `precipitation`; `switchSystem` flips all four fields at once between the two presets, `setUnits` allows fine-tuning one field independently (e.g. Celsius under an otherwise-Imperial system).
  - `WeatherDataContext` (via `useWeatherDataContext()`): `weatherData: WeatherData | undefined`, `isError`, `isLoading`, `getCoordinates`, `resetError`.
  - Two effects drive fetching: a geolocation effect requests `navigator.geolocation.getCurrentPosition` on mount and re-requests it whenever `isError` flips back to `false` (its dependency array is `[isError]`, guarded by `if (isError === true) return;` to avoid immediately re-firing itself after a failure); a `handleFetch` effect (deps `[coordinates, units]`) calls `fetchData` once coordinates are known and populates `weatherData`, or sets `isError` on failure. `getCoordinates` (called by `Search`'s city selection) and the geolocation success callback both set `coordinates` directly — either path re-triggers `handleFetch`. `resetError` (called by the Retry button) only resets `isError`, which re-triggers the geolocation effect, not `handleFetch` directly. Known limitation: `isError` is one shared boolean for both "geolocation failed" and "weather fetch failed" — Retry always re-attempts geolocation, and a geolocation failure fully unmounts `Search` (via the branch below), so there is currently no way to reach the search UI while a geolocation error is showing.
- `WeatherApp.tsx` always renders `Header`, then branches on `isError` (from `useWeatherDataContext()`): `ApiErrorMessage` (defined and exported directly in `WeatherApp.tsx`, not its own file under `sections/`) vs. `WeatherContent`. `WeatherContent` renders the page title, `Search`, then either the "No search result found!" message (driven by local `notFound` state, set via the `setIsNotFound` prop passed to `Search`) or a two-column layout — a `<section>` with `WeatherInfo` + `DailyForecast` alongside a sibling `HourlyForecast`, all populated from `weatherData`. `isLoading || weatherData === undefined` swaps that same layout for the skeleton counterparts (`WeatherInfoSkeleton`, `DailyForecastSkeleton`, `HourlyForecastSkeleton`) instead.
- `src/components/sections/` — one file per screen section (`Header.tsx`, `Search.tsx`, `WeatherInfo.tsx`, `DailyForecast.tsx`, `HourlyForecast.tsx`). Each default-exports the section component, driven by props derived from `weatherData` (no more hardcoded local arrays); smaller pieces only that section uses (e.g. a dropdown, a loading-dots indicator) are defined as non-exported helper functions in the same file rather than split out.
  - `Search.tsx`: on submit it hits the Open-Meteo geocoding API (`geocoding-api.open-meteo.com/v1/search`) and renders results in `SearchDropdown`, or `LoadingSearch` while in flight; a missing or empty `results` array calls `setIsNotFound(true)`. Picking a city in `SearchDropdown` calls `getCoordinates` from `WeatherDataContext`, which is what actually drives a new weather fetch.
  - `HourlyForecast.tsx`: tracks a `currentDay` selection (`useState`, seeded from the first day in the `hourly` prop) and derives `weekDays`/`currentData` from the `hourly` prop with `useMemo` (state-derivation, not perf — see the React Compiler note below). `DaysDropdown` follows the same `{isOpen && <Comp/>}` call-site pattern as `Header.tsx`'s `UnitsDropdown` (the dropdown component itself has no visibility logic).
- `src/components/skeletons/` — loading/skeleton counterparts of section components, matching the real component's responsive layout so swapping them in causes no layout shift. Wired into `WeatherApp.tsx` behind the `isLoading || weatherData === undefined` check above.
- `src/hooks/useToggleDropdown.ts` — manages a dropdown's open/closed state plus outside-click/Escape-to-close behavior (a native `click`/`keydown` listener on `document.body` while open), returning `{ toggle, isOpen, dropdownRef, onClose }`. The consumer must attach `dropdownRef` to the element wrapping *both* the trigger button and the dropdown panel (not just the panel) — that's what lets the outside-click check treat a click on the trigger itself as "inside" without needing `e.stopPropagation()` on the trigger's `onClick`. Skipping that and using `stopPropagation()` instead is a known trap here: React delegates events at the root container (below `document.body`), so `stopPropagation()` blocks the click from ever reaching `body` — breaking every other open dropdown's listener on the page, not just the one clicked. Used by `Header.tsx` (Units dropdown) and `HourlyForecast.tsx` (Days dropdown); `onClose` is used where a selection should explicitly close the dropdown rather than just toggle it.
- `src/utils/types.ts` — shared TypeScript types not owned by a single component: `Coordinates`, `SearchedCities` (shape of an Open-Meteo geocoding result), `UnitSettings`, `WeatherData` (the `{ city, country, current, daily, hourly }` shape returned by `fetchData`), `WeatherIconName`.
- `src/utils/fetchData.ts` — `fetchData({ latitude, longitude, ...units })` fires the Open-Meteo forecast API and the BigDataCloud reverse-geocode API in parallel via `axios`, then shapes the combined response into `WeatherData` via internal `getLocation`/`getCurrent`/`getDaily`/`getHourly` helpers. `getDaily` formats each day's weekday with `timeZone: "UTC"` because Open-Meteo's `daily.time` values are date-only strings (which JS parses as UTC) — do not remove that option or add it to `getHourly`, whose `hourly.time` values are full datetime strings (parsed as local time), so the two intentionally use different parsing frames that both correctly echo the API's stated date. The `openmeteo` npm package (in `package.json`) is unused — API calls go through plain `axios` REST requests, not that SDK.
- `src/utils/getWeatherIconName.ts` — maps an Open-Meteo WMO `weather_code` to a `WeatherIconName`, used by `WeatherInfo`/`DailyForecast`/`HourlyForecast` to build each icon's `<img>` `src` (`` `images/icon-${name}.webp` ``, served from `public/images/` — a relative, unbundled path, not a `src/assets` import).
- `src/utils/toFixed.ts` — rounds a number to a whole-number string for display (e.g. temperatures, humidity).
- `src/components/Icons.tsx` — the single, central export point for all *inline SVG* icons (search/dropdown/check/spinner/ban/retry/units), each typed with `SVGProps<SVGSVGElement>`, colored via `currentColor` and sized/colored by the caller through `className`. Weather-condition icons are a separate system (raster `.webp` files served from `public/images/`, not part of `Icons.tsx`).

### Known limitations (don't rediscover these — fix only if asked)

- `isError` conflates geolocation and fetch failures (see above) — Retry always re-runs geolocation, and Search is unreachable during any error state.
- No request cancellation on `handleFetch` — rapid unit toggles or successive city searches can let a stale response overwrite a newer one.
- No persisted location — every page load re-requests geolocation instead of remembering the last-known coordinates.
- Every unit change refetches the BigDataCloud reverse-geocode lookup even when the location hasn't changed.
- The weather-icon `src`/`alt` construction (`getWeatherIconName` + template string) is duplicated identically in `WeatherInfo.tsx`, `DailyForecast.tsx`, and `HourlyForecast.tsx` instead of one shared helper.

## File Structure

- `src/pages/WeatherApp.tsx` — the page, composes sections
- `src/components/sections/*.tsx` — one component per Figma screen section
- `src/components/skeletons/*.tsx` — loading-state counterparts of sections
- `src/hooks/*.ts` — shared custom hooks (e.g. `useToggleDropdown`)
- `src/utils/*.ts` — shared types/helpers not owned by one component (`types.ts`, `fetchData.ts`, `getWeatherIconName.ts`, `toFixed.ts`)
- `src/components/Icons.tsx` — central icon component index
- `src/styles.css` — Tailwind v4 entry point (`@theme`, `@utility`, `@font-face` declarations)
- `src/assets/fonts` — font files (woff2/woff/ttf) exported per Figma spec
- `src/assets/images` — images/icons exported from Figma (source-of-truth SVGs for `Icons.tsx`, plus `bg-today-*.svg`, `logo.svg`)
- `public/images/` — weather-condition icon `.webp` files, referenced at runtime via relative `<img>` `src` paths (built by `getWeatherIconName`), not through the `src/assets` bundler-import pipeline
- `index.html` — favicon `<link>` currently points at `images/icon-partly-cloudy.webp` (keep its `type` attribute in sync with the actual file type if this changes again)

## Fonts

- Import fonts locally from `/assets/fonts` — no Google Fonts CDN links unless I say otherwise
- Declared with `@font-face` in `styles.css` (above `@theme`)
- Variable fonts: separate `@font-face` blocks per font-style (normal/italic), with font-weight as a range (e.g. `100 900`) rather than one block per weight
- Static fonts: one `@font-face` block per weight/style actually used
- Registered in `@theme` as a `--font-*` token (`--font-display`, `--font-sans`) so usable as a Tailwind utility (`font-display`, `font-sans`)
- `font-display: swap` unless I specify otherwise

## Tailwind v4 Rules

- Design tokens live in `@theme` in `styles.css` (colors, spacing, radius, breakpoints) — extend this when a new screen introduces a new token, don't invent one-off values when an existing token is close enough
- Custom breakpoints: `tablet` (48rem) and `desktop` (90rem) — mobile-first, so base classes target mobile, then layer `tablet:`/`desktop:` overrides
- Spacing/radius scale is named (`spacing-100`, `radius-12`, etc.) via `@theme`, but the Tailwind default numeric scale (`size-5`, `gap-3`, `w-14`, fractional values like `h-71.5`) is still available and used throughout — prefer the named token when the exact value matches one, otherwise fall back to the default numeric scale or an arbitrary `[value]` rather than distorting to the nearest named token
- Typography presets are named `text-preset-N`, matching Figma's type scale
- Custom utilities go in `@utility` (not `@layer components`)

## Component/Markup Rules

- Semantic HTML inside JSX: `<header>`, `<main>`, `<section>`, `<aside>`, `<nav>`, `<footer>`
- Icons as inline SVG React components (no vite-plugin-svgr), typed with `SVGProps<SVGSVGElement>`, exported from `Icons.tsx`
- Alt text on all images (decorative images use `alt=""` with `aria-hidden="true"`)
- No inline styles — Tailwind classes only (this includes animation timing: use arbitrary-value utility classes like `[animation-delay:-0.3s]`, not the `style` attribute)

## Figma → Code Process

1. I provide screenshot/URL for one screen or component
2. Pull specs via Figma MCP (or ask me if unavailable)
3. Confirm/update `@theme` tokens (colors, spacing, fonts) if this screen introduces new ones
4. Write JSX + Tailwind classes for that section only, in its own file under `src/components/sections/` (or `skeletons/` for loading states)
5. Check against the screenshot for spacing/alignment/type accuracy
6. Flag any assumptions or values you couldn't verify

## What NOT to do

- Don't add state/logic beyond what's needed to render the static markup, unless asked
- Don't move to the next screen/component without my go-ahead
- Don't invent spacing/color/font values — flag if something's unclear from the screenshot
- Don't pull fonts from a CDN unless told to
- Don't hand-draw an icon's path data if a matching SVG already exists in `src/assets/images/`
- Don't wire a newly-built component into `WeatherApp.tsx` unless asked
