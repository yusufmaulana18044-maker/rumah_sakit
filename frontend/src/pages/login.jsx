import { supabase } from "../supabase";
import { useState, useEffect } from "react";
import { Eye, EyeOff, HeartPulse, LogIn, User, Lock, Building2, Stethoscope, Hospital } from "lucide-react";
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
      navigate('/admin');
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
      // 1. Cari user di profiles berdasarkan username
      const { data: userData, error: userError } = await supabase
        .from("profiles")
<<<<<<< HEAD
        .select("email, role, username")
        .eq("username", username)
=======
        .select("email, role, id")
        .eq("username", username.trim())
>>>>>>> 263e32c (feat: SICAKEP v2.0 - Integrasi Supabase & fitur lengkap)
        .single();

      if (userError || !userData) {
        setError("Username tidak ditemukan");
        setIsLoading(false);
        return;
      }

      const email = userData.email;
      const role = userData.role;

<<<<<<< HEAD
      // 2. Login pake email & password
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
=======
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
>>>>>>> 263e32c (feat: SICAKEP v2.0 - Integrasi Supabase & fitur lengkap)
      });

      if (signInError) {
        setError("Password salah");
        setIsLoading(false);
        return;
      }

      // 3. Simpan ke localStorage
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("username", username);
      localStorage.setItem("role", role);
      localStorage.setItem("email", email);

<<<<<<< HEAD
      // 4. Redirect ke dashboard
      window.location.href = "/dashboard";
=======
      if (role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/dashboard";
      }
>>>>>>> 263e32c (feat: SICAKEP v2.0 - Integrasi Supabase & fitur lengkap)

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

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
<<<<<<< HEAD
      <style>{animationStyle}</style>

=======
      {/* Background RSUD */}
>>>>>>> 263e32c (feat: SICAKEP v2.0 - Integrasi Supabase & fitur lengkap)
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm scale-105"
        style={{ backgroundImage: "url('/halamanrs2.jpeg')" }}
      />

<<<<<<< HEAD
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 w-full max-w-sm px-4">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
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
=======
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Dekorasi Blob */}
      <div className="absolute top-0 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      {/* Card - Lebih Kecil */}
      <div className="relative z-10 w-full max-w-sm px-4">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          
          {/* Header - Sama, tapi padding lebih kecil */}
          <div className="relative bg-gradient-to-r from-teal-700 via-teal-600 to-blue-700 px-6 pt-6 pb-5 overflow-hidden">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full"></div>
            <div className="absolute -left-20 -bottom-20 w-48 h-48 bg-white/5 rounded-full"></div>
            
            <div className="relative flex flex-col items-center">
              {/* Logo - Lebih Kecil */}
              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center shadow-lg mb-3 border border-white/10 p-1.5">
>>>>>>> 263e32c (feat: SICAKEP v2.0 - Integrasi Supabase & fitur lengkap)
                <img
                  src="/logo-rsud-harjonos.png"
                  alt="Logo RSUD Dr. Harjono"
                  className="w-full h-full object-contain"
                />
              </div>
              
              {/* Title - Lebih Kecil */}
              <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-lg font-display">
                SICAKEP
              </h1>
              <p className="text-teal-100/90 text-xs mt-0.5 font-medium tracking-wider">
                Sistem Informasi Catat Kepegawaian
              </p>
              
              {/* RS Name Badge - Lebih Kecil */}
              <div className="flex items-center gap-2 mt-2 px-4 py-1.5 bg-white/15 rounded-full backdrop-blur border border-white/15 shadow-inner">
                <Hospital className="w-3 h-3 text-teal-200" />
                <span className="text-[10px] text-white/90 font-semibold tracking-wider">
                  RSUD Dr. HARJONO S. PONOROGO
                </span>
              </div>
            </div>
          </div>

<<<<<<< HEAD
          <div className="px-6 py-6">
=======
          {/* Form - Padding lebih kecil */}
          <div className="px-6 py-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-5 bg-gradient-to-b from-teal-600 to-blue-600 rounded-full"></div>
              <h2 className="text-sm font-semibold text-gray-800">Masuk ke Akun</h2>
            </div>

>>>>>>> 263e32c (feat: SICAKEP v2.0 - Integrasi Supabase & fitur lengkap)
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
                      Masuk ke SICAKEP
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

<<<<<<< HEAD
          <div className="bg-gradient-to-r from-blue-50 to-teal-50 px-6 py-3 text-center border-t border-gray-100">
            <p className="text-gray-400 text-[10px]">
              © 2026 RSUD Dr. HARDJONO PONOROGO
=======
          {/* Footer - Lebih kecil */}
          <div className="bg-gradient-to-r from-teal-50/50 to-blue-50/50 px-6 py-2.5 text-center border-t border-gray-100/50">
            <p className="text-[10px] text-gray-400 flex items-center justify-center gap-2">
              <HeartPulse className="w-3 h-3 text-teal-400" />
              <span className="font-medium text-gray-500">SICAKEP</span>
              <span className="text-gray-300">•</span>
              <span>RSUD Dr. HARJONO S. PONOROGO</span>
              <HeartPulse className="w-3 h-3 text-teal-400" />
>>>>>>> 263e32c (feat: SICAKEP v2.0 - Integrasi Supabase & fitur lengkap)
            </p>
          </div>
        </div>

        {/* Version - Lebih kecil */}
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