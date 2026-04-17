// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import DashboardLayout from "../layouts/DashboardLayout";
// import API from "../api/axios";
// import toast from "react-hot-toast";
// import TicketCard from "../components/TicketCard";
// import { getRole } from "../utils/auth";

// export default function CustomerDashboard() {
//   const [tickets, setTickets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const role = getRole();

//   useEffect(() => {
//     fetchTickets();
//   }, []);

//   const fetchTickets = async () => {
//     try {
//       const res = await API.get("/tickets");
//       setTickets(res.data);
//     } catch (error) {
//       toast.error(error?.response?.data?.detail || "Failed to load tickets");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <DashboardLayout>
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
//         <div>
//           <h1 className="text-3xl font-bold">Support Dashboard</h1>
//           <p className="text-slate-400 mt-1">
//             Track, manage, and review support tickets in real time.
//           </p>
//         </div>

//         {role === "customer" && (
//           <Link
//             to="/tickets/new"
//             className="px-5 py-3 rounded-2xl bg-blue-500 hover:bg-blue-600 transition font-semibold"
//           >
//             + Create Ticket
//           </Link>
//         )}
//       </div>

//       {loading ? (
//         <div className="text-slate-300">Loading tickets...</div>
//       ) : tickets.length === 0 ? (
//         <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-slate-300">
//           No tickets found.
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
//           {tickets.map((ticket) => (
//             <TicketCard key={ticket.id} ticket={ticket} />
//           ))}
//         </div>
//       )}
//     </DashboardLayout>
//   );
// }



// import { useEffect, useMemo, useState } from "react";
// import { Link } from "react-router-dom";
// import DashboardLayout from "../layouts/DashboardLayout";
// import API from "../api/axios";
// import toast from "react-hot-toast";
// import TicketCard from "../components/TicketCard";
// import { getRole } from "../utils/auth";
// import StatCard from "../components/StatCard";

// export default function CustomerDashboard() {
//   const [tickets, setTickets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const role = getRole();

//   useEffect(() => {
//     fetchTickets();
//   }, []);

//   const fetchTickets = async () => {
//     try {
//       const res = await API.get("/tickets");
//       setTickets(res.data);
//     } catch (error) {
//       toast.error(error?.response?.data?.detail || "Failed to load tickets");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const stats = useMemo(() => {
//     const open = tickets.filter((t) => t.status === "Open").length;
//     const progress = tickets.filter((t) => t.status === "In Progress").length;
//     const resolved = tickets.filter((t) => t.status === "Resolved" || t.status === "Closed").length;
//     const high = tickets.filter((t) => t.priority === "High").length;

//     return { total: tickets.length, open, progress, resolved, high };
//   }, [tickets]);

//   return (
//     <DashboardLayout>
//       <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-8">
//         <div>
//           <h1 className="text-3xl font-bold">
//             {role === "customer" ? "My Support Tickets" : "Support Operations"}
//           </h1>
//           <p className="text-slate-400 mt-1">
//             Track, manage, and review support issues with a realtime-style workflow.
//           </p>
//         </div>

//         {role === "customer" && (
//           <Link
//             to="/tickets/new"
//             className="px-5 py-3 rounded-2xl bg-blue-500 hover:bg-blue-600 transition font-semibold"
//           >
//             + Create Ticket
//           </Link>
//         )}
//       </div>

//       {!loading && (
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
//           <StatCard title="Total Tickets" value={stats.total} />
//           <StatCard title="Open" value={stats.open} />
//           <StatCard title="In Progress" value={stats.progress} />
//           <StatCard title="High Priority" value={stats.high} />
//         </div>
//       )}

//       {loading ? (
//         <div className="text-slate-300">Loading tickets...</div>
//       ) : tickets.length === 0 ? (
//         <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-slate-300">
//           No tickets found.
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
//           {tickets.map((ticket) => (
//             <TicketCard key={ticket.id} ticket={ticket} />
//           ))}
//         </div>
//       )}
//     </DashboardLayout>
//   );
// }


import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";
import toast from "react-hot-toast";
import TicketCard from "../components/TicketCard";
import { getRole } from "../utils/auth";
import StatCard from "../components/StatCard";

export default function CustomerDashboard() {
  const [tickets, setTickets] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0, limit: 6 });
  const [loading, setLoading] = useState(true);
  const role = getRole();

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    priority: "",
    page: 1,
    limit: 6,
  });

  useEffect(() => {
    fetchTickets();
  }, [filters]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("page", filters.page);
      params.append("limit", filters.limit);
      if (filters.search) params.append("search", filters.search);
      if (filters.status) params.append("status", filters.status);
      if (filters.priority) params.append("priority", filters.priority);

      const res = await API.get(`/tickets?${params.toString()}`);
      setTickets(res.data.items);
      setMeta({
        page: res.data.page,
        pages: res.data.pages,
        total: res.data.total,
        limit: res.data.limit,
      });
    } catch (error) {
      toast.error(error?.response?.data?.detail || "Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const open = tickets.filter((t) => t.status === "Open").length;
    const progress = tickets.filter((t) => t.status === "In Progress").length;
    const resolved = tickets.filter((t) => t.status === "Resolved" || t.status === "Closed").length;
    const high = tickets.filter((t) => t.priority === "High").length;

    return { total: meta.total, open, progress, resolved, high };
  }, [tickets, meta.total]);
  return (
    <DashboardLayout>
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            {role === "customer" ? "My Support Tickets" : "Support Operations"}
          </h1>
          <p className="text-slate-400 mt-1">
            Track, search, and manage tickets with realtime-style workflow.
          </p>
        </div>

        {role === "customer" && (
          <Link
            to="/tickets/new"
            className="px-5 py-3 rounded-2xl bg-blue-500 hover:bg-blue-600 transition font-semibold"
          >
            + Create Ticket
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Tickets" value={stats.total} />
        <StatCard title="Open" value={stats.open} />
        <StatCard title="In Progress" value={stats.progress} />
        <StatCard title="High Priority" value={stats.high} />
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 md:p-5 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search by title or description"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
          className="px-4 py-3 rounded-2xl bg-white/10 border border-white/10 outline-none"
        />

        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
          className="px-4 py-3 rounded-2xl bg-slate-900 border border-white/10 outline-none"
        >
          <option value="">All Status</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>

        <select
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value, page: 1 })}
          className="px-4 py-3 rounded-2xl bg-slate-900 border border-white/10 outline-none"
        >
          <option value="">All Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <button
          onClick={() => setFilters({ search: "", status: "", priority: "", page: 1, limit: 6 })}
          className="px-4 py-3 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/15"
        >
          Reset Filters
        </button>
      </div>

      {loading ? (
        <div className="text-slate-300">Loading tickets...</div>
      ) : tickets.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-slate-300">
          No tickets found.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {tickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>

          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              disabled={meta.page <= 1}
              onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
              className="px-4 py-2 rounded-xl bg-white/10 disabled:opacity-40"
            >
              Prev
            </button>

            <span className="text-slate-300">
              Page {meta.page} of {meta.pages || 1}
            </span>

            <button
              disabled={meta.page >= meta.pages}
              onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
              className="px-4 py-2 rounded-xl bg-white/10 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}