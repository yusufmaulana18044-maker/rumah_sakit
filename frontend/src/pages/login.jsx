// src/pages/Login.jsx
import { supabase } from "../supabase";
import { useState, useEffect } from "react";
import { Eye, EyeOff, HeartPulse, LogIn, User, Lock, Hospital } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/dashboard');
    }
  }, [navigate]);

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
        .from("profiles")
        .select("email, role")
        .eq("username", username.trim())
        .single();

      if (userError || !userData) {
        setError("Username tidak ditemukan");
        setIsLoading(false);
        return;
      }

      const email = userData.email;
      const role = userData.role;

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
      localStorage.setItem("email", email);

      window.location.href = "/dashboard";

    } catch (err) {
      console.error("Login error:", err);
      setError("Terjadi kesalahan, silakan coba lagi");
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      login();
    }
  };

  const animationStyle = `
    @keyframes slowZoom {
      0% { transform: scale(1) translateX(0); }
      50% { transform: scale(1.08) translateX(-10px); }
      100% { transform: scale(1) translateX(0); }
    }
    .animate-slow-zoom {
      animation: slowZoom 17s ease-in-out infinite;
    }
    .bg-blur-custom {
      filter: blur(4px) brightness(0.90) saturate(1.1);
    }
  `;

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <style>{animationStyle}</style>

      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-slow-zoom bg-blur-custom"
        style={{ backgroundImage: "url('/halamanrs2.jpeg')" }}
      />

      <div className="absolute inset-0 bg-black/30" />

      <div className="absolute top-0 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-sm px-4">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <div className="relative bg-gradient-to-r from-teal-700 via-teal-600 to-blue-700 px-6 pt-6 pb-5 overflow-hidden">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full"></div>
            <div className="absolute -left-20 -bottom-20 w-48 h-48 bg-white/5 rounded-full"></div>
            <div className="relative flex flex-col items-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center shadow-lg mb-3 border border-white/10 overflow-hidden">
                <img
                  src="/logo-rsud-harjonos.png"
                  alt="Logo RSUD Dr. Harjono"
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-lg font-display">
                SICAKEP
              </h1>
              <p className="text-teal-100/90 text-xs mt-0.5 font-medium tracking-wider">
                Sistem Informasi Catat Kepegawaian
              </p>
              <div className="flex items-center gap-2 mt-2 px-4 py-1.5 bg-white/15 rounded-full backdrop-blur border border-white/15 shadow-inner">
                <Hospital className="w-3 h-3 text-teal-200" />
                <span className="text-[10px] text-white/90 font-semibold tracking-wider">
                  RSUD Dr. HARJONO S. PONOROGO
                </span>
              </div>
            </div>
          </div>

          <div className="px-6 py-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-5 bg-gradient-to-b from-teal-600 to-blue-600 rounded-full"></div>
              <h2 className="text-sm font-semibold text-gray-800">Masuk ke Akun</h2>
            </div>

            {error && (
              <div className="mb-4 p-2.5 bg-red-50/80 backdrop-blur border border-red-200 rounded-xl text-red-600 text-xs flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1 flex-shrink-0"></div>
                {error}
              </div>
            )}

            <div className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Username
                </label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-600 transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Masukkan username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50/80 border border-gray-200 rounded-xl focus:bg-white focus:border-teal-400 focus:outline-none focus:ring-4 focus:ring-teal-100/50 transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-600 transition-colors">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-9 pr-10 py-2.5 text-sm bg-gray-50/80 border border-gray-200 rounded-xl focus:bg-white focus:border-teal-400 focus:outline-none focus:ring-4 focus:ring-teal-100/50 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                onClick={login}
                disabled={isLoading}
                className="relative w-full py-2.5 mt-1 bg-gradient-to-r from-teal-600 via-teal-500 to-blue-600 text-white font-semibold text-sm rounded-xl hover:shadow-lg hover:shadow-teal-500/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:transform-none overflow-hidden group"
              >
                <span className="relative flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Memproses...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      MASUK
                    </>
                  )}
                </span>
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/15 to-transparent"></div>
              </button>

              <div className="text-center pt-1">
                <p className="text-xs text-gray-500">
                  Belum punya akun?{" "}
                  <button
                    onClick={() => navigate("/register")}
                    className="text-teal-600 font-semibold hover:text-teal-700 hover:underline transition-colors"
                  >
                    Daftar di sini
                  </button>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-teal-50/50 to-blue-50/50 px-6 py-2.5 text-center border-t border-gray-100/50">
            <p className="text-[10px] text-gray-400 flex items-center justify-center gap-2">
              <HeartPulse className="w-3 h-3 text-teal-400" />
              <span className="font-medium text-gray-500">SICAKEP</span>
              <span className="text-gray-300">•</span>
              <span>RSUD Dr. HARJONO S. PONOROGO</span>
              <HeartPulse className="w-3 h-3 text-teal-400" />
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mt-3">
          <p className="text-center text-[9px] text-white/50 tracking-wider">
            SICAKEP v2.0
          </p>
          <span className="w-1 h-1 rounded-full bg-white/30"></span>
          <p className="text-center text-[9px] text-white/50 tracking-wider">
            Sistem Informasi Catatan Kepegawaian
          </p>
          <span className="w-1 h-1 rounded-full bg-white/30"></span>
          <p className="text-center text-[9px] text-white/50 tracking-wider">
            RSUD Dr. Harjono
          </p>
        </div>
      </div>
    </div>
  );
}