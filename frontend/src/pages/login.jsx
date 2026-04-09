import { supabase } from "../supabase";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function login() {
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
      // Query untuk mendapatkan user berdasarkan username
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

      // Auth dengan email yang didapatkan dari database
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

      // Redirect berdasarkan role
      if (role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/user";
      }
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gray-800 px-8 pt-8 pb-6">
            <h1 className="text-2xl font-bold text-white text-center">Rumah Sakit</h1>
            <p className="text-gray-300 text-center mt-1 text-sm">Sistem Manajemen Tiket</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-300 rounded text-red-700 text-sm">
                {error}
              </div>
            )}

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

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
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

            <button
              onClick={login}
              disabled={isLoading}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 rounded transition disabled:opacity-50"
            >
              {isLoading ? "Loading..." : "Login"}
            </button>

            <div className="mt-6 text-center text-xs text-gray-600">
              <p>Demo: admin | user</p>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Belum punya akun?{" "}
                <button
                  onClick={() => navigate("/register")}
                  className="text-gray-800 font-semibold hover:underline"
                >
                  Daftar di sini
                </button>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-3 text-center border-t border-gray-200">
            <p className="text-gray-600 text-xs">© 2024 Rumah Sakit Management System</p>
          </div>
        </div>
      </div>
    </div>
  );
}

