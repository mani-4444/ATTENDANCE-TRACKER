# ATTENDANCE-TRACKER

TrackMate is a web app for student attendance tracking built with React, TypeScript, Zustand, and Supabase.

It supports login/signup, subject management, date-wise attendance marking, dashboard analytics, attendance prediction, timetable display, holiday management, and user semester settings.

## Project Overview

The app is a Vite frontend that connects directly to Supabase for authentication and database operations.

Core flow:

1. User signs in with Supabase Auth.
2. App restores session on startup.
3. Zustand store fetches user data from Supabase tables.
4. Screens render derived metrics from store state.
5. Attendance and settings changes are persisted to Supabase.

## Main Features

- Auth flow (login/signup/session restore)
- Dashboard with overall and per-subject attendance stats
- Track page with date-wise attendance summaries
- Date detail page to mark Present/Absent per session
- Subject attendance detail view
- Subject + weekly day mapping management
- Weekly timetable view
- Holiday management
- Attendance predictor view
- Student profile + semester range + required percentage settings

## Tech Stack

- React 18
- TypeScript
- Vite
- Zustand
- React Router
- Tailwind CSS
- Supabase (Auth + Postgres)

## Repository Structure

- `frontend/` - Main web app
- `frontend/src/screens/` - Route-level screens
- `frontend/src/components/` - Shared layout and components
- `frontend/src/store.ts` - Central Zustand data/actions store
- `frontend/src/lib/supabase.ts` - Supabase client setup

## Environment Variables

Create `frontend/.env` with:

```dotenv
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Local Development

From repository root:

```bash
npm --prefix frontend install
npm --prefix frontend run dev -- --host
```

Frontend default dev URL:

```text
http://localhost:5173
```

## Production Build

```bash
npm --prefix frontend run build
npm --prefix frontend run preview
```

Build output is generated in:

```text
frontend/dist
```

## Deployment Notes

- This project is a static frontend build that can be deployed on Vercel, Netlify, Cloudflare Pages, or any static hosting provider.
- Make sure both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are configured in your deployment environment variables.
- Configure your hosting provider to serve the Vite SPA with route fallback to `index.html`.

## Data Model Used by the App

The frontend reads/writes these Supabase tables:

- `profiles`
- `subjects`
- `sessions`
- `attendance`
- `timetable`
- `semester`
- `holidays`

## Current Branch Workflow

- Main app logic lives in the `frontend` folder.
- Store-driven data flow is centralized in Zustand.
- Supabase is the source of truth for auth and persistence.
