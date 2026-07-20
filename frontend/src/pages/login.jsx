import { supabase } from "../supabase";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async () => {
    setIsLoading(true);
    setError("");

    if (!username || !password) {
      setError("Username dan password harus diisi");
      setIsLoading(false);
      return;
    }

    try {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("email, role, id")
        .eq("username", username)
        .single();

      if (userError || !userData) {
        setError("Username tidak ditemukan");
        setIsLoading(false);
        return;
      }

      const { email, role } = userData;

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError("Password salah");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("username", username);
      localStorage.setItem("role", role);

      // ✅ SEMUA USER LANGSUNG KE DASHBOARD!
      window.location.href = "/dashboard";

    } catch (err) {
      setError("Terjadi kesalahan, silakan coba lagi");
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      login();
    }
  };

  // CSS animasi slow zoom
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

      {/* Card Login */}
      <div className="relative z-10 w-full max-w-sm px-4">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header hijau + biru khas RS */}
          <div className="bg-gradient-to-r from-blue-900 to-teal-600 px-6 pt-8 pb-6 relative overflow-hidden">
            <div className="absolute -right-8 -top-8 opacity-10 pointer-events-none">
              <svg className="w-32 h-32 text-white" viewBox="0 0 100 100" fill="currentColor">
                <path d="M50 20 L55 35 L70 35 L58 45 L62 60 L50 50 L38 60 L42 45 L30 35 L45 35 Z" />
                <path d="M50 15 L47 25 L53 25 Z" />
                <circle cx="50" cy="30" r="3" />
                <path d="M40 65 L50 70 L60 65 L55 75 L45 75 Z" />
              </svg>
            </div>

            <div className="flex justify-center mb-4">
              <div className="bg-white/20 p-3 rounded-2xl">
                <img
                  src="/logo-rsud-harjonos.png"
                  alt="Logo RSUD Dr. Hardjono"
                  className="w-20 h-20 object-contain"
                />
              </div>
            </div>

            <h1 className="text-xl font-bold text-white text-center tracking-wide">
              RSUD Dr. HARDJONO
            </h1>
            <p className="text-teal-100 text-center mt-1 text-sm tracking-wider">
              PONOROGO
            </p>
          </div>

          {/* Form Login */}
          <div className="px-6 py-6">
            {error && (
              <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-gray-700 text-xs font-semibold mb-1">
                Username
              </label>
              <input
                type="text"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100 transition bg-gray-50"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-xs font-semibold mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100 transition bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2 text-gray-400 hover:text-teal-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              onClick={login}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-800 to-teal-600 hover:from-blue-900 hover:to-teal-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50 shadow-md text-sm"
            >
              {isLoading ? "Loading..." : "Login"}
            </button>

            <div className="mt-4 text-center">
              <p className="text-gray-500 text-xs">
                Belum punya akun?{" "}
                <button
                  onClick={() => navigate("/register")}
                  className="text-teal-600 font-semibold hover:text-teal-700 hover:underline transition"
                >
                  Daftar di sini
                </button>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-blue-50 to-teal-50 px-6 py-3 text-center border-t border-gray-100">
            <p className="text-gray-400 text-[10px]">
              © 2026 RSUD Dr. HARDJONO PONOROGO
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}