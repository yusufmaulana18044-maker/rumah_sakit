import { supabase } from "../supabase";
import { useState } from "react";
import { Eye, EyeOff, User, Lock, Mail, UserPlus, HeartPulse, Hospital } from "lucide-react";
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
<<<<<<< HEAD
      // ========================
      // 1. CEK USERNAME & EMAIL
      // ========================
      const { data: existingUsername, error: userErr } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", username)
        .maybeSingle();

      const { data: existingEmail, error: emailErr } = await supabase
        .from("profiles")
        .select("email")
        .eq("email", email)
        .maybeSingle();

      if (userErr || emailErr) {
        console.error("Check error:", userErr || emailErr);
=======
      const { data: existing, error: existingErr } = await supabase
        .from("profiles")
        .select("id, username, email")
        .or(`username.eq.${username},email.eq.${email}`)
        .maybeSingle();

      if (existingErr) {
>>>>>>> 263e32c (feat: SICAKEP v2.0 - Integrasi Supabase & fitur lengkap)
        setError("Gagal memeriksa data user. Silakan coba lagi nanti.");
        setIsLoading(false);
        return;
      }

      if (existingUsername) {
        setError("Username sudah terdaftar, gunakan username lain");
        setIsLoading(false);
        return;
      }

<<<<<<< HEAD
      if (existingEmail) {
        setError("Email sudah terdaftar. Silakan login atau gunakan email lain");
        setIsLoading(false);
        return;
      }

      // ========================
      // 2. REGISTER KE SUPABASE AUTH
      // ========================
=======
>>>>>>> 263e32c (feat: SICAKEP v2.0 - Integrasi Supabase & fitur lengkap)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
            full_name: nama,
          },
        },
      });

      if (authError) {
        const msg = authError.message || JSON.stringify(authError);
        if (msg.toLowerCase().includes("already registered") || msg.toLowerCase().includes("user already")) {
          setError("Email sudah terdaftar. Silakan login atau gunakan email lain");
        } else {
          setError(msg);
        }
        setIsLoading(false);
        return;
      }

      const authUserId = authData?.user?.id || null;

<<<<<<< HEAD
      if (!authUserId) {
        setError("Gagal mendapatkan ID user. Silakan coba lagi.");
        setIsLoading(false);
        return;
      }

      // ========================
      // 3. PROFILES OTOMATIS TERISI OLEH TRIGGER
      // ========================
      // Trigger sudah handle insert ke profiles + role berdasarkan email
      // Kita tunggu sebentar biar trigger selesai
      await new Promise(resolve => setTimeout(resolve, 500));

      // Cek apakah profiles sudah terisi
      const { data: profileCheck, error: checkError } = await supabase
        .from("profiles")
        .select("id, role")
        .eq("user_id", authUserId)
        .maybeSingle();

      if (checkError) {
        console.error("Check profile error:", checkError);
      }

      // Kalau trigger gagal, kita insert manual
      if (!profileCheck) {
        const isAdmin = email.toLowerCase().includes('admin');
        const role = isAdmin ? 'admin' : 'pegawai';

        const { error: insertError } = await supabase
          .from("profiles")
          .insert([{
            user_id: authUserId,
            username: username.trim(),
            email: email.trim().toLowerCase(),
            role: role,
            full_name: nama
          }]);

        if (insertError) {
          console.error("INSERT PROFILES ERROR:", insertError);
          setError(`Akun berhasil dibuat, tetapi data user gagal disimpan: ${insertError.message}`);
          setIsLoading(false);
          return;
        }
      } else {
        // Trigger jalan, tapi kita update role-nya (trigger set default "pegawai")
        const isAdmin = email.toLowerCase().includes('admin');
        const role = isAdmin ? 'admin' : 'pegawai';

        if (profileCheck.role !== role) {
          const { error: updateError } = await supabase
            .from("profiles")
            .update({ role: role })
            .eq("user_id", authUserId);

          if (updateError) {
            console.error("Update role error:", updateError);
          }
        }
=======
      if (authUserId) {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            username: username.trim(),
            email: email.trim().toLowerCase(),
            role: "pegawai",
            full_name: nama,
          })
          .eq("id", authUserId);

        if (updateError) {
          setError(`Akun berhasil dibuat, tetapi data profile gagal disimpan: ${updateError.message}`);
          setIsLoading(false);
          return;
        }
