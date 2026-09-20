import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useRepositoryDetails } from "../common/hooks/useTrackedRepositories";
import type { RepositoryIdentifiers } from "../store/trackedRepositoriesSlice";

function TrackedRepositoryRow({
  repositoryIdentifiers,
}: {
  repositoryIdentifiers: RepositoryIdentifiers;
}) {
  const {
    data: repositoryDetails,
    isPending: isRepositoryLoading,
    isError: hasRepositoryError,
    isFetching: isRepositoryRefreshing,
    refetch: reloadRepository,
  } = useRepositoryDetails(repositoryIdentifiers);

  return (
    <TableRow hover>
      <TableCell sx={{ fontWeight: 700 }}>
        <Link
          to={`/repositories/${encodeURIComponent(repositoryIdentifiers.repositoryOwner)}/${encodeURIComponent(repositoryIdentifiers.repositoryName)}`}
          className="repository-link"
        >
          {repositoryIdentifiers.repositoryName}
        </Link>
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
      <TableCell>{repositoryIdentifiers.repositoryOwner}</TableCell>
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
          aria-label={`Reload ${repositoryIdentifiers.repositoryOwner}/${repositoryIdentifiers.repositoryName}`}
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

export default TrackedRepositoryRow;
