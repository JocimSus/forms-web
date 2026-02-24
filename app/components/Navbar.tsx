import { NavLink } from "react-router";
import { Fish } from "lucide-react";

export default function Navbar() {
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
      </nav>
    </header>
  );
}
