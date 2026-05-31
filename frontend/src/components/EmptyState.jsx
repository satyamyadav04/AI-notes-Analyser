const EmptyState = ({ title, description, action }) => (
  <div className="glass-panel p-8 text-center">
    <h3 className="text-xl font-semibold text-white">{title}</h3>
    <p className="mt-3 text-slate-400">{description}</p>
    {action ? <div className="mt-5">{action}</div> : null}
  </div>
);

export default EmptyState;
