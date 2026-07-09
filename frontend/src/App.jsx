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
<<<<<<< HEAD
=======

import SimpleLogin from "./pages/simple-login";
>>>>>>> fbf0fe958898519d36a95a228535fc3f9ebf5cd8

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
        
<<<<<<< HEAD
        {/* Route dengan Layout */}
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
=======
        {/* Route dengan Layout (dashboard & admin) */}
        <Route path="/dashboard" element={<Layout title="Dashboard Utama"><Dashboard /></Layout>} />
        <Route path="/user" element={<Layout><User /></Layout>} />
        <Route path="/admin" element={<Layout><Admin /></Layout>} />
>>>>>>> fbf0fe958898519d36a95a228535fc3f9ebf5cd8
        
        {/* ROUTE UNTUK PEGAWAI & DOKUMEN */}
        <Route path="/employees" element={<Layout><EmployeeList /></Layout>} />
        <Route path="/employees/new" element={<Layout><EmployeeForm /></Layout>} />
        <Route path="/employees/:id" element={<Layout><EmployeeDetail /></Layout>} />
        <Route path="/employees/:id/edit" element={<Layout><EmployeeForm /></Layout>} />
        
        {/* ROUTE UNTUK PROFILE & SETTINGS */}
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
<<<<<<< HEAD
=======
        
        {/* Route /test dihapus karena file tidak ada */}
>>>>>>> fbf0fe958898519d36a95a228535fc3f9ebf5cd8
      </Routes>
    </BrowserRouter>
  );
}

export default App;