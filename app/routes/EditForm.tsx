import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FormEditor, {
  type FormData,
  type QuestionType,
} from "../components/FormEditor";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

interface BackendOption {
  id: string;
  text: string;
}

interface BackendQuestion {
  id: string;
  text: string;
  type: QuestionType;
  required: boolean;
  options?: BackendOption[];
}

export default function EditForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [initialData, setInitialData] = useState<FormData>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
      return;
    }

    const fetchForm = async () => {
      try {
        const res = await api.get(`/forms/${id}`);
        const form = res.data;

        if (user && form.creator.id !== user.id) {
          navigate("/forms");
          return;
        }

        setInitialData({
          title: form.title,
          description: form.description,
          status: form.status,
          questions: form.questions.map((q: BackendQuestion) => ({
            id: q.id,
            text: q.text,
            type: q.type,
            required: q.required,
            options: q.options?.map((o) => o.text) || [],
          })),
        });
      } catch {
        setError("Failed to load form");
      } finally {
        setLoading(false);
      }
    };

    if (user && id) {
      fetchForm();
    }
  }, [id, user, authLoading, navigate]);

  const handleSubmit = async (data: FormData) => {
    await api.patch(`/forms/${id}`, data);
    navigate("/forms");
  };

  if (authLoading || loading) {
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

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-red-500">{error}</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col gap-6 px-6 py-12 md:px-16">
        <h2 className="mb-6 text-center text-2xl font-semibold">Edit Form</h2>
        <FormEditor
          initialData={initialData}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
          onCancel={() => navigate("/forms")}
        />
      </main>
      <Footer />
    </div>
  );
}
