import { Link, NavLink, useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";

const navLinkClass = ({ isActive }) =>
  `transition ${isActive ? "text-white" : "text-slate-400 hover:text-white"}`;

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="font-display text-xl font-bold text-white">
          AI Notes Analyzer
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/upload" className={navLinkClass}>
                Upload
              </NavLink>
              <NavLink to="/profile" className={navLinkClass}>
                Profile
              </NavLink>
              <button type="button" onClick={handleLogout} className="secondary-button !py-2 !text-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
              <Link to="/register" className="primary-button !py-2 !text-sm">
                Start Free
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
