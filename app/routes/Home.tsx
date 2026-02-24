import { NavLink } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center px-6 py-20 md:px-16">
        <div className="max-w-xl">
          <h1 className="text-4xl leading-tight font-semibold md:text-5xl">
            Whale Forms
          </h1>
          <p className="text-muted mt-4 text-base">
            Make forms, share, and analyze swiftly.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <NavLink
              to="/login"
              className="bg-card text-primary border-border border px-5 py-3 text-sm font-semibold"
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              className="bg-primary text-primary-foreground px-5 py-3 text-sm font-semibold"
            >
              Register
            </NavLink>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
