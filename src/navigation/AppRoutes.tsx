import { Navigate, Route, Routes } from "react-router-dom";
import MyTrackedReposScreen from "../screens/MyTrackedReposScreen";
import HomeScreen from "../screens/HomeScreen";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/my-tracked-repos" element={<MyTrackedReposScreen />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
