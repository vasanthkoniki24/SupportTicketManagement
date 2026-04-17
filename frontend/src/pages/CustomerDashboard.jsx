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
  const [loading, setLoading] = useState(true);
  const role = getRole();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await API.get("/tickets");
      setTickets(res.data);
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

    return { total: tickets.length, open, progress, resolved, high };
  }, [tickets]);

  return (
    <DashboardLayout>
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            {role === "customer" ? "My Support Tickets" : "Support Operations"}
          </h1>
          <p className="text-slate-400 mt-1">
            Track, manage, and review support issues with a realtime-style workflow.
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

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Tickets" value={stats.total} />
          <StatCard title="Open" value={stats.open} />
          <StatCard title="In Progress" value={stats.progress} />
          <StatCard title="High Priority" value={stats.high} />
        </div>
      )}

      {loading ? (
        <div className="text-slate-300">Loading tickets...</div>
      ) : tickets.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-slate-300">
          No tickets found.
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}