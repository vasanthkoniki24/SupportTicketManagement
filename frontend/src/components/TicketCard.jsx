// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";

// export default function TicketCard({ ticket }) {
//   const statusColor =
//     ticket.status === "Open"
//       ? "bg-blue-500/20 text-blue-300"
//       : ticket.status === "In Progress"
//       ? "bg-yellow-500/20 text-yellow-300"
//       : ticket.status === "Resolved"
//       ? "bg-green-500/20 text-green-300"
//       : "bg-slate-500/20 text-slate-300";

//   const priorityColor =
//     ticket.priority === "High"
//       ? "bg-red-500/20 text-red-300"
//       : ticket.priority === "Medium"
//       ? "bg-orange-500/20 text-orange-300"
//       : "bg-slate-500/20 text-slate-300";

//   return (
//     <motion.div
//       whileHover={{ y: -4 }}
//       className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-xl"
//     >
//       <div className="flex items-start justify-between gap-4 mb-4">
//         <div>
//           <h3 className="text-lg font-semibold">{ticket.title}</h3>
//           <p className="text-sm text-slate-400 mt-1 line-clamp-2">
//             {ticket.description}
//           </p>
//         </div>

//         {ticket.is_high_priority && (
//           <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-300">
//             High Priority
//           </span>
//         )}
//       </div>

//       <div className="flex flex-wrap gap-2 mb-4">
//         <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
//           {ticket.status}
//         </span>
//         <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColor}`}>
//           {ticket.priority}
//         </span>
//       </div>

//       <div className="flex items-center justify-between">
//         <div className="text-sm text-slate-400">
//           Ticket #{ticket.id}
//         </div>

//         <Link
//           to={`/tickets/${ticket.id}`}
//           className="px-4 py-2 rounded-xl bg-cyan-500/90 hover:bg-cyan-500 transition text-sm font-medium"
//         >
//           View Details
//         </Link>
//       </div>
//     </motion.div>
//   );
// }


import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock3, UserCircle2 } from "lucide-react";

export default function TicketCard({ ticket }) {
  const statusColor =
    ticket.status === "Open"
      ? "bg-blue-500/20 text-blue-300 border border-blue-400/20"
      : ticket.status === "In Progress"
      ? "bg-yellow-500/20 text-yellow-300 border border-yellow-400/20"
      : ticket.status === "Resolved"
      ? "bg-green-500/20 text-green-300 border border-green-400/20"
      : "bg-slate-500/20 text-slate-300 border border-slate-400/20";

  const priorityColor =
    ticket.priority === "High"
      ? "bg-red-500/20 text-red-300 border border-red-400/20"
      : ticket.priority === "Medium"
      ? "bg-orange-500/20 text-orange-300 border border-orange-400/20"
      : "bg-slate-500/20 text-slate-300 border border-slate-400/20";

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-xl"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold truncate">{ticket.title}</h3>
          <p className="text-sm text-slate-400 mt-1 line-clamp-2">
            {ticket.description}
          </p>
        </div>

        {ticket.is_high_priority && (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-300 border border-red-400/20 whitespace-nowrap">
            Urgent
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
          {ticket.status}
        </span>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColor}`}>
          {ticket.priority}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <UserCircle2 size={15} />
          Customer #{ticket.customer_id}
        </div>
        <div className="flex items-center gap-2">
          <Clock3 size={15} />
          Ticket #{ticket.id}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="text-sm text-slate-400">
          {ticket.resolution_time_hours
            ? `Resolved in ${ticket.resolution_time_hours} hrs`
            : "Awaiting resolution"}
        </div>

        <Link
          to={`/tickets/${ticket.id}`}
          className="px-4 py-2 rounded-xl bg-cyan-500/90 hover:bg-cyan-500 transition text-sm font-medium"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
}