import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  searchRepositories,
  type RepositorySearchResult,
} from "../services/github";

type UseSearchRepositoriesOptions = {
  query: string;
  page?: number;
  perPage?: number;
  sort?: string;
  order?: "asc" | "desc";
};

export function useSearchRepositories({
  query,
  page = 1,
  perPage = 10,
  sort = "stars",
  order = "desc",
}: UseSearchRepositoriesOptions) {
  const [debouncedQuery, setDebouncedQuery] = useState(query.trim());

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 400);

    return () => window.clearTimeout(timeoutId);
  }, [query]);

  return useQuery<RepositorySearchResult>({
    queryKey: [
      "github-repositories",
      debouncedQuery,
      page,
      perPage,
      sort,
      order,
    ],
    queryFn: ({ signal }) =>
      searchRepositories({
        query: debouncedQuery,
        page,
        per_page: perPage,
        sort,
        order,
        signal,
      }),
    enabled: Boolean(debouncedQuery),
    placeholderData: keepPreviousData,
  });
}
