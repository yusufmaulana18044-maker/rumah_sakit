import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import Layout from "../components/layout";

export default function Settings() {
  const [username, setUsername] = useState("");
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setNama(user.nama || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const updateProfile = async () => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (!username || !nama || !email) {
      setError("Semua field harus diisi");
      setIsLoading(false);
      return;
    }

    if (password && password !== confirmPassword) {
      setError("Password tidak cocok");
      setIsLoading(false);
      return;
    }

    const updateData = {
      username,
      nama,
      email,
    };

    if (password) {
      updateData.password = password;
    }

    const { error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", user.id);

    if (error) {
      setError("Gagal update profil");
      console.log(error);
    } else {
      setSuccess("Profil berhasil diupdate");
      // Update localStorage
      const updatedUser = { ...user, ...updateData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      localStorage.setItem("username", username);
    }
    setIsLoading(false);
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Pengaturan Profil</h1>

        <div className="bg-white rounded shadow p-6">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-300 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-3 bg-green-50 border border-green-300 rounded text-green-700 text-sm">
              {success}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan username"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan nama lengkap"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan email"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Password Baru (Opsional)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan password baru"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Konfirmasi Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Konfirmasi password baru"
              />
            </div>

            <button
              onClick={updateProfile}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition disabled:opacity-50"
            >
              {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}