import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type TrackedRepository = {
  repositoryOwner: string;
  repositoryName: string;
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
          repository.repositoryOwner === action.payload.repositoryOwner &&
          repository.repositoryName === action.payload.repositoryName,
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
          repository.repositoryOwner !== action.payload.repositoryOwner ||
          repository.repositoryName !== action.payload.repositoryName,
      );
    },
  },
});

export const { addTrackedRepository, removeTrackedRepository } =
  trackedRepositoriesSlice.actions;
export default trackedRepositoriesSlice.reducer;
