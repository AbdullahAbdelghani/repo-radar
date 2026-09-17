import { Link } from "react-router-dom";

function HomeScreen() {
  return (
    <main className="screen">
      <p className="eyebrow">Repo Radar</p>
      <h1>Navigation is ready.</h1>
      <p className="description">
        This is the starting point for the application experience.
      </p>
      <Link className="button-link" to="/dashboard">
        Open dashboard
      </Link>
    </main>
  );
}

export default HomeScreen;
