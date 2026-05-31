const Loader = ({ label = "Loading..." }) => (
  <div className="flex min-h-[40vh] items-center justify-center">
    <div className="glass-panel flex items-center gap-3 px-6 py-4 text-slate-200 shadow-glow">
      <div className="h-3 w-3 animate-pulse rounded-full bg-brand-400" />
      <span>{label}</span>
    </div>
  </div>
);

export default Loader;
