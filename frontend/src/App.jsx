import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import User from "./pages/user";
import Admin from "./pages/admin";
import Laporan from "./pages/laporan";
import Petugas from "./pages/petugas";
import Settings from "./pages/settings";
import TiketSaya from "./pages/tiketsaya";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/user" element={<User />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/laporan" element={<Laporan />} />
        <Route path="/petugas" element={<Petugas />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/tiketsaya" element={<TiketSaya />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;