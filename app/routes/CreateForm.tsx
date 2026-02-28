import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FormEditor, { type FormData } from "../components/FormEditor";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function CreateForm() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [authLoading, user, navigate]);

  if (authLoading) {
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

  const handleSubmit = async (data: FormData) => {
    setLoading(true);

    try {
      await api.post("/forms", data);
      navigate("/forms");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col gap-6 px-6 py-12 md:px-16">
        <div className="mx-auto w-full max-w-3xl">
          <h2 className="mb-6 text-2xl font-semibold">Create New Form</h2>
          <FormEditor
            onSubmit={handleSubmit}
            submitLabel="Create Form"
            onCancel={() => navigate("/forms")}
            loading={loading}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
