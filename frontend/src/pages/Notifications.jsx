// import { useEffect, useState } from "react";
// import DashboardLayout from "../layouts/DashboardLayout";
// import API from "../api/axios";
// import toast from "react-hot-toast";
// import { Bell } from "lucide-react";

// export default function Notifications() {
//   const [notifications, setNotifications] = useState([]);

//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   const fetchNotifications = async () => {
//     try {
//       const res = await API.get("/notifications");
//       setNotifications(res.data);
//     } catch (error) {
//       toast.error(error?.response?.data?.detail || "Failed to load notifications");
//     }
//   };

//   return (
//     <DashboardLayout>
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold">Notifications</h1>
//         <p className="text-slate-400 mt-1">
//           Stay updated with ticket events and support activity.
//         </p>
//       </div>

//       <div className="space-y-4">
//         {notifications.length === 0 ? (
//           <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-300">
//             No notifications yet.
//           </div>
//         ) : (
//           notifications.map((item) => (
//             <div
//               key={item.id}
//               className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 flex items-start gap-4"
//             >
//               <div className="p-3 rounded-2xl bg-cyan-500/20">
//                 <Bell size={18} className="text-cyan-300" />
//               </div>
//               <div>
//                 <p className="text-slate-100">{item.message}</p>
//                 <p className="text-xs text-slate-400 mt-1">{item.created_at}</p>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </DashboardLayout>
//   );
// }


import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";
import toast from "react-hot-toast";
import { Bell } from "lucide-react";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications(true);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async (silent = false) => {
    try {
      const res = await API.get("/notifications");
      setNotifications(res.data);
    } catch (error) {
      if (!silent) {
        toast.error(error?.response?.data?.detail || "Failed to load notifications");
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-slate-400 mt-1">
            Stay updated with ticket events and support activity.
          </p>
        </div>
        <span className="text-xs text-slate-400">Auto-refresh every 5 sec</span>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-300">
            No notifications yet.
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 flex items-start gap-4"
            >
              <div className="p-3 rounded-2xl bg-cyan-500/20">
                <Bell size={18} className="text-cyan-300" />
              </div>
              <div>
                <p className="text-slate-100">{item.message}</p>
                <p className="text-xs text-slate-400 mt-1">{item.created_at}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}