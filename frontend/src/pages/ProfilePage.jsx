import useAuth from "../hooks/useAuth";

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-3xl">
      <div className="glass-panel p-8">
        <p className="text-sm uppercase tracking-[0.35em] text-brand-300">Profile</p>
        <h1 className="mt-4 font-display text-4xl font-bold text-white">Account Overview</h1>

        <div className="mt-8 grid gap-4">
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
            <p className="text-sm text-slate-400">Name</p>
            <p className="mt-2 text-lg font-semibold text-white">{user?.name}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
            <p className="text-sm text-slate-400">Email</p>
            <p className="mt-2 text-lg font-semibold text-white">{user?.email}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
            <p className="text-sm text-slate-400">Joined</p>
            <p className="mt-2 text-lg font-semibold text-white">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
