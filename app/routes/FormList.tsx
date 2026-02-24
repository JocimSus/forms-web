import { NavLink } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/Button";
import { dummyForms } from "../data/dummy";

export default function FormList() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col gap-6 px-6 py-12 md:px-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Forms</h2>
            <p className="text-muted mt-2 text-sm">
              All open forms here. (Currently only dummy data)
            </p>
          </div>
          <Button>Create Form</Button>
        </div>
        <div
          className="grid gap-5"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          }}
        >
          {dummyForms.map((form) => (
            <article
              key={form.id}
              className="border-border bg-card flex flex-col gap-4 border p-5"
            >
              <div className="text-secondary flex items-center justify-between text-xs tracking-[0.2em] uppercase">
                <span>Updated</span>
                <span>{form.updatedAt}</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">{form.title}</h3>
                <p className="text-muted mt-2 text-sm">{form.description}</p>
              </div>
              <div>
                <p className="text-secondary text-xs font-semibold tracking-[0.2em] uppercase">
                  Preview
                </p>
                <ul className="text-primary mt-3 flex flex-col gap-2 text-sm">
                  {form.questions.slice(0, 3).map((question) => (
                    <li
                      key={question.id}
                      className="border-border bg-card border px-3 py-2"
                    >
                      {question.title}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-2 flex flex-wrap gap-3">
                <NavLink
                  to={`/forms/${form.id}`}
                  className="border-border bg-card text-secondary border px-4 py-2 text-xs font-semibold tracking-[0.2em] uppercase"
                >
                  Details
                </NavLink>
              </div>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
