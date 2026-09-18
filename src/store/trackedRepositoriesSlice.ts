import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type TrackedRepository = {
  owner: string;
  repo: string;
};

type TrackedRepositoriesState = {
  repositories: TrackedRepository[];
};

const initialState: TrackedRepositoriesState = {
  repositories: [],
};

const trackedRepositoriesSlice = createSlice({
  name: "trackedRepositories",
  initialState,
  reducers: {
    addTrackedRepository: (state, action: PayloadAction<TrackedRepository>) => {
      const alreadyTracked = state.repositories.some(
        (repository) =>
          repository.owner === action.payload.owner &&
          repository.repo === action.payload.repo,
      );

      if (!alreadyTracked) {
        state.repositories.push(action.payload);
      }
    },
    removeTrackedRepository: (
      state,
      action: PayloadAction<TrackedRepository>,
    ) => {
      state.repositories = state.repositories.filter(
        (repository) =>
          repository.owner !== action.payload.owner ||
          repository.repo !== action.payload.repo,
      );
    },
  },
});

export const { addTrackedRepository, removeTrackedRepository } =
  trackedRepositoriesSlice.actions;
export default trackedRepositoriesSlice.reducer;
