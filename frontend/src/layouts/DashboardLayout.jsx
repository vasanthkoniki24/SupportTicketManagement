// import Sidebar from "../components/Sidebar";
// import Navbar from "../components/Navbar";

// export default function DashboardLayout({ children }) {
//   return (
//     <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#172554,_#0f172a_45%,_#020617)] text-white">
//       <div className="flex">
//         <Sidebar />
//         <div className="flex-1 min-h-screen">
//           <Navbar />
//           <main className="p-6 md:p-8">{children}</main>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className="min-h-screen text-white"
      style={{
        background: "radial-gradient(circle at top, #172554, #0f172a 45%, #020617)",
      }}
    >
      <div className="flex">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 min-h-screen md:ml-0">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="p-4 md:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}