import { useNavigate } from "react-router-dom";

function DashboardScreen() {
  const navigate = useNavigate();

  return (
    <main className="screen">
      <p className="eyebrow">Dashboard</p>
      <h1>Your repository overview starts here.</h1>
      <p className="description">
        Add repository data, Redux state, and charts to this route next.
      </p>
      <button type="button" onClick={() => navigate(-1)}>
        Back to home
      </button>
    </main>
  );
}

export default DashboardScreen;
