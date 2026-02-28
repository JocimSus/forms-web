import { useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Input from "../components/Input";
import Button from "../components/Button";
import { api } from "../lib/api";
import { isAxiosError } from "axios";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/auth/register", formData);
      navigate("/login");
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="border-border bg-card w-full max-w-sm border p-8">
          <h2 className="text-2xl font-semibold">Register</h2>
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input
              label="Username"
              placeholder="Your Username"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <Input
              label="Email"
              placeholder="your@email.com"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <Input
              label="Password"
              placeholder="********"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <Button type="submit">Daftar</Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
