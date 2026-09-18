import axios from "axios";

export type Repository = {
  name: string;
  owner: {
    login: string;
  };
  description: string | null;
  stargazers_count: number;
  pushed_at: string | null;
};

export type RepositorySearchResult = {
  total_count: number;
  items: Repository[];
};

export const searchRepositories = async ({
  query,
  page,
  per_page,
  sort,
  order,
  signal,
}: {
  query: string;
  page: number;
  per_page: number;
  sort?: string;
  order?: string;
  signal?: AbortSignal;
}) => {
  const response = await axios.get<RepositorySearchResult>(
    "https://api.github.com/search/repositories",
    {
      params: { q: query, page, per_page, sort, order },
      signal,
    },
  );
  return response.data;
};

export const getRepositoryDetails = async ({
  owner,
  repo,
}: {
  owner: string;
  repo: string;
}) => {
  const response = await axios.get(
    `https://api.github.com/repos/${owner}/${repo}`,
  );
  return response.data;
};
