import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";
import toast from "react-hot-toast";
import StatCard from "../components/StatCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await API.get("/admin/analytics");
      setAnalytics(res.data);
    } catch (error) {
      toast.error(error?.response?.data?.detail || "Failed to load analytics");
    }
  };

  if (!analytics) {
    return (
      <DashboardLayout>
        <div className="text-slate-300">Loading analytics...</div>
      </DashboardLayout>
    );
  }

  const chartData = [
    { name: "Low", value: analytics.tickets_by_priority.low },
    { name: "Medium", value: analytics.tickets_by_priority.medium },
    { name: "High", value: analytics.tickets_by_priority.high },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Analytics</h1>
        <p className="text-slate-400 mt-1">
          Overview of support operations and performance metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Tickets" value={analytics.total_tickets} />
        <StatCard title="Open" value={analytics.status_breakdown.open} />
        <StatCard title="Resolved" value={analytics.status_breakdown.resolved} />
        <StatCard
          title="Avg Resolution Hours"
          value={analytics.average_resolution_time_hours ?? 0}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Status Breakdown</h2>
          <div className="space-y-3 text-slate-300">
            <p>Open: {analytics.status_breakdown.open}</p>
            <p>In Progress: {analytics.status_breakdown.in_progress}</p>
            <p>Resolved: {analytics.status_breakdown.resolved}</p>
            <p>Closed: {analytics.status_breakdown.closed}</p>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Tickets by Priority</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#cbd5e1" />
                <YAxis stroke="#cbd5e1" />
                <Tooltip />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}