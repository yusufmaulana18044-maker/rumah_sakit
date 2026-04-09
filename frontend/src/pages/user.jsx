import { supabase } from "../supabase";
import { useState, useEffect } from "react";
import Layout from "./layout";

export default function User() {
  const [keluhan, setKeluhan] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [tiket, setTiket] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    getTiketSaya();
  }, []);

  const getTiketSaya = async () => {
    const { data, error } = await supabase
      .from("tiket")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
    } else {
      setTiket(data || []);
    }
  };

  const kirim = async () => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (!keluhan.trim()) {
      setError("Keluhan tidak boleh kosong");
      setIsLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("tiket").insert([
      {
        kode_tiket: "TKT-" + Math.floor(Math.random() * 10000),
        user_id: user.id,
        keluhan,
        status: "pending",
      },
    ]);

    if (insertError) {
      setError("Gagal kirim tiket!");
      console.log(insertError);
    } else {
      setSuccess("Tiket berhasil dikirim!");
      setKeluhan("");
      setTimeout(() => {
        getTiketSaya();
        setSuccess("");
      }, 1500);
    }
    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      kirim();
    }
  };

  return (
    <Layout title="Kirim Keluhan">
      <div className="space-y-6">
        {/* Form Buat Tiket */}
        <div className="bg-white rounded shadow p-6 border-l-4 border-gray-400">
          <h2 className="text-xl font-semibold text-gray-800 mb-1">Kirim Keluhan</h2>
          <p className="text-gray-600 text-sm mb-6">Sampaikan keluhan atau masalah Anda dengan detail</p>

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

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Deskripsikan Keluhan Anda
            </label>
            <textarea
              placeholder="Tulis keluhan atau masalah Anda dengan detail (tekan Ctrl+Enter untuk kirim)..."
              value={keluhan}
              onChange={(e) => setKeluhan(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 border border-gray-300 rounded focus:border-gray-700 focus:outline-none min-h-32 resize-none"
            />
          </div>

          <button
            onClick={kirim}
            disabled={isLoading}
            className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 rounded transition disabled:opacity-50"
          >
            {isLoading ? "Mengirim..." : "Kirim Keluhan"}
          </button>
        </div>

        {/* Daftar Tiket Saya */}
        <div className="bg-white rounded shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Tiket Saya</h2>
            <p className="text-gray-600 text-sm mt-1">Total: {tiket.length} tiket</p>
          </div>

          {tiket.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>Belum ada tiket. Buat tiket baru di atas!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {tiket.map((t) => (
                <div key={t.id} className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-gray-800 text-lg">{t.kode_tiket}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(t.created_at).toLocaleDateString("id-ID", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <span
                      className={`inline-block px-3 py-1 rounded text-xs font-semibold ${
                        t.status === "selesai"
                          ? "bg-green-100 text-green-800"
                          : t.status === "diproses"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {t.status === "selesai"
                        ? "Selesai"
                        : t.status === "diproses"
                        ? "Diproses"
                        : "Menunggu"}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{t.keluhan}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}