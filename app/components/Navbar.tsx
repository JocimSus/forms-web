import { NavLink, useNavigate } from "react-router";
import { Fish } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="border-border bg-background sticky top-0 z-10 flex items-center justify-between border-b px-6 py-4 md:px-16">
      <NavLink to="/" className="flex items-center gap-2 text-lg font-semibold">
        <Fish className="text-primary h-6 w-6" />
        Whale Forms
      </NavLink>
      <nav className="flex flex-wrap items-center gap-2 text-sm">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `px-3 py-2 font-semibold ${isActive ? "bg-card text-primary" : "text-secondary hover:text-primary"}`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/forms"
          className={({ isActive }) =>
            `px-3 py-2 font-semibold ${isActive ? "bg-card text-primary" : "text-secondary hover:text-primary"}`
          }
        >
          Forms
        </NavLink>
        {user ? (
          <>
            <span className="text-secondary px-3 py-2 font-semibold">
              Hi, {user.name}
            </span>
            <button
              onClick={handleLogout}
              className="text-secondary hover:text-primary cursor-pointer px-3 py-2 font-semibold"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `px-3 py-2 font-semibold ${isActive ? "bg-card text-primary" : "text-secondary hover:text-primary"}`
              }
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) =>
                `px-3 py-2 font-semibold ${isActive ? "bg-card text-primary" : "text-secondary hover:text-primary"}`
              }
            >
              Register
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
}
