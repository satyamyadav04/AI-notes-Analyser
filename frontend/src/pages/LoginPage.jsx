import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import { login } from "../services/authService";

const LoginPage = () => {
  const navigate = useNavigate();
  const { saveAuth } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await login(form);
      saveAuth(data);
      navigate("/dashboard");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <div className="glass-panel p-8">
        <h1 className="font-display text-4xl font-bold text-white">Welcome back</h1>
        <p className="mt-3 text-slate-400">Sign in to continue analyzing your notes.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            className="input-field"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          />
          <input
            className="input-field"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          />
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          <button type="submit" className="primary-button w-full" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-400">
          New here? <Link to="/register" className="text-brand-300">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
