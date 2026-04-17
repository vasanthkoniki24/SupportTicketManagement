import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.access_token);

      const me = await API.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${res.data.access_token}`,
        },
      });

      localStorage.setItem("role", me.data.role);
      localStorage.setItem("user", JSON.stringify(me.data));

      toast.success("Login successful");

      if (me.data.role === "admin") navigate("/admin");
      else navigate("/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,_#1d4ed8,_#0f172a_40%,_#020617)] p-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold mb-2">Sign in</h1>
        <p className="text-slate-300 mb-6">Access your support workspace</p>

        <form onSubmit={handleLogin} className="space-y-4">
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
          <button className="w-full py-3 rounded-2xl bg-blue-500 hover:bg-blue-600 transition font-semibold">
            Login
          </button>
        </form>

        <p className="text-sm text-slate-300 mt-6">
          Don’t have an account?{" "}
          <Link to="/register" className="text-cyan-300">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}