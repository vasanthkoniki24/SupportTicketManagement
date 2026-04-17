import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      toast.success("Registration successful");
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,_#7c3aed,_#0f172a_40%,_#020617)] p-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold mb-2">Create account</h1>
        <p className="text-slate-300 mb-6">Start using the support platform</p>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full name"
            className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/10 outline-none"
            onChange={handleChange}
            value={form.name}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/10 outline-none"
            onChange={handleChange}
            value={form.email}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/10 outline-none"
            onChange={handleChange}
            value={form.password}
          />
          <select
            name="role"
            className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-white/10 outline-none"
            onChange={handleChange}
            value={form.role}
          >
            <option value="customer">Customer</option>
            <option value="support_agent">Support Agent</option>
            <option value="admin">Admin</option>
          </select>
          <button className="w-full py-3 rounded-2xl bg-purple-500 hover:bg-purple-600 transition font-semibold">
            Register
          </button>
        </form>

        <p className="text-sm text-slate-300 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-cyan-300">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}