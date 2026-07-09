import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import Layout from "./pages/layout";

// 📦 IMPORT HALAMAN PEGAWAI & DOKUMEN
import EmployeeList from "./pages/EmployeeList";
import EmployeeDetail from "./pages/EmployeeDetail";
import EmployeeForm from "./pages/EmployeeForm";

// 📦 IMPORT HALAMAN PROFILE & SETTINGS
import Profile from "./pages/profile";
import SettingsPage from "./pages/settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route tanpa Layout (halaman login/register) */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Route dengan Layout */}
        <Route path="/dashboard" element={<Layout title="Dashboard Utama"><Dashboard /></Layout>} />
        
        {/* ROUTE UNTUK PEGAWAI & DOKUMEN */}
        <Route path="/employees" element={<Layout><EmployeeList /></Layout>} />
        <Route path="/employees/new" element={<Layout><EmployeeForm /></Layout>} />
        <Route path="/employees/:id" element={<Layout><EmployeeDetail /></Layout>} />
        <Route path="/employees/:id/edit" element={<Layout><EmployeeForm /></Layout>} />
        
        {/* ROUTE UNTUK PROFILE & SETTINGS */}
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;