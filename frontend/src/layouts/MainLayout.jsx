import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";

const MainLayout = () => (
  <div className="min-h-screen bg-hero-grid bg-hero-grid">
    <Navbar />
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Outlet />
    </main>
  </div>
);

export default MainLayout;
