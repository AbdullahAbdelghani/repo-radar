import { configureStore } from "@reduxjs/toolkit";
import trackedRepositoriesReducer from "./trackedRepositoriesSlice";
import type { TrackedRepository } from "./trackedRepositoriesSlice";

const trackedRepositoriesStorageKey = "repo-radar-tracked-repositories";

const loadTrackedRepositories = (): TrackedRepository[] => {
  try {
    const storedRepositories = localStorage.getItem(
      trackedRepositoriesStorageKey,
    );

    if (!storedRepositories) {
      return [];
    }

    const parsedRepositories: unknown = JSON.parse(storedRepositories);

    if (!Array.isArray(parsedRepositories)) {
      return [];
    }

    return parsedRepositories.filter(
      (repository): repository is TrackedRepository =>
        typeof repository === "object" &&
        repository !== null &&
        typeof (repository as TrackedRepository).owner === "string" &&
        typeof (repository as TrackedRepository).repo === "string",
    );
  } catch {
    return [];
  }
};

export const store = configureStore({
  reducer: {
    trackedRepositories: trackedRepositoriesReducer,
  },
  preloadedState: {
    trackedRepositories: {
      repositories: loadTrackedRepositories(),
    },
  },
});

store.subscribe(() => {
  try {
    localStorage.setItem(
      trackedRepositoriesStorageKey,
      JSON.stringify(store.getState().trackedRepositories.repositories),
    );
  } catch {
    // Storage can be unavailable or full; Redux remains the source of truth.
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
