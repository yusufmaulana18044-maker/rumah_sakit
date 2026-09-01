import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import Layout from "./pages/layout";
import AdminDashboard from "./pages/AdminDashboard";

// 📦 IMPORT HALAMAN PEGAWAI & DOKUMEN
import EmployeeList from "./pages/EmployeeList";
import EmployeeDetail from "./pages/EmployeeDetail";
import EmployeeForm from "./pages/EmployeeForm";
import Dokumen from "./pages/Dokumen";

// 📦 IMPORT HALAMAN RIWAYAT PENDIDIKAN
import RiwayatPendidikan from "./pages/RiwayatPendidikan";

// 📦 IMPORT HALAMAN STATUS PEGAWAI
import StatusPegawai from "./pages/StatusPegawai";

// 📦 IMPORT HALAMAN PROFILE & SETTINGS
import Profile from "./pages/profile";
import SettingsPage from "./pages/settings";
import KategoriDetail from "./pages/KategoriDetail";
import UploadDokumen from "./pages/UploadDokumen";

// ✅ IMPORT LANGUAGE PROVIDER
import { LanguageProvider } from "./context/LanguageContext";

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          {/* Route tanpa Layout (halaman login/register) */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* ROUTE ADMIN */}
          <Route path="/admin" element={<AdminDashboard />} />
          
          {/* Route dengan Layout */}
          <Route path="/dashboard" element={<Layout title="Dashboard Utama"><Dashboard /></Layout>} />
          
          {/* ROUTE UNTUK PEGAWAI & DOKUMEN */}
          <Route path="/employees" element={<Layout><EmployeeList /></Layout>} />
          <Route path="/employees/new" element={<Layout><EmployeeForm /></Layout>} />
          <Route path="/employees/:id" element={<Layout><EmployeeDetail /></Layout>} />
          <Route path="/employees/:id/edit" element={<Layout><EmployeeForm /></Layout>} />
          
          {/* ROUTE DOKUMEN */}
          <Route path="/dokumen" element={<Layout><Dokumen /></Layout>} />
          <Route path="/dokumen/upload" element={<Layout><UploadDokumen /></Layout>} />
          
          {/* ROUTE RIWAYAT PENDIDIKAN */}
          <Route path="/riwayat-pendidikan" element={<Layout><RiwayatPendidikan /></Layout>} />
          <Route path="/riwayat-pendidikan/new" element={<Layout><RiwayatPendidikan /></Layout>} />
          
          {/* ROUTE STATUS PEGAWAI */}
          <Route path="/status-pegawai" element={<Layout><StatusPegawai /></Layout>} />
          
          <Route path="/kategori/:id" element={<Layout><KategoriDetail /></Layout>} />
          <Route path="/kategori/:id/upload" element={<Layout><UploadDokumen /></Layout>} />
          
          {/* ROUTE UNTUK PROFILE & SETTINGS */}
          <Route path="/profile" element={<Layout><Profile /></Layout>} />
          <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;