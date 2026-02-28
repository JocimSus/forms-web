import { useEffect, useState } from "react";
import { useParams, NavLink, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/Button";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

import { isAxiosError } from "axios";

interface Question {
  id: string;
  text: string;
  type: string;
}

interface Form {
  id: string;
  title: string;
  questions: Question[];
}

interface Answer {
  id: string;
  questionId: string;
  value: string;
}

interface Submission {
  id: string;
  submittedAt: string;
  answers: Answer[];
}

export default function FormResponses() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [form, setForm] = useState<Form>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const formRes = await api.get(`/forms/${id}`);
        setForm(formRes.data);

        const responsesRes = await api.get(`/forms/${id}/responses`);
        setSubmissions(responsesRes.data);
      } catch (err: unknown) {
        if (isAxiosError(err) && err.response?.status === 403) {
          setError("You are not authorized to view these responses");
        } else {
          setError("Failed to load responses");
        }
      } finally {
        setLoading(false);
      }
    };

    if (user && id) {
      fetchData();
    }
  }, [id, user, authLoading, navigate]);

  if (loading || authLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <p>Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-12 text-center">
          <h2 className="text-2xl font-semibold">Error</h2>
          <p className="text-red-500">{error || "Form not found"}</p>
          <NavLink to="/forms">
            <Button>Back to Forms</Button>
          </NavLink>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto flex w-full max-w-360 flex-1 flex-col gap-6 px-6 py-12 md:px-16">
        <div>
          <NavLink
            to="/forms"
            className="text-muted hover:text-primary mb-4 inline-flex items-center gap-2 text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Forms
          </NavLink>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold">{form.title}</h2>
            <p className="text-muted text-sm">
              {submissions.length} response{submissions.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {submissions.length === 0 ? (
          <div className="border-border bg-card flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-12">
            <p className="text-muted">No responses yet.</p>
            <p className="text-muted-foreground text-sm">
              Share your form to start collecting data.
            </p>
          </div>
        ) : (
          <div className="border-border bg-card overflow-x-auto rounded-lg border shadow-sm">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-muted/50 text-secondary border-border sticky top-0 border-b text-xs font-semibold tracking-wider uppercase">
                <tr>
                  <th className="bg-muted/50 px-6 py-3 whitespace-nowrap">
                    Timestamp
                  </th>
                  {form.questions.map((q) => (
                    <th
                      key={q.id}
                      className="border-border/50 bg-muted/50 min-w-50 border-l px-6 py-3"
                    >
                      {q.text}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-border divide-y">
                {submissions.map((submission) => (
                  <tr
                    key={submission.id}
                    className="hover:bg-accent/50 transition-colors"
                  >
                    <td className="text-muted-foreground px-6 py-4 font-medium whitespace-nowrap">
                      {new Date(submission.submittedAt).toLocaleString()}
                    </td>
                    {form.questions.map((q) => {
                      const answer = submission.answers.find(
                        (a) => a.questionId === q.id,
                      );
                      return (
                        <td
                          key={q.id}
                          className="border-border/50 border-l px-6 py-4 align-top"
                        >
                          {answer ? (
                            <div className="max-h-32 overflow-y-auto wrap-break-word">
                              {answer.value}
                            </div>
                          ) : (
                            <span className="text-muted-foreground/30 italic">
                              -
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
