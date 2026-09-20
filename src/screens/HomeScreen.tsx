import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useSearchRepositories } from "../common/hooks/useSearchRepositories";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  addTrackedRepository,
  removeTrackedRepository,
} from "../store/trackedRepositoriesSlice";

function HomeScreen() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const dispatch = useAppDispatch();
  const trackedRepositories = useAppSelector(
    (state) => state.trackedRepositories.repositories,
  );
  const {
    data: searchResults,
    error,
    isError,
    isFetching,
    isLoading,
  } = useSearchRepositories({
    query: search,
    page,
    perPage: rowsPerPage,
  });

  useEffect(() => {
    setPage(1);
  }, [search]);

  const hasSearch = search.trim().length > 0;

  const toggleTracked = (repositoryOwner: string, repositoryName: string) => {
    const isTracked = trackedRepositories.some(
      (repository) =>
        repository.repositoryOwner === repositoryOwner &&
        repository.repositoryName === repositoryName,
    );

    dispatch(
      isTracked
        ? removeTrackedRepository({ repositoryOwner, repositoryName })
        : addTrackedRepository({ repositoryOwner, repositoryName }),
    );
  };

  return (
    <main className="screen home-screen">
      <Grid container spacing={3} sx={{ width: "100%", maxWidth: 1280 }}>
        <Grid size={{ xs: 12 }}>
          <p className="eyebrow">Repo Radar</p>
          <Typography
            component="h1"
            sx={{ fontSize: { xs: "2.6rem", md: "4rem" } }}
          >
            Explore repositories.
          </Typography>
          <Typography className="description">
            Search GitHub repositories by name, topic, language, or owner.
          </Typography>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Search GitHub repositories"
            placeholder="Try: react, machine learning, microsoft"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            slotProps={{
              input: {
                endAdornment: isFetching ? (
                  <CircularProgress size={20} />
                ) : undefined,
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          {!hasSearch ? (
            <Typography
              color="text.secondary"
              sx={{ py: 4, textAlign: "center" }}
            >
              Enter a search to discover repositories.
            </Typography>
          ) : isLoading ? (
            <Paper elevation={0} variant="outlined">
              <Box sx={{ py: 8, textAlign: "center" }}>
                <CircularProgress size={28} />
              </Box>
            </Paper>
          ) : isError ? (
            <Alert severity="error">
              {error instanceof Error
                ? error.message
                : "Unable to load repositories. Please try again."}
            </Alert>
          ) : !searchResults ? (
            <Typography
              color="text.secondary"
              sx={{ py: 4, textAlign: "center" }}
            >
              No repository data is available.
            </Typography>
          ) : searchResults.items.length === 0 ? (
            <Typography
              color="text.secondary"
              sx={{ py: 4, textAlign: "center" }}
            >
              No repositories found.
            </Typography>
          ) : (
            <Paper elevation={0} variant="outlined">
              <TableContainer>
                <Table aria-label="GitHub repository search results">
                  <TableHead>
                    <TableRow>
                      <TableCell>Repository</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Owner</TableCell>
                      <TableCell>Stars</TableCell>
                      <TableCell>Last push</TableCell>
                      <TableCell>Tracking</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {searchResults.items.map((repository) => {
                      const isTracked = trackedRepositories.some(
                        (trackedRepository) =>
                          trackedRepository.repositoryOwner ===
                            repository.owner.login &&
                          trackedRepository.repositoryName === repository.name,
                      );

                      return (
                        <TableRow
                          key={`${repository.owner.login}/${repository.name}`}
                          hover
                        >
                          <TableCell sx={{ fontWeight: 700 }}>
                            <Link
                              to={`/repositories/${encodeURIComponent(repository.owner.login)}/${encodeURIComponent(repository.name)}`}
                              className="repository-link"
                            >
                              {repository.name}
                            </Link>
                          </TableCell>
                          <TableCell sx={{ maxWidth: 420 }}>
                            {repository.description || "No description"}
                          </TableCell>
                          <TableCell>{repository.owner.login}</TableCell>
                          <TableCell>
                            {repository.stargazers_count.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {repository.pushed_at
                              ? new Date(
                                  repository.pushed_at,
                                ).toLocaleDateString()
                              : "-"}
                          </TableCell>
                          <TableCell>
                            <Box
                              component="button"
                              type="button"
                              aria-pressed={isTracked}
                              onClick={() =>
                                toggleTracked(
                                  repository.owner.login,
                                  repository.name,
                                )
                              }
                              sx={{
                                border: 0,
                                borderRadius: 1,
                                padding: "6px 10px",
                                color: isTracked ? "#147d92" : "#53636d",
                                backgroundColor: "transparent",
                                cursor: "pointer",
                                font: "inherit",
                                fontWeight: 700,
                                whiteSpace: "nowrap",
                                "&:hover": {
                                  backgroundColor: "rgba(20, 125, 146, 0.08)",
                                },
                              }}
                            >
                              {isTracked ? "★ Tracked" : "☆ Untracked"}
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={Math.min(searchResults.total_count, 1000)}
                page={page - 1}
                onPageChange={(_, nextPage) => setPage(nextPage + 1)}
                onRowsPerPageChange={(event) => {
                  setRowsPerPage(Number(event.target.value));
                  setPage(1);
                }}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[10, 20, 50]}
              />
            </Paper>
          )}
        </Grid>
      </Grid>
    </main>
  );
}

export default HomeScreen;
