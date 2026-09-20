import { useQuery, useQueries } from "@tanstack/react-query";
import { getRepositoryDetails } from "../services/github";
import type { RepositoryIdentifiers } from "../../store/trackedRepositoriesSlice";

export function useTrackedRepositories(repositories: RepositoryIdentifiers[]) {
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

export function useRepositoryDetails(
  repositoryIdentifiers: RepositoryIdentifiers,
) {
  return useQuery({
    queryKey: [
      "github-repository",
      repositoryIdentifiers.repositoryOwner,
      repositoryIdentifiers.repositoryName,
    ],
    queryFn: ({ signal }) =>
      getRepositoryDetails({
        owner: repositoryIdentifiers.repositoryOwner,
        repo: repositoryIdentifiers.repositoryName,
        signal,
      }),
  });
}
