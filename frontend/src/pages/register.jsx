import { supabase } from "../supabase";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, Heart, ArrowRight } from "lucide-react";
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
      // Cek apakah username sudah ada
      const { data: existingUsername, error: userError } = await supabase
        .from("users")
        .select("username")
        .eq("username", username)
        .maybeSingle();

      if (existingUsername) {
        setError("Username sudah terdaftar, gunakan username lain");
        setIsLoading(false);
        return;
      }

      // Register di Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        console.log("Auth error:", authError);
        if (authError.message.includes("User already registered")) {
          setError("Email sudah terdaftar. Silakan login atau gunakan email lain");
        } else {
          setError(authError.message);
        }
        setIsLoading(false);
        return;
      }

      console.log("Auth success, inserting user data...", authData.user.id);

      // Cek apakah user sudah ada di users table (pre-check sebelum insert)
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("id", authData.user.id)
        .maybeSingle();

      if (existingUser) {
        setError("User sudah terdaftar di sistem. Silakan login");
        setIsLoading(false);
        return;
      }

      // Insert ke users table
      const { error: insertError, data: insertData } = await supabase.from("users").insert([
        {
          id: authData.user.id,
          username,
          email,
          role: "user",
        },
      ]);

      console.log("Insert result:", { error: insertError, data: insertData });

      if (insertError) {
        console.log("Insert error details:", insertError);
        if (insertError.code === "23505") {
          setError("User atau email sudah terdaftar. Silakan gunakan data lain");
        } else {
          setError("Gagal menyimpan data user: " + (insertError.message || JSON.stringify(insertError)));
        }
      } else {
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
      }
    } catch (err) {
      console.log("Catch error:", err);
      setError("Terjadi kesalahan: " + err.message);
    }
    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      register();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gray-800 px-8 pt-8 pb-6">
            <h1 className="text-2xl font-bold text-white text-center">Daftar Akun</h1>
            <p className="text-gray-300 text-center mt-1 text-sm">Buat akun baru</p>
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
              className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 rounded transition disabled:opacity-50"
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
        </div>
      </div>
    </div>
  );
}