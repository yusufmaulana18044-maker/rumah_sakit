import React from "react";
import { LogOut, Menu, X, Users, Ticket } from "lucide-react";
import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

const Layout = ({ children, title = "Dashboard" }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    if (window.confirm("Yakin ingin logout?")) {
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      localStorage.removeItem("username");
      navigate("/");
    }
  };

  // Fungsi untuk cek link aktif
  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gray-800 text-white flex flex-col transition-all duration-300`}
      >
        {/* Logo */}
        <div className="p-6 flex items-center gap-3 border-b border-gray-700">
          <h1 className="text-lg font-semibold">🏥</h1>
          {sidebarOpen && <h1 className="text-lg font-semibold">RS Hardjono</h1>}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6">
          <ul className="space-y-2">
            {/* Menu Dashboard */}
            <li>
              <Link
                to="/dashboard"
                className={`flex items-center gap-4 px-4 py-2 rounded transition ${
                  isActive("/dashboard")
                    ? "bg-teal-600 text-white"
                    : "text-gray-200 hover:bg-gray-700"
                }`}
              >
                <span>📊</span>
                {sidebarOpen && <span>Dashboard</span>}
              </Link>
            </li>

            {/* 🆕 MENU BARU: Data Pegawai (hanya untuk admin) */}
            {role === "admin" && (
              <li>
                <Link
                  to="/employees"
                  className={`flex items-center gap-4 px-4 py-2 rounded transition ${
                    isActive("/employees") || location.pathname.startsWith("/employees/")
                      ? "bg-teal-600 text-white"
                      : "text-gray-200 hover:bg-gray-700"
                  }`}
                >
                  <Users className="w-5 h-5" />
                  {sidebarOpen && <span>Data Pegawai</span>}
                </Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded transition"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded transition"
              >
                {sidebarOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </button>
              <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-4">
              <div className="text-right text-sm">
                <p className="font-semibold text-gray-800 capitalize">{username || "User"}</p>
                <p className="text-gray-600 text-xs capitalize">{role || "role"}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {username?.[0]?.toUpperCase() || "U"}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;