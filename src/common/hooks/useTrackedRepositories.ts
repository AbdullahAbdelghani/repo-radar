import { useQuery, useQueries } from "@tanstack/react-query";
import { getRepositoryDetails } from "../services/github";
import type { TrackedRepository } from "../../store/trackedRepositoriesSlice";

export function useTrackedRepositories(repositories: TrackedRepository[]) {
  return useQueries({
    queries: repositories.map((repository) => ({
      queryKey: [
        "github-repository",
        repository.repositoryOwner,
        repository.repositoryName,
      ],
      queryFn: ({ signal }) =>
        getRepositoryDetails({
          owner: repository.repositoryOwner,
          repo: repository.repositoryName,
          signal,
        }),
    })),
  });
}

export function useTrackedRepository(repository: TrackedRepository) {
  return useQuery({
    queryKey: [
      "github-repository",
      repository.repositoryOwner,
      repository.repositoryName,
    ],
    queryFn: ({ signal }) =>
      getRepositoryDetails({
        owner: repository.repositoryOwner,
        repo: repository.repositoryName,
        signal,
      }),
  });
}
