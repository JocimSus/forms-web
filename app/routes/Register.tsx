import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Input from "../components/Input";
import Button from "../components/Button";

export default function Register() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="border-border bg-card w-full max-w-sm border p-8">
          <h2 className="text-2xl font-semibold">Register</h2>
          <form className="mt-6 flex flex-col gap-4">
            <Input label="Username" placeholder="Your Username" />
            <Input label="Email" placeholder="your@email.com" type="email" />
            <Input label="Password" placeholder="********" type="password" />
            <Button type="submit">Daftar</Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
