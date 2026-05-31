const StatCard = ({ label, value, hint }) => (
  <div className="glass-panel p-5">
    <p className="text-sm text-slate-400">{label}</p>
    <h3 className="mt-3 text-3xl font-bold text-white">{value}</h3>
    <p className="mt-2 text-sm text-slate-500">{hint}</p>
  </div>
);

export default StatCard;
