# Repo Radar

Repo Radar is a React application for searching GitHub repositories, tracking selected repositories, viewing repository details, and comparing tracked repositories by stars.

Live release: [repo-radar-sable.vercel.app](https://repo-radar-sable.vercel.app/)

## Setup

Requirements:

- Node.js 20 or newer
- npm

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open the local URL shown by Vite, usually `http://localhost:5173`.

Useful commands:

```bash
npm run build    # Type-check and create the production bundle
npm run lint     # Run Oxlint
npm run preview  # Preview the production bundle locally
```

## Architecture

- `src/screens/` contains the Home, tracked repositories, and repository details views.
- `src/navigation/` defines React Router routes and the primary navigation.
- `src/common/services/github.ts` contains the Axios calls to GitHub's REST API.
- `src/common/hooks/` wraps GitHub requests with TanStack Query for caching, loading states, and refetching.
- `src/store/` contains the Redux Toolkit store and tracked repository state.
- Material UI provides the interface components, while Recharts provides the tracked-star comparison chart.
- `vercel.json` rewrites all requests to `index.html`, allowing direct access and refreshes on client-side routes such as `/repositories/:owner/:repo`.

## Technical Decisions

- React Router handles client-side navigation without separate backend route handlers.
- TanStack Query keeps repository data fresh and shares cached detail requests between screens.

## Assumptions and Limitations

- GitHub API requests are unauthenticated. The application is subject to GitHub's public API rate limits.
- Search results depend on GitHub availability and API response limits.
- Repository details use GitHub's `pushed_at` value as the displayed last commit date.
