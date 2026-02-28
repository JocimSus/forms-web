import { useEffect, useState } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/Button";
import Input from "../components/Input";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

interface Question {
  id: string;
  text: string;
  type: string;
}

interface Creator {
  id: string;
  name: string;
  email: string;
}

interface Form {
  id: string;
  title: string;
  description: string;
  status: "DRAFT" | "PUBLISHED" | "CLOSED";
  updatedAt: string;
  questions: Question[];
  creator: Creator;
}

export default function FormList() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const view = searchParams.get("view") || "public";
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    setSearchTerm("");
    setStatusFilter("");
  }, [view]);

  useEffect(() => {
    const fetchForms = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();

        if (searchTerm) {
          params.append("title", searchTerm);
        }

        if (view === "mine" && user) {
          params.append("creatorId", "me");
          if (statusFilter) {
            params.append("status", statusFilter);
          }
        }

        const res = await api.get("/forms", { params });
        setForms(res.data);
      } catch (error) {
        console.error("Failed to fetch forms", error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchForms();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [view, user, searchTerm, statusFilter]);

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this form? This action cannot be undone.",
      )
    )
      return;

    try {
      await api.delete(`/forms/${id}`);
      setForms(forms.filter((f) => f.id !== id));
    } catch {
      alert("Failed to delete form");
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col gap-6 px-6 py-12 md:px-16">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Forms</h2>
              <p className="text-muted mt-2 text-sm">
                {view === "mine" ? "My Forms" : "All Public Forms"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {user && (
                <div className="bg-card border-border flex h-9 overflow-hidden rounded-md border">
                  <button
                    onClick={() => setSearchParams({ view: "public" })}
                    className={`px-4 text-sm font-medium ${view === "public" ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}
                  >
                    Public
                  </button>
                  <button
                    onClick={() => setSearchParams({ view: "mine" })}
                    className={`px-4 text-sm font-medium ${view === "mine" ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}
                  >
                    My Forms
                  </button>
                </div>
              )}
              <Button
                onClick={() =>
                  user ? navigate("/forms/new") : navigate("/login")
                }
              >
                Create Form
              </Button>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-card border-border flex flex-col gap-4 rounded-lg border p-4 md:flex-row">
            <div className="flex-1">
              <Input
                placeholder="Search forms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            {view === "mine" && (
              <div className="w-full md:w-48">
                <select
                  className="border-border bg-card text-primary h-full w-full rounded-md border px-3 py-2 text-sm outline-none"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Forms */}
        {loading ? (
          <p>Loading...</p>
        ) : forms.length === 0 ? (
          <p>No forms found.</p>
        ) : (
          <div
            className="grid gap-5"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            }}
          >
            {forms.map((form) => (
              <article
                key={form.id}
                className="border-border bg-card relative flex flex-col gap-4 border p-5"
              >
                {view === "mine" && (
                  <div
                    className={`border-border absolute top-2 right-2 rounded border px-2 py-1 text-[10px] font-bold tracking-wider uppercase ${
                      form.status === "PUBLISHED"
                        ? "border-green-200 bg-green-500/10 text-green-600"
                        : form.status === "DRAFT"
                          ? "border-yellow-200 bg-yellow-500/10 text-yellow-600"
                          : "border-gray-200 bg-gray-500/10 text-gray-600"
                    }`}
                  >
                    {form.status}
                  </div>
                )}
                <div className="text-secondary mt-4 flex items-center justify-between text-xs tracking-[0.2em] uppercase">
                  <span>Updated</span>
                  <span>{new Date(form.updatedAt).toLocaleDateString()}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{form.title}</h3>
                  <p className="text-muted mt-2 line-clamp-2 text-sm">
                    {form.description}
                  </p>
                </div>

                <div className="mt-auto flex flex-wrap gap-2 pt-4">
                  <NavLink
                    to={`/forms/${form.id}`}
                    className="border-border bg-card text-secondary hover:bg-accent flex-1 border px-3 py-2 text-center text-xs font-semibold tracking-[0.2em] uppercase"
                  >
                    View
                  </NavLink>
                  {user && user.id === form.creator.id && (
                    <>
                      <NavLink
                        to={`/forms/${form.id}/edit`}
                        className="border-border bg-card text-primary hover:bg-accent flex-1 border px-3 py-2 text-center text-xs font-semibold tracking-[0.2em] uppercase"
                      >
                        Edit
                      </NavLink>
                      <NavLink
                        to={`/forms/${form.id}/responses`}
                        className="border-border bg-card hover:bg-accent flex-1 border px-3 py-2 text-center text-xs font-semibold tracking-[0.2em] text-purple-600 uppercase hover:text-purple-700"
                      >
                        Responses
                      </NavLink>
                      <button
                        onClick={() => handleDelete(form.id)}
                        className="flex-1 border border-red-200 bg-red-50 px-3 py-2 text-center text-xs font-semibold tracking-[0.2em] text-red-600 uppercase hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
