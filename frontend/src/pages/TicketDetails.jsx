// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import DashboardLayout from "../layouts/DashboardLayout";
// import API from "../api/axios";
// import toast from "react-hot-toast";
// import CommentBubble from "../components/CommentBubble";
// import { getRole } from "../utils/auth";

// export default function TicketDetails() {
//   const { id } = useParams();
//   const role = getRole();

//   const [ticket, setTicket] = useState(null);
//   const [comments, setComments] = useState([]);
//   const [agents, setAgents] = useState([]);
//   const [commentText, setCommentText] = useState("");
//   const [statusValue, setStatusValue] = useState("");
//   const [agentId, setAgentId] = useState("");

//   useEffect(() => {
//     fetchTicket();
//     fetchComments();
//   }, [id]);

//   const fetchTicket = async () => {
//     try {
//       const res = await API.get(`/tickets/${id}`);
//       setTicket(res.data);
//       setStatusValue(res.data.status);
//     } catch (error) {
//       toast.error(error?.response?.data?.detail || "Failed to load ticket");
//     }
//   };

//   const fetchComments = async () => {
//     try {
//       const res = await API.get(`/tickets/${id}/comments`);
//       setComments(res.data);
//     } catch (error) {
//       toast.error(error?.response?.data?.detail || "Failed to load comments");
//     }
//   };

//   const fetchAgents = async () => {
//     try {
//       const res = await API.get("/tickets");
//       console.log(res);
//     } catch {
//       // placeholder for later if agent-list API is added
//     }
//   };

//   const handleComment = async (e) => {
//     e.preventDefault();
//     if (!commentText.trim()) return;

//     try {
//       await API.post(`/tickets/${id}/comments`, { message: commentText });
//       setCommentText("");
//       toast.success("Comment added");
//       fetchComments();
//     } catch (error) {
//       toast.error(error?.response?.data?.detail || "Failed to add comment");
//     }
//   };

//   const handleStatusUpdate = async () => {
//     try {
//       await API.patch(`/tickets/${id}/status`, { status: statusValue });
//       toast.success("Status updated");
//       fetchTicket();
//     } catch (error) {
//       toast.error(error?.response?.data?.detail || "Failed to update status");
//     }
//   };

//   const handleAssign = async () => {
//     if (!agentId) {
//       toast.error("Enter support agent ID");
//       return;
//     }

//     try {
//       await API.patch(`/tickets/${id}/assign`, { agent_id: Number(agentId) });
//       toast.success("Ticket assigned");
//       fetchTicket();
//     } catch (error) {
//       toast.error(error?.response?.data?.detail || "Failed to assign ticket");
//     }
//   };

//   if (!ticket) {
//     return (
//       <DashboardLayout>
//         <div className="text-slate-300">Loading ticket...</div>
//       </DashboardLayout>
//     );
//   }

//   return (
//     <DashboardLayout>
//       <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
//         <div className="xl:col-span-2 space-y-6">
//           <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
//             <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
//               <h1 className="text-2xl font-bold">{ticket.title}</h1>
//               <div className="flex gap-2 flex-wrap">
//                 <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm">
//                   {ticket.status}
//                 </span>
//                 <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-sm">
//                   {ticket.priority}
//                 </span>
//               </div>
//             </div>

//             <p className="text-slate-300 leading-relaxed mb-4">{ticket.description}</p>

//             <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-400">
//               <div>Ticket ID: #{ticket.id}</div>
//               <div>Customer ID: {ticket.customer_id}</div>
//               <div>Assigned Agent ID: {ticket.assigned_agent_id || "Not assigned"}</div>
//               <div>High Priority: {ticket.is_high_priority ? "Yes" : "No"}</div>
//               <div>Created At: {ticket.created_at || "-"}</div>
//               <div>Resolved At: {ticket.resolved_at || "-"}</div>
//             </div>
//           </div>

//           <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
//             <h2 className="text-xl font-semibold mb-4">Conversation</h2>

//             <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2 mb-5">
//               {comments.length === 0 ? (
//                 <p className="text-slate-400">No comments yet.</p>
//               ) : (
//                 comments.map((comment) => (
//                   <CommentBubble key={comment.id} comment={comment} />
//                 ))
//               )}
//             </div>

//             <form onSubmit={handleComment} className="flex gap-3">
//               <input
//                 type="text"
//                 value={commentText}
//                 onChange={(e) => setCommentText(e.target.value)}
//                 placeholder="Write a message..."
//                 className="flex-1 px-4 py-3 rounded-2xl bg-white/10 border border-white/10 outline-none"
//               />
//               <button className="px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-600 transition font-semibold">
//                 Send
//               </button>
//             </form>
//           </div>
//         </div>

//         <div className="space-y-6">
//           {(role === "admin" || role === "support_agent") && (
//             <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
//               <h2 className="text-lg font-semibold mb-4">Update Status</h2>
//               <select
//                 value={statusValue}
//                 onChange={(e) => setStatusValue(e.target.value)}
//                 className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-white/10 outline-none mb-4"
//               >
//                 <option value="Open">Open</option>
//                 <option value="In Progress">In Progress</option>
//                 <option value="Resolved">Resolved</option>
//                 <option value="Closed">Closed</option>
//               </select>
//               <button
//                 onClick={handleStatusUpdate}
//                 className="w-full py-3 rounded-2xl bg-blue-500 hover:bg-blue-600 transition font-semibold"
//               >
//                 Update Status
//               </button>
//             </div>
//           )}

