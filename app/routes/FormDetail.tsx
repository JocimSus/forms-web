import { useParams, NavLink } from "react-router";
import { ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { dummyForms } from "../data/dummy";
import Button from "../components/Button";

export default function FormDetail() {
  const { id } = useParams();
  const form = dummyForms.find((f) => f.id === id);

  if (!form) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-12 text-center md:px-16">
          <h2 className="text-2xl font-semibold">Form not found</h2>
          <p className="text-muted">
            The form you are looking for does not exist.
          </p>
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
      <main className="flex flex-1 flex-col gap-8 px-6 py-12 md:px-16">
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
                  Preview Form
                </p>
                <h2 className="mt-2 text-2xl font-semibold">{form.title}</h2>
                <p className="text-muted mt-2 text-sm">{form.description}</p>
              </div>
              <div className="border-border bg-card text-secondary border px-4 py-2 text-xs font-semibold tracking-[0.2em] uppercase">
                Read-only
              </div>
            </div>
          </section>
        </div>

        <section>
          <h3 className="text-lg font-semibold">Questions</h3>
          <div className="mt-4 flex flex-col gap-4">
            {form.questions.map((question) => (
              <article
                key={question.id}
                className="border-border bg-card flex flex-col gap-3 border p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <h4 className="text-base font-semibold">{question.title}</h4>
                  <p className="text-secondary mt-1 text-xs tracking-[0.2em] uppercase">
                    {question.type.replace("_", " ")}
                  </p>
                </div>
                <span className="border-border bg-card text-secondary border px-4 py-2 text-xs font-semibold tracking-[0.2em] uppercase">
                  {question.required ? "Required" : "Optional"}
                </span>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
