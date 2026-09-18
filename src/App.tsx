import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./navigation/AppRoutes";
import Navbar from "./navigation/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
