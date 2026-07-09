import React from "react";
import { LogOut, Menu, X, Users, Ticket, Settings, User, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

const Layout = ({ children, title = "Dashboard" }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col transition-all duration-300 shadow-lg`}
      >
        {/* Logo */}
        <div className="p-6 flex items-center gap-3 border-b border-gray-700 hover:bg-gray-800 transition cursor-pointer">
          <div className="text-3xl">🏥</div>
          {sidebarOpen && <h1 className="text-lg font-bold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">RS Hardjono</h1>}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 overflow-y-auto">
          <ul className="space-y-2">
            {/* Menu Dashboard */}
            <li>
              <Link
                to="/dashboard"
                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition ${
                  isActive("/dashboard")
                    ? "bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-md"
                    : "text-gray-200 hover:bg-gray-700"
                }`}
              >
                <span>📊</span>
                {sidebarOpen && <span className="font-medium">Dashboard</span>}
              </Link>
            </li>

            {/* 🆕 MENU BARU: Data Pegawai (hanya untuk admin) */}
            {role === "admin" && (
              <li>
                <Link
                  to="/employees"
                  className={`flex items-center gap-4 px-4 py-3 rounded-lg transition ${
                    isActive("/employees") || location.pathname.startsWith("/employees/")
                      ? "bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-md"
                      : "text-gray-200 hover:bg-gray-700"
                  }`}
                >
                  <Users className="w-5 h-5" />
                  {sidebarOpen && <span className="font-medium">Data Pegawai</span>}
                </Link>
              </li>
            )}

            {/* Divider */}
            {sidebarOpen && <li className="py-2"><div className="border-t border-gray-700"></div></li>}

            {/* Menu Profil */}
            <li>
              <Link
                to="/profile"
                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition ${
                  isActive("/profile")
                    ? "bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-md"
                    : "text-gray-200 hover:bg-gray-700"
                }`}
              >
                <User className="w-5 h-5" />
                {sidebarOpen && <span className="font-medium">Profil Saya</span>}
              </Link>
            </li>

            {/* Menu Pengaturan */}
            <li>
              <Link
                to="/settings"
                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition ${
                  isActive("/settings")
                    ? "bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-md"
                    : "text-gray-200 hover:bg-gray-700"
                }`}
              >
                <Settings className="w-5 h-5" />
                {sidebarOpen && <span className="font-medium">Pengaturan</span>}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 bg-red-700 hover:bg-red-800 text-white rounded-lg transition font-medium"
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
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                {sidebarOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </button>
              <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
            </div>

            {/* User Profile Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-lg transition group"
              >
                <div className="text-right text-sm">
                  <p className="font-semibold text-gray-800 capitalize">{username || "User"}</p>
                  <p className="text-gray-600 text-xs capitalize">{role || "role"}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold group-hover:shadow-lg transition">
                  {username?.[0]?.toUpperCase() || "U"}
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-600 transition ${userMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
                  <Link
                    to="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-teal-50 transition"
                  >
                    <User className="w-4 h-4 text-teal-600" />
                    <span>Profil Saya</span>
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-teal-50 transition border-t border-gray-100"
                  >
                    <Settings className="w-4 h-4 text-teal-600" />
                    <span>Pengaturan</span>
                  </Link>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition border-t border-gray-100 font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
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