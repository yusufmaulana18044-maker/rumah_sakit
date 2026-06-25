import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import User from "./pages/user";
import Admin from "./pages/admin";
import Layout from "./pages/layout";

// 📦 IMPORT HALAMAN BARU (PEGAWAI & DOKUMEN)
import EmployeeList from "./pages/EmployeeList";
import EmployeeDetail from "./pages/EmployeeDetail";
import EmployeeForm from "./pages/EmployeeForm";
import Test from "./pages/test";
import SimpleLogin from "./pages/simple-login";

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
        <Route path="/simple-login" element={<SimpleLogin />} />
        
        {/* Route dengan Layout (dashboard & admin) */}
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/user" element={<Layout><User /></Layout>} />
        <Route path="/admin" element={<Layout><Admin /></Layout>} />
        
        {/* 🆕 ROUTE BARU UNTUK PEGAWAI & DOKUMEN */}
        <Route path="/employees" element={<Layout><EmployeeList /></Layout>} />
        <Route path="/employees/new" element={<Layout><EmployeeForm /></Layout>} />
        <Route path="/employees/:id" element={<Layout><EmployeeDetail /></Layout>} />
        <Route path="/employees/:id/edit" element={<Layout><EmployeeForm /></Layout>} />
        
        {/* 🆕 ROUTE BARU UNTUK PROFILE & SETTINGS */}
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
        
        <Route path="/test" element={<Test />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;