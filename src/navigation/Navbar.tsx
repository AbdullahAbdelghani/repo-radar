import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar" aria-label="Primary navigation">
      <NavLink
        className={({ isActive }) =>
          isActive ? "nav-button active" : "nav-button"
        }
        to="/"
        end
      >
        Home
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          isActive ? "nav-button active" : "nav-button"
        }
        to="/my-tracked-repos"
      >
        My Tracked Repos
      </NavLink>
    </nav>
  );
}

export default Navbar;
