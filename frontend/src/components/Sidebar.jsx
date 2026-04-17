// import { Link, useLocation } from "react-router-dom";
// import { LayoutDashboard, PlusCircle, Bell, Shield } from "lucide-react";
// import { getRole } from "../utils/auth";

// export default function Sidebar() {
//   const role = getRole();
//   const location = useLocation();

//   const itemClass = (path) =>
//     `flex items-center gap-3 px-4 py-3 rounded-2xl transition ${
//       location.pathname === path
//         ? "bg-white/15 text-white"
//         : "text-slate-300 hover:bg-white/10 hover:text-white"
//     }`;

//   return (
//     <aside className="hidden md:flex w-72 min-h-screen border-r border-white/10 bg-white/5 backdrop-blur-xl p-5 flex-col">
//       <div className="mb-8">
//         <h1 className="text-2xl font-bold tracking-tight">SupportFlow</h1>
//         <p className="text-sm text-slate-400 mt-1">Ticket Management System</p>
//       </div>

//       <nav className="space-y-3">
//         <Link to={role === "admin" ? "/admin" : "/dashboard"} className={itemClass(role === "admin" ? "/admin" : "/dashboard")}>
//           <LayoutDashboard size={18} />
//           Dashboard
//         </Link>

//         {role === "customer" && (
//           <Link to="/tickets/new" className={itemClass("/tickets/new")}>
//             <PlusCircle size={18} />
//             Create Ticket
//           </Link>
//         )}

//         <Link to="/notifications" className={itemClass("/notifications")}>
//           <Bell size={18} />
//           Notifications
//         </Link>

//         {role === "admin" && (
//           <Link to="/admin" className={itemClass("/admin")}>
//             <Shield size={18} />
//             Admin Panel
//           </Link>
//         )}
//       </nav>
//     </aside>
//   );
// }




import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, PlusCircle, Bell, Shield, X } from "lucide-react";
import { getRole } from "../utils/auth";

export default function Sidebar({ open, onClose }) {
  const role = getRole();
  const location = useLocation();

  const itemClass = (path) =>
    `flex items-center gap-3 px-4 py-3 rounded-2xl transition ${
      location.pathname === path
        ? "bg-white/15 text-white"
        : "text-slate-300 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:static top-0 left-0 z-50 md:z-auto w-72 min-h-screen border-r border-white/10 bg-slate-950/90 md:bg-white/5 backdrop-blur-xl p-5 flex flex-col transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">SupportFlow</h1>
            <p className="text-sm text-slate-400 mt-1">Ticket Management System</p>
          </div>

          <button
            onClick={onClose}
            className="md:hidden p-2 rounded-xl bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="space-y-3">
          <Link
            to={role === "admin" ? "/admin" : "/dashboard"}
            className={itemClass(role === "admin" ? "/admin" : "/dashboard")}
            onClick={onClose}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          {role === "customer" && (
            <Link
              to="/tickets/new"
              className={itemClass("/tickets/new")}
              onClick={onClose}
            >
              <PlusCircle size={18} />
              Create Ticket
            </Link>
          )}

          <Link
            to="/notifications"
            className={itemClass("/notifications")}
            onClick={onClose}
          >
            <Bell size={18} />
            Notifications
          </Link>

          {role === "admin" && (
            <Link
              to="/admin"
              className={itemClass("/admin")}
              onClick={onClose}
            >
              <Shield size={18} />
              Admin Panel
            </Link>
          )}
        </nav>
      </aside>
    </>
  );
}