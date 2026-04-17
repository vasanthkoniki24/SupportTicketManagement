import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";
import toast from "react-hot-toast";

export default function CreateTicket() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Low",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/tickets", form);
      toast.success("Ticket created successfully");
      navigate(`/tickets/${res.data.id}`);
    } catch (error) {
      toast.error(error?.response?.data?.detail || "Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold mb-2">Create New Ticket</h1>
        <p className="text-slate-400 mb-8">
          Raise a support issue with priority and full description.
        </p>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-8 space-y-5"
        >
          <div>
            <label className="block mb-2 text-sm text-slate-300">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter ticket title"
              className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/10 outline-none"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-slate-300">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Explain the issue in detail"
              rows="6"
              className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/10 outline-none resize-none"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-slate-300">Priority</label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-white/10 outline-none"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-600 transition font-semibold disabled:opacity-60"
          >
            {loading ? "Creating..." : "Submit Ticket"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}