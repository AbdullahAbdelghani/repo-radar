import { Alert, Box, CircularProgress, Paper, Typography } from "@mui/material";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useRepositoryDetails } from "../common/hooks/useTrackedRepositories";

function RepositoryDetailsScreen() {
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const repository = {
    repositoryOwner: owner ? decodeURIComponent(owner) : "",
    repositoryName: repo ? decodeURIComponent(repo) : "",
  };
  const {
    data: repositoryDetails,
    isPending,
    isError,
    error,
  } = useRepositoryDetails(repository);

  if (!owner || !repo) {
    return <Navigate to="/" replace />;
  }

  const goBack = () => {
    if (location.key === "default") {
      navigate("/");
      return;
    }

    navigate(-1);
  };

  return (
    <main className="screen repository-details-screen">
      <Box className="repository-details-heading">
        <Link
          to="/"
          className="back-link"
          onClick={(event) => {
            event.preventDefault();
            goBack();
          }}
        >
          Back to previous page
        </Link>
        <p className="eyebrow">Repository details</p>
        <Typography component="h1">{repository.repositoryName}</Typography>
        <Typography className="repository-owner">
          {repository.repositoryOwner}/{repository.repositoryName}
        </Typography>
      </Box>

      {isPending ? (
        <Paper
          className="repository-details-panel"
          elevation={0}
          variant="outlined"
        >
          <CircularProgress size={28} />
        </Paper>
      ) : isError ? (
        <Alert severity="error">
          {error instanceof Error
            ? error.message
            : "Unable to load repository details."}
        </Alert>
      ) : repositoryDetails ? (
        <Paper
          className="repository-details-panel"
          elevation={0}
          variant="outlined"
        >
          <Box className="repository-stats">
            <Box>
              <Typography variant="overline">Stars</Typography>
              <Typography variant="h4">
                {repositoryDetails.stargazers_count.toLocaleString()}
              </Typography>
            </Box>
            <Box>
              <Typography variant="overline">Last commit date</Typography>
              <Typography variant="h6">
                {repositoryDetails.pushed_at
                  ? new Date(repositoryDetails.pushed_at).toLocaleDateString()
                  : "Unknown"}
              </Typography>
            </Box>
          </Box>
          <Box className="repository-description">
            <Typography variant="h5">Description</Typography>
            <Typography className="repository-full-description">
              {repositoryDetails.description || "No description available."}
            </Typography>
          </Box>
        </Paper>
      ) : null}
    </main>
  );
}

export default RepositoryDetailsScreen;