>>>>>>> 263e32c (feat: SICAKEP v2.0 - Integrasi Supabase & fitur lengkap)
      }

      setSuccess("Pendaftaran berhasil! Mengarahkan ke halaman login...");
      setUsername("");
      setNama("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
<<<<<<< HEAD
=======

>>>>>>> 263e32c (feat: SICAKEP v2.0 - Integrasi Supabase & fitur lengkap)
      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (err) {
      console.error("Register error:", err);
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

<<<<<<< HEAD
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
=======
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background RSUD */}
>>>>>>> 263e32c (feat: SICAKEP v2.0 - Integrasi Supabase & fitur lengkap)
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm scale-105"
        style={{ backgroundImage: "url('/halamanrs2.jpeg')" }}
      />
<<<<<<< HEAD
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-900 to-teal-600 px-8 pt-8 pb-6">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 p-3 rounded-2xl">
=======

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Dekorasi Blob */}
      <div className="absolute top-0 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm px-4">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          
          {/* Header */}
          <div className="relative bg-gradient-to-r from-teal-700 via-teal-600 to-blue-700 px-6 pt-6 pb-5 overflow-hidden">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full"></div>
            <div className="absolute -left-20 -bottom-20 w-48 h-48 bg-white/5 rounded-full"></div>
            
            <div className="relative flex flex-col items-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center shadow-lg mb-3 border border-white/10 p-1.5">
>>>>>>> 263e32c (feat: SICAKEP v2.0 - Integrasi Supabase & fitur lengkap)
                <img
                  src="/logo-rsud-harjonos.png"
                  alt="Logo RSUD Dr. Harjono"
                  className="w-full h-full object-contain"
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
<<<<<<< HEAD
          <div className="px-8 py-8">
=======

          {/* Form */}
          <div className="px-6 py-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-5 bg-gradient-to-b from-teal-600 to-blue-600 rounded-full"></div>
              <h2 className="text-sm font-semibold text-gray-800">Daftar Akun Baru</h2>
            </div>

>>>>>>> 263e32c (feat: SICAKEP v2.0 - Integrasi Supabase & fitur lengkap)
            {error && (
              <div className="mb-4 p-2.5 bg-red-50/80 backdrop-blur border border-red-200 rounded-xl text-red-600 text-xs flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1 flex-shrink-0"></div>
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-2.5 bg-green-50/80 backdrop-blur border border-green-200 rounded-xl text-green-600 text-xs flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1 flex-shrink-0"></div>
                {success}
              </div>
            )}
<<<<<<< HEAD
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">Username</label>
              <input
                type="text"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:border-gray-700 focus:outline-none"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">Nama Panjang</label>
              <input
                type="text"
                placeholder="Masukkan nama panjang"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:border-gray-700 focus:outline-none"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                placeholder="Masukkan email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:border-gray-700 focus:outline-none"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
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
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">Konfirmasi Password</label>
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
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button
              onClick={register}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-800 to-teal-600 hover:from-blue-900 hover:to-teal-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50 shadow-md"
            >
              {isLoading ? "Loading..." : "Daftar"}
            </button>
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
          <div className="bg-gradient-to-r from-blue-50 to-teal-50 px-6 py-3 text-center border-t border-gray-100">
            <p className="text-gray-400 text-[10px]">© 2026 RSUD Dr. HARDJONO PONOROGO</p>
=======

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
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
                  Nama Panjang
                </label>
                <div className="relative">
                  <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50/80 border border-gray-200 rounded-xl focus:bg-white focus:border-teal-400 focus:outline-none focus:ring-4 focus:ring-teal-100/50 transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Masukkan email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50/80 border border-gray-200 rounded-xl focus:bg-white focus:border-teal-400 focus:outline-none focus:ring-4 focus:ring-teal-100/50 transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimal 6 karakter"
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

              <div>
                <label className="block text-[10px] font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Ulangi password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-9 pr-10 py-2.5 text-sm bg-gray-50/80 border border-gray-200 rounded-xl focus:bg-white focus:border-teal-400 focus:outline-none focus:ring-4 focus:ring-teal-100/50 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                onClick={register}
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
                      <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      Daftar
                    </>
                  )}
                </span>
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/15 to-transparent"></div>
              </button>

              <div className="text-center pt-1">
                <p className="text-xs text-gray-500">
                  Sudah punya akun?{" "}
                  <button
                    onClick={() => navigate("/")}
                    className="text-teal-600 font-semibold hover:text-teal-700 hover:underline transition-colors"
                  >
                    Login di sini
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-teal-50/50 to-blue-50/50 px-6 py-2.5 text-center border-t border-gray-100/50">
            <p className="text-[10px] text-gray-400 flex items-center justify-center gap-2">
              <HeartPulse className="w-3 h-3 text-teal-400" />
              <span className="font-medium text-gray-500">SICAKEP</span>
              <span className="text-gray-300">•</span>
              <span>RSUD Dr. HARJONO S. PONOROGO</span>
              <HeartPulse className="w-3 h-3 text-teal-400" />
            </p>
>>>>>>> 263e32c (feat: SICAKEP v2.0 - Integrasi Supabase & fitur lengkap)
          </div>
        </div>

        {/* Version */}
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