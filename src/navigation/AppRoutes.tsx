import { Navigate, Route, Routes } from "react-router-dom";
import MyTrackedReposScreen from "../screens/MyTrackedReposScreen";
import HomeScreen from "../screens/HomeScreen";
import RepositoryDetailsScreen from "../screens/RepositoryDetailsScreen";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/my-tracked-repos" element={<MyTrackedReposScreen />} />
      <Route
        path="/repositories/:owner/:repo"
        element={<RepositoryDetailsScreen />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
