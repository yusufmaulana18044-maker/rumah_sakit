import React from "react";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Layout = ({ children, title = "Dashboard" }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
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
          <h1 className="text-lg font-semibold">RS</h1>
          {sidebarOpen && <h1 className="text-lg font-semibold">Rumah Sakit</h1>}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6">
          <ul className="space-y-2">
            <li>
              <a
                href="/dashboard"
                className="flex items-center gap-4 px-4 py-2 rounded text-gray-200 hover:bg-gray-700 transition"
              >
                <span>📊</span>
                {sidebarOpen && <span>Dashboard</span>}
              </a>
            </li>
            <li>
              <a
                href={role === "admin" ? "/admin" : "/user"}
                className="flex items-center gap-4 px-4 py-2 rounded text-gray-200 hover:bg-gray-700 transition"
              >
                <span>📋</span>
                {sidebarOpen && <span>{role === "admin" ? "Tiket Semua" : "Tiket Saya"}</span>}
              </a>
            </li>
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
                <p className="font-semibold text-gray-800 capitalize">{username}</p>
                <p className="text-gray-600 text-xs capitalize">{role}</p>
              </div>
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-semibold">
                {username?.[0]?.toUpperCase()}
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