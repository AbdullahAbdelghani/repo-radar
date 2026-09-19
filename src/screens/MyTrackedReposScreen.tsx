import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  useTrackedRepositories,
  useTrackedRepository,
} from "../common/hooks/useTrackedRepositories";
import { useAppSelector } from "../store/hooks";

function TrackedRepositoryRow({
  repository,
}: {
  repository: { repositoryOwner: string; repositoryName: string };
}) {
  const {
    data: repositoryDetails,
    isPending: isRepositoryLoading,
    isError: hasRepositoryError,
    isFetching: isRepositoryRefreshing,
    refetch: reloadRepository,
  } = useTrackedRepository(repository);

  return (
    <TableRow
      key={`${repository.repositoryOwner}/${repository.repositoryName}`}
      hover
    >
      <TableCell sx={{ fontWeight: 700 }}>
        {repository.repositoryName}
      </TableCell>
      <TableCell sx={{ maxWidth: 420 }}>
        {isRepositoryLoading ? (
          <Box className="repo-cell-status">
            <CircularProgress size={18} />
            <Typography variant="body2" color="text.secondary">
              Loading repository...
            </Typography>
          </Box>
        ) : hasRepositoryError ? (
          <Box className="repo-cell-status">
            <Typography color="error" variant="body2">
              Unable to load repository
            </Typography>
            <Button
              size="small"
              onClick={() => reloadRepository()}
              disabled={isRepositoryRefreshing}
            >
              Try again
            </Button>
          </Box>
        ) : (
          repositoryDetails?.description || "No description"
        )}
      </TableCell>
      <TableCell>{repository.repositoryOwner}</TableCell>
      <TableCell>
        {repositoryDetails?.stargazers_count.toLocaleString() || "-"}
      </TableCell>
      <TableCell>
        {repositoryDetails?.pushed_at
          ? new Date(repositoryDetails.pushed_at).toLocaleDateString()
          : "-"}
      </TableCell>
      <TableCell align="right">
        <IconButton
          aria-label={`Reload ${repository.repositoryOwner}/${repository.repositoryName}`}
          title="Reload repository"
          onClick={() => reloadRepository()}
          disabled={isRepositoryRefreshing}
          size="small"
        >
          {isRepositoryRefreshing ? <CircularProgress size={18} /> : "↻"}
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

function MyTrackedReposScreen() {
  const [activeTab, setActiveTab] = useState(0);
  const trackedRepositories = useAppSelector(
    (state) => state.trackedRepositories.repositories,
  );
  const repositoryQueries = useTrackedRepositories(trackedRepositories);
  const isRefreshingAll = repositoryQueries.some((query) => query.isFetching);

  const chartData = repositoryQueries.flatMap((query, index) => {
    if (!query.data) {
      return [];
    }

    return [
      {
        name: `${trackedRepositories[index].repositoryOwner}/${trackedRepositories[index].repositoryName}`,
        stars: query.data.stargazers_count,
      },
    ];
  });

  const refreshAll = async () => {
    await Promise.all(repositoryQueries.map((query) => query.refetch()));
  };

  return (
    <main className="screen tracked-screen">
      <Box className="tracked-heading">
        <Box>
          <p className="eyebrow">My Tracked Repos</p>
          <Typography
            component="h1"
            sx={{ fontSize: { xs: "2.6rem", md: "4rem" } }}
          >
            Keep an eye on your repos.
          </Typography>
          <Typography className="description">
            Refresh live GitHub data or compare your tracked repositories by
            stars.
          </Typography>
        </Box>
        {trackedRepositories.length > 0 && (
          <Button
            variant="contained"
            onClick={refreshAll}
            disabled={isRefreshingAll}
            startIcon={
              isRefreshingAll ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                "↻"
              )
            }
          >
            Refresh all
          </Button>
        )}
      </Box>

      <Tabs
        value={activeTab}
        onChange={(_, nextTab) => setActiveTab(nextTab)}
        aria-label="Tracked repository views"
      >
        <Tab label="Repository list" />
        <Tab label="Stars chart" />
      </Tabs>

      {trackedRepositories.length === 0 ? (
        <Paper className="tracked-empty" elevation={0} variant="outlined">
          <Typography variant="h6">No repositories tracked yet.</Typography>
          <Typography color="text.secondary">
            Search for a repository on Home and choose “☆ Untracked” to add it
            here.
          </Typography>
        </Paper>
      ) : activeTab === 0 ? (
        <Paper elevation={0} variant="outlined">
          <TableContainer>
            <Table aria-label="Tracked GitHub repositories">
              <TableHead>
                <TableRow>
                  <TableCell>Repository</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Owner</TableCell>
                  <TableCell>Stars</TableCell>
                  <TableCell>Last push</TableCell>
                  <TableCell align="right">Reload</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {trackedRepositories.map((repository) => (
                  <TrackedRepositoryRow
                    key={`${repository.repositoryOwner}/${repository.repositoryName}`}
                    repository={repository}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ) : chartData.length === 0 ? (
        <Paper className="tracked-empty" elevation={0} variant="outlined">
          <CircularProgress size={28} />
          <Typography color="text.secondary">Loading chart data...</Typography>
        </Paper>
      ) : (
        <Paper className="chart-panel" elevation={0} variant="outlined">
          <Typography variant="h6">
            Stars across tracked repositories
          </Typography>
          <Box sx={{ width: "100%", height: { xs: 360, md: 460 }, mt: 2 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 12, right: 16, left: 8, bottom: 72 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#d9e4e8" />
                <XAxis
                  dataKey="name"
                  angle={-35}
                  textAnchor="end"
                  height={90}
                  interval={0}
                />
                <YAxis allowDecimals={false} />
                <Tooltip
                  formatter={(value) => Number(value).toLocaleString()}
                />
                <Bar dataKey="stars" fill="#147d92" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      )}
    </main>
  );
}

export default MyTrackedReposScreen;
