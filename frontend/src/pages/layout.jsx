// src/components/Layout.jsx
import React from "react";
import { LogOut, Menu, X, Users, Settings, User, ChevronDown, FileText } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../supabase";

// 14 Kategori Dokumen
const KATEGORI = [
  { id: 1, nama: "SK Pangkat (Mulai CPNS)" },
  { id: 2, nama: "SK Fungsional" },
  { id: 3, nama: "Data Pribadi" },
  { id: 4, nama: "Riwayat Pendidikan" },
  { id: 5, nama: "Uraian Tugas" },
  { id: 6, nama: "SPK RKK (Khusus Nakes)" },
  { id: 7, nama: "Penilaian Kinerja (SKP)" },
  { id: 8, nama: "SPMT" },
  { id: 9, nama: "Orientasi" },
  { id: 10, nama: "KGB" },
  { id: 11, nama: "Pengembangan Kompetensi" },
  { id: 12, nama: "Riwayat Jabatan" },
  { id: 13, nama: "Check Up" },
  { id: 14, nama: "Lain-lain" },
];

// Page Transition Component
const PageTransition = ({ children }) => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex-1"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

const Layout = ({ children, title = "Dashboard" }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // ✅ State untuk Mobile
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isLoadingPhoto, setIsLoadingPhoto] = useState(true);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");
  const userId = JSON.parse(localStorage.getItem("user") || "{}")?.id;

  // Ambil foto profil dari Supabase
  useEffect(() => {
    const fetchProfilePhoto = async () => {
      if (!userId) {
        setIsLoadingPhoto(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("avatar")
          .eq("user_id", userId)
          .single();

        if (error) {
          console.error("Error fetching profile photo:", error);
          setIsLoadingPhoto(false);
          return;
        }

        if (data?.avatar) {
          setProfilePhoto(data.avatar);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoadingPhoto(false);
      }
    };

    fetchProfilePhoto();
  }, [userId]);

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

  const isActive = (path) => location.pathname === path;
  const isKategoriActive = (id) => location.pathname === `/kategori/${id}`;

  // Render Avatar
  const renderAvatar = () => {
    if (isLoadingPhoto) {
      return (
        <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold animate-pulse">
          {username?.[0]?.toUpperCase() || "U"}
        </div>
      );
    }

    if (profilePhoto && profilePhoto.startsWith("data:image/")) {
      return (
        <img
          src={profilePhoto}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
        />
      );
    }

    if (profilePhoto && profilePhoto.startsWith("http")) {
      return (
        <img
          src={profilePhoto}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
        />
      );
    }

    // Default avatar dengan inisial
    return (
      <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
        {username?.[0]?.toUpperCase() || "U"}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-72" : "w-20"
        } bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col transition-all duration-300 shadow-lg overflow-y-auto ${
          isMobileMenuOpen ? "fixed z-50 h-full" : "hidden md:flex"
        }`}
      >
        {/* Logo */}
        <div className="p-6 flex items-center gap-3 border-b border-gray-700 hover:bg-gray-800 transition cursor-pointer">
          <div className="text-3xl">🏥</div>
          {sidebarOpen && <h1 className="text-lg font-bold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">RSUD Dr. Harjono</h1>}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {/* Menu Dashboard */}
            <li>
              <Link
                to="/dashboard"
                className={`flex items-center gap-4 px-4 py-2.5 rounded-lg transition ${
                  isActive("/dashboard")
                    ? "bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-md"
                    : "text-gray-200 hover:bg-gray-700"
                }`}
              >
                <span>📊</span>
                {sidebarOpen && <span className="font-medium text-sm">Dashboard</span>}
              </Link>
            </li>

            {/* Menu Data Pegawai */}
            {role === "admin" && (
              <li>
                <Link
                  to="/employees"
                  className={`flex items-center gap-4 px-4 py-2.5 rounded-lg transition ${
                    isActive("/employees") || location.pathname.startsWith("/employees/")
                      ? "bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-md"
                      : "text-gray-200 hover:bg-gray-700"
                  }`}
                >
                  <Users className="w-5 h-5" />
                  {sidebarOpen && <span className="font-medium text-sm">Data Pegawai</span>}
                </Link>
              </li>
            )}

            {/* Divider - Kategori Dokumen */}
            {sidebarOpen && (
              <li className="pt-3 pb-1">
                <div className="flex items-center gap-2 px-4">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Kategori Dokumen</span>
                </div>
              </li>
            )}
            {!sidebarOpen && (
              <li className="pt-3 pb-1">
                <div className="border-t border-gray-700"></div>
              </li>
            )}

            {/* 14 Kategori */}
            {KATEGORI.map((kat) => (
              <li key={kat.id}>
                <Link
                  to={`/kategori/${kat.id}`}
                  className={`flex items-center gap-4 px-4 py-2 rounded-lg transition ${
                    isKategoriActive(kat.id)
                      ? "bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-md"
                      : "text-gray-200 hover:bg-gray-700"
                  }`}
                >
                  <span className="text-xs font-mono bg-gray-700 text-gray-300 w-6 h-6 rounded flex items-center justify-center">
                    {String(kat.id).padStart(2, "0")}
                  </span>
                  {sidebarOpen && (
                    <span className="font-medium text-sm truncate">{kat.nama}</span>
                  )}
                </Link>
              </li>
            ))}

            {/* Divider */}
            {sidebarOpen && <li className="py-2"><div className="border-t border-gray-700"></div></li>}

            {/* Menu Profil */}
            <li>
              <Link
                to="/profile"
                className={`flex items-center gap-4 px-4 py-2.5 rounded-lg transition ${
                  isActive("/profile")
                    ? "bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-md"
                    : "text-gray-200 hover:bg-gray-700"
                }`}
              >
                <User className="w-5 h-5" />
                {sidebarOpen && <span className="font-medium text-sm">Profil Saya</span>}
              </Link>
            </li>

            {/* Menu Pengaturan */}
            <li>
              <Link
                to="/settings"
                className={`flex items-center gap-4 px-4 py-2.5 rounded-lg transition ${
                  isActive("/settings")
                    ? "bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-md"
                    : "text-gray-200 hover:bg-gray-700"
                }`}
              >
                <Settings className="w-5 h-5" />
                {sidebarOpen && <span className="font-medium text-sm">Pengaturan</span>}
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

      {/* Overlay untuk Mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-30 border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              {/* Tombol Hamburger untuk Mobile */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>

              {/* Tombol Hamburger untuk Desktop */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden md:block p-2 hover:bg-gray-100 rounded-lg transition"
              >
                {sidebarOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </button>
              <h1 className="text-xl font-semibold text-gray-800 truncate">{title}</h1>
            </div>

            {/* User Profile Dropdown DENGAN FOTO */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-lg transition group"
              >
                <div className="text-right text-sm hidden sm:block">
                  <p className="font-semibold text-gray-800 capitalize">{username || "User"}</p>
                  <p className="text-gray-600 text-xs capitalize">{role || "role"}</p>
                </div>
                
                {/* AVATAR DENGAN FOTO PROFIL */}
                {renderAvatar()}
                
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
        <main className="flex-1 p-6 overflow-auto">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </div>
    </div>
  );
};

export default Layout;