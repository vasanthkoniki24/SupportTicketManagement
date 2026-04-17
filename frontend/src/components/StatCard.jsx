import { motion } from "framer-motion";

export default function StatCard({ title, value, subtitle }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl"
    >
      <p className="text-sm text-slate-400 mb-2">{title}</p>
      <h3 className="text-3xl font-bold">{value}</h3>
      {subtitle && <p className="text-sm text-slate-500 mt-2">{subtitle}</p>}
    </motion.div>
  );
}