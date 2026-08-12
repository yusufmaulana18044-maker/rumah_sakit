import { supabase } from "../supabase";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const register = async () => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (!username || !nama || !email || !password || !confirmPassword) {
      setError("Semua field harus diisi");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Password tidak cocok");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      setIsLoading(false);
      return;
    }

    try {
      // Cek apakah username atau email sudah ada di tabel users
      const { data: existing, error: existingErr } = await supabase
        .from("users")
        .select("id, username, email")
        .or(`username.eq.${username},email.eq.${email}`)
        .maybeSingle();

      if (existingErr) {
        console.log("Existing check error:", existingErr);
        setError("Gagal memeriksa data user. Silakan coba lagi nanti.");
        setIsLoading(false);
        return;
      }

      if (existing) {
        if (existing.username === username) {
          setError("Username sudah terdaftar, gunakan username lain");
        } else if (existing.email === email) {
          setError("Email sudah terdaftar. Silakan login atau gunakan email lain");
        } else {
          setError("User sudah terdaftar di sistem. Silakan login");
        }
        setIsLoading(false);
        return;
      }

      // Register di Supabase Auth, simpan nama di metadata auth jika diperlukan.
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { nama },
        },
      });

      if (authError) {
        console.log("Auth error:", authError);
        const msg = authError.message || JSON.stringify(authError);
        if (msg.toLowerCase().includes("already registered") || msg.toLowerCase().includes("user already")) {
          setError("Email sudah terdaftar. Silakan login atau gunakan email lain");
        } else {
          setError(msg);
        }
        setIsLoading(false);
        return;
      }

      // ambil id user kalau tersedia (kadang kosong jika perlu konfirmasi)
      const authUserId = authData?.user?.id || null;

  // Update data user yang sudah dibuat oleh Supabase/trigger
if (authUserId) {
  const { error: updateError } = await supabase
    .from("users")
    .update({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      role: "user",
    })
    .eq("id", authUserId);

  if (updateError) {
    console.error("UPDATE USER ERROR:", updateError);

    setError(
      `Akun berhasil dibuat, tetapi data user gagal disimpan: ${updateError.message}`
    );

    setIsLoading(false);
    return;
  }
}

      setSuccess("Pendaftaran berhasil! Mengarahkan ke halaman login...");
      // Clear form
      setUsername("");
      setNama("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      // Auto redirect ke login page setelah 2 detik
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      console.log("Catch error:", err);
      setError("Terjadi kesalahan: " + (err.message || JSON.stringify(err)));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      register();
    }
  };

  // CSS animasi slow zoom (sama seperti login)
  const animationStyle = `
    @keyframes slowZoom {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    .animate-slow-zoom {
      animation: slowZoom 10s ease-in-out infinite;
    }
  `;

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <style>{animationStyle}</style>

      {/* Background dengan blur + gerak slow zoom */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm animate-slow-zoom"
        style={{ backgroundImage: "url('/halamanrs2.jpeg')" }}
      />

      {/* Overlay gelap tipis biar card lebih kontras */}
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header gradient */}
          <div className="bg-gradient-to-r from-blue-900 to-teal-600 px-8 pt-8 pb-6">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 p-3 rounded-2xl">
                <img
                  src="/logo-rsud-harjonos.png"
                  alt="Logo RSUD"
                  className="w-16 h-16 object-contain"
                />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white text-center">Daftar Akun</h1>
            <p className="text-teal-100 text-center mt-1 text-sm">Buat akun baru</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
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

            {/* Username */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Username
              </label>
              <input
                type="text"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:border-gray-700 focus:outline-none"
              />
            </div>

            {/* Nama Panjang */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Nama Panjang
              </label>
              <input
                type="text"
                placeholder="Masukkan nama panjang"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:border-gray-700 focus:outline-none"
              />
            </div>

            {/* Email */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="Masukkan email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:border-gray-700 focus:outline-none"
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:border-gray-700 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-2.5 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Konfirmasi Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Ulangi password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:border-gray-700 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-2.5 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Register Button */}
            <button
              onClick={register}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-800 to-teal-600 hover:from-blue-900 hover:to-teal-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50 shadow-md"
            >
              {isLoading ? "Loading..." : "Daftar"}
            </button>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Sudah punya akun?{" "}
                <button
                  onClick={() => navigate("/")}
                  className="text-gray-800 font-semibold hover:underline"
                >
                  Login di sini
                </button>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-blue-50 to-teal-50 px-6 py-3 text-center border-t border-gray-100">
            <p className="text-gray-400 text-[10px]">© 2026 RSUD Dr. HARDJONO PONOROGO</p>
          </div>
        </div>
      </div>
    </div>
  );
}