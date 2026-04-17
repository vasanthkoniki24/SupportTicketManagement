// import { useNavigate } from "react-router-dom";
// import { getUser, logout } from "../utils/auth";

// export default function Navbar() {
//   const navigate = useNavigate();
//   const user = getUser();

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   return (
//     <div className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/40 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
//       <div>
//         <h2 className="text-lg font-semibold">Welcome back</h2>
//         <p className="text-sm text-slate-400">
//           {user?.name} • {user?.role}
//         </p>
//       </div>

//       <button
//         onClick={handleLogout}
//         className="px-4 py-2 rounded-xl bg-red-500/90 hover:bg-red-500 transition"
//       >
//         Logout
//       </button>
//     </div>
//   );
// }


import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { getUser, logout } from "../utils/auth";

export default function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/40 backdrop-blur-xl px-4 md:px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-xl bg-white/10 border border-white/10"
        >
          <Menu size={18} />
        </button>

        <div>
          <h2 className="text-lg font-semibold">Welcome back</h2>
          <p className="text-sm text-slate-400">
            {user?.name} • {user?.role}
          </p>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="px-4 py-2 rounded-xl bg-red-500/90 hover:bg-red-500 transition"
      >
        Logout
      </button>
    </div>
  );
}