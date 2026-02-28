import { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router";
import { ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/Button";
import Input from "../components/Input";
import { api } from "../lib/api";
import { isAxiosError } from "axios";

interface QuestionOption {
  id: string;
  text: string;
}

interface Question {
  id: string;
  text: string;
  type: "SHORT_ANSWER" | "MULTIPLE_CHOICE" | "CHECKBOX" | "DROPDOWN";
  required: boolean;
  options: QuestionOption[];
}

interface Form {
  id: string;
  title: string;
  description: string;
  status: "DRAFT" | "PUBLISHED" | "CLOSED";
  questions: Question[];
}

export default function FormDetail() {
  const { id } = useParams();
  const [form, setForm] = useState<Form>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>(null);

  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await api.get(`/forms/${id}`);
        setForm(res.data);
      } catch (err: unknown) {
        if (isAxiosError(err) && err.response?.status === 404) {
          setError("Form not found");
        } else {
          setError("Failed to load form");
        }
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchForm();
  }, [id]);

  const handleInputChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleCheckboxChange = (
    questionId: string,
    option: string,
    checked: boolean,
  ) => {
    setAnswers((prev) => {
      const current = (prev[questionId] as string[]) || [];
      if (checked) {
        return { ...prev, [questionId]: [...current, option] };
      } else {
        return { ...prev, [questionId]: current.filter((v) => v !== option) };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!form) return;

    for (const q of form.questions) {
      if (q.required) {
        const val = answers[q.id];
        if (
          !val ||
          (Array.isArray(val) && val.length === 0) ||
          (typeof val === "string" && !val.trim())
        ) {
          setValidationError(`Question "${q.text}" is required`);
          return;
        }
      }
    }

    setSubmitting(true);
    try {
      const submissionAnswers = Object.entries(answers).flatMap(
        ([qId, val]) => {
          if (Array.isArray(val)) {
            return val.map((v) => ({ questionId: qId, value: v }));
          }
          return { questionId: qId, value: val as string };
        },
      );

      await api.post(`/forms/${id}/responses`, {
        answers: submissionAnswers,
      });
      setSuccess(true);
      window.scrollTo(0, 0);
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        setValidationError(
          err.response?.data?.message || "Failed to submit form",
        );
      } else {
        setValidationError("Failed to submit form");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-12 text-center md:px-16">
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
        <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-12 text-center md:px-16">
          <h2 className="text-2xl font-semibold">Form not found</h2>
          <p className="text-muted">
            The form you are looking for does not exist or is not available.
          </p>
          <NavLink to="/forms">
            <Button>Back to Forms</Button>
          </NavLink>
        </main>
        <Footer />
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-12 text-center md:px-16">
          <div className="border-border bg-card flex w-full max-w-md flex-col items-center gap-4 border p-8">
            <h2 className="text-2xl font-semibold text-green-500">
              Submission Received!
            </h2>
            <p className="text-muted">
              Thank you for filling out <strong>{form.title}</strong>. Your
              response has been recorded.
            </p>
            <div className="mt-4 flex gap-4">
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Submit Another
              </Button>
              <NavLink to="/forms">
                <Button>Back to Forms</Button>
              </NavLink>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-6 py-12 md:px-16">
        <div>
          <NavLink
            to="/forms"
            className="text-muted hover:text-primary mb-4 inline-flex items-center gap-2 text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Forms
          </NavLink>
          <section className="border-border bg-card flex flex-col gap-4 border p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-secondary text-xs font-semibold tracking-[0.2em] uppercase">
                  Form
                </p>
                <h2 className="mt-2 text-2xl font-semibold">{form.title}</h2>
                <p className="text-muted mt-2 text-sm">{form.description}</p>
              </div>
              {form.status !== "PUBLISHED" && (
                <div className="border-border border bg-yellow-500/10 px-4 py-2 text-xs font-semibold tracking-[0.2em] text-yellow-500 uppercase">
                  {form.status} Mode (Preview)
                </div>
              )}
            </div>
          </section>
        </div>

        {validationError && (
          <div className="rounded border border-red-500/20 bg-red-500/10 p-4 text-sm font-medium text-red-500">
            {validationError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <section>
            <div className="flex flex-col gap-6">
              {form.questions.map((question) => (
                <article
                  key={question.id}
                  className="border-border bg-card flex flex-col gap-4 border p-6"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-semibold">{question.text}</h4>
                      {question.required && (
                        <span className="text-sm text-red-500">*</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-2">
                    {question.type === "SHORT_ANSWER" && (
                      <Input
                        placeholder="Your answer"
                        value={(answers[question.id] as string) || ""}
                        onChange={(e) =>
                          handleInputChange(question.id, e.target.value)
                        }
                        required={question.required}
                      />
                    )}

                    {question.type === "MULTIPLE_CHOICE" && (
                      <div className="flex flex-col gap-3">
                        {question.options?.map((opt) => (
                          <label
                            key={opt.id}
                            className="group flex cursor-pointer items-center gap-3"
                          >
                            <input
                              type="radio"
                              name={question.id}
                              value={opt.text}
                              checked={answers[question.id] === opt.text}
                              onChange={(e) =>
                                handleInputChange(question.id, e.target.value)
                              }
                              className="accent-primary h-4 w-4 cursor-pointer"
                            />
                            <span className="group-hover:text-primary text-sm transition-colors">
                              {opt.text}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}

                    {question.type === "CHECKBOX" && (
                      <div className="flex flex-col gap-3">
                        {question.options?.map((opt) => (
                          <label
                            key={opt.id}
                            className="group flex cursor-pointer items-center gap-3"
                          >
                            <input
                              type="checkbox"
                              value={opt.text}
                              checked={(
                                (answers[question.id] as string[]) || []
                              ).includes(opt.text)}
                              onChange={(e) =>
                                handleCheckboxChange(
                                  question.id,
                                  opt.text,
                                  e.target.checked,
                                )
                              }
                              className="accent-primary h-4 w-4 cursor-pointer"
                            />
                            <span className="group-hover:text-primary text-sm transition-colors">
                              {opt.text}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}

                    {question.type === "DROPDOWN" && (
                      <select
                        className="border-border bg-card text-primary w-full border px-3 py-2 text-sm outline-none md:w-1/2"
                        value={(answers[question.id] as string) || ""}
                        onChange={(e) =>
                          handleInputChange(question.id, e.target.value)
                        }
                      >
                        <option value="" disabled>
                          Select an option
                        </option>
                        {question.options?.map((opt) => (
                          <option key={opt.id} value={opt.text}>
                            {opt.text}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <div className="flex justify-end">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}
