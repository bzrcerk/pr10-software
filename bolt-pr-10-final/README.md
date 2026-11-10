# Smart Campus Room Availability Checker

A React and TypeScript prototype that checks whether a study room is available
for a requested interval. Times are entered as integer minutes after midnight.
Checking availability does not create or modify bookings.

## Prototype limitations

All data is fictional and static: Study Room A101, current time fixed at 540
minutes (09:00), an unblocked room, and one existing booking from 600 to 660
minutes. The displayed current time is not a live clock. There is no connection
to a real campus booking system, and results are not reservations.

## Setup

Install Node.js and npm compatible with the dependencies in `package-lock.json`.
The project does not currently pin a verified Node.js/npm version.
From the project root, run:

```sh
npm ci
npm run dev
```

`npm ci` installs the locked dependencies and may access the network and run
dependency installation scripts. Agents must obtain approval as required by
`AGENTS.md` before installation or network access. Open the local URL printed
by Vite after starting the development server.

## Verification commands

```sh
npm test
npm run lint
npm run typecheck
npm run build
```

These run Vitest, ESLint, application TypeScript checking, and a Vite production
build respectively. The build writes to `dist/`; test tools may write caches.
The typecheck script covers `src`, not the Vite/Vitest configuration files.
The build does not replace typechecking.

During the initial audit, all four commands were blocked by missing
`node_modules` (exit 127: executables not found). This was not a test failure
and does not establish that any check passes.

## Acceptance criteria

| Criterion | Implemented rule |
| --- | --- |
| AC1 | Require integer times with `0 <= start < end <= 1440` and `start > now`; reject missing, invalid, fractional, and Boolean inputs. |
| AC2 | Duration must not exceed 120 minutes; exactly 120 is allowed. |
| AC3 | A blocked room is unavailable. |
| AC4 | Overlapping bookings make the interval unavailable; touching endpoints are allowed. |
| AC5 | Checking availability never creates, modifies, or deletes bookings. |
| AC6 | Pending authoritative verification: no definition was found in the repository. Do not infer compliance. |

The rules are implemented in `src/lib/availability.ts`, with library tests in
`src/lib/__tests__/availability.test.ts`. The current Vitest environment is
Node; no DOM testing environment or React interaction testing harness is
configured. These tests do not establish browser interaction coverage.

## Manual stale-result regression check (not yet executed)

1. Submit start `660` and end `720`; expect Available.
2. Change start to `630` without submitting; expect the previous result to
   disappear and the initial instruction to appear. End must remain `720`.
3. Submit again; expect Unavailable because the interval overlaps the booking.
4. Change end to `690` without submitting; expect the previous result to
   disappear. Start must remain `630`.
5. Submit again, then select Clear; expect both inputs empty and the initial
   instruction restored.

## Project structure

- `src/App.tsx`: form state and application interface.
- `src/components/`: room, booking, and result displays.
- `src/lib/`: availability rules and time formatting.
- `src/lib/__tests__/`: existing library tests.
- `AGENTS.md`: contribution constraints, verification, and review requirements.
