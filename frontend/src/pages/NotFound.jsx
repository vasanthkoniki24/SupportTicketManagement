import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white px-6">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-slate-400 mb-6">Page not found</p>
      <Link
        to="/login"
        className="px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-600 transition"
      >
        Go to Login
      </Link>
    </div>
  );
}