//           {role === "admin" && (
//             <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
//               <h2 className="text-lg font-semibold mb-4">Assign Support Agent</h2>
//               <input
//                 type="number"
//                 value={agentId}
//                 onChange={(e) => setAgentId(e.target.value)}
//                 placeholder="Enter agent ID"
//                 className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/10 outline-none mb-4"
//               />
//               <button
//                 onClick={handleAssign}
//                 className="w-full py-3 rounded-2xl bg-purple-500 hover:bg-purple-600 transition font-semibold"
//               >
//                 Assign Ticket
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }




import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";
import toast from "react-hot-toast";
import CommentBubble from "../components/CommentBubble";
import { getRole } from "../utils/auth";

export default function TicketDetails() {
  const { id } = useParams();
  const role = getRole();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [statusValue, setStatusValue] = useState("");
  const [agentId, setAgentId] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchTicket();
    fetchComments();
  }, [id]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchComments(true);
      fetchTicket(true);
    }, 5000);

    return () => clearInterval(interval);
  }, [id]);

  const fetchTicket = async (silent = false) => {
    try {
      const res = await API.get(`/tickets/${id}`);
      setTicket(res.data);
      setStatusValue((prev) => prev || res.data.status);
    } catch (error) {
      if (!silent) {
        toast.error(error?.response?.data?.detail || "Failed to load ticket");
      }
    }
  };

  const fetchComments = async (silent = false) => {
    try {
      const res = await API.get(`/tickets/${id}/comments`);
      setComments(res.data);
    } catch (error) {
      if (!silent) {
        toast.error(error?.response?.data?.detail || "Failed to load comments");
      }
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSending(true);
    try {
      await API.post(`/tickets/${id}/comments`, { message: commentText });
      setCommentText("");
      fetchComments(true);
      toast.success("Comment added");
    } catch (error) {
      toast.error(error?.response?.data?.detail || "Failed to add comment");
    } finally {
      setSending(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      await API.patch(`/tickets/${id}/status`, { status: statusValue });
      toast.success("Status updated");
      fetchTicket(true);
    } catch (error) {
      toast.error(error?.response?.data?.detail || "Failed to update status");
    }
  };

  const handleAssign = async () => {
    if (!agentId) {
      toast.error("Enter support agent ID");
      return;
    }

    try {
      await API.patch(`/tickets/${id}/assign`, { agent_id: Number(agentId) });
      toast.success("Ticket assigned");
      fetchTicket(true);
    } catch (error) {
      toast.error(error?.response?.data?.detail || "Failed to assign ticket");
    }
  };

  if (!ticket) {
    return (
      <DashboardLayout>
        <div className="text-slate-300">Loading ticket...</div>
      </DashboardLayout>
    );
  }

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
    <DashboardLayout>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">{ticket.title}</h1>
              <div className="flex gap-2 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-sm ${statusColor}`}>
                  {ticket.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm ${priorityColor}`}>
                  {ticket.priority}
                </span>
              </div>
            </div>

            <p className="text-slate-300 leading-relaxed mb-5">{ticket.description}</p>

            <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-400">
              <div>Ticket ID: #{ticket.id}</div>
              <div>Customer ID: {ticket.customer_id}</div>
              <div>Assigned Agent ID: {ticket.assigned_agent_id || "Not assigned"}</div>
              <div>High Priority: {ticket.is_high_priority ? "Yes" : "No"}</div>
              <div>Created At: {ticket.created_at || "-"}</div>
              <div>Resolved At: {ticket.resolved_at || "-"}</div>
              <div>
                Resolution Time:{" "}
                {ticket.resolution_time_hours
                  ? `${ticket.resolution_time_hours} hrs`
                  : "-"}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Conversation</h2>
              <span className="text-xs text-slate-400">Auto-refresh every 5 sec</span>
            </div>

            <div className="space-y-4 max-h-[460px] overflow-y-auto pr-2 mb-5">
              {comments.length === 0 ? (
                <p className="text-slate-400">No comments yet.</p>
              ) : (
                comments.map((comment) => (
                  <CommentBubble key={comment.id} comment={comment} />
                ))
              )}
            </div>

            <form onSubmit={handleComment} className="flex gap-3">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a message..."
                className="flex-1 px-4 py-3 rounded-2xl bg-white/10 border border-white/10 outline-none"
              />
              <button
                disabled={sending}
                className="px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-600 transition font-semibold disabled:opacity-60"
              >
                {sending ? "Sending..." : "Send"}
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          {(role === "admin" || role === "support_agent") && (
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Update Status</h2>
              <select
                value={statusValue}
                onChange={(e) => setStatusValue(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-white/10 outline-none mb-4"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
              <button
                onClick={handleStatusUpdate}
                className="w-full py-3 rounded-2xl bg-blue-500 hover:bg-blue-600 transition font-semibold"
              >
                Update Status
              </button>
            </div>
          )}

          {role === "admin" && (
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Assign Support Agent</h2>
              <p className="text-sm text-slate-400 mb-3">
                Use the support agent user ID from your backend records.
              </p>
              <input
                type="number"
                value={agentId}
                onChange={(e) => setAgentId(e.target.value)}
                placeholder="Enter agent ID"
                className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/10 outline-none mb-4"
              />
              <button
                onClick={handleAssign}
                className="w-full py-3 rounded-2xl bg-purple-500 hover:bg-purple-600 transition font-semibold"
              >
                Assign Ticket
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}