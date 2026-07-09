import { supabase } from "../supabase";
import { useState, useEffect } from "react";
import Layout from "../components/layout";

export default function TiketSaya() {
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

    const { error } = await supabase.from("tiket").insert([
      {
        kode_tiket: "TKT-" + Math.floor(Math.random() * 10000),
        user_id: user.id,
        keluhan,
      },
    ]);

    if (error) {
      setError("Gagal mengirim tiket");
      console.log(error);
    } else {
      setSuccess("Tiket berhasil dikirim!");
      setKeluhan("");
      getTiketSaya();
    }
    setIsLoading(false);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Tiket Saya</h1>

        {/* Form Kirim Tiket */}
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Kirim Keluhan Baru</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-300 rounded text-green-700 text-sm">
              {success}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Keluhan
              </label>
              <textarea
                value={keluhan}
                onChange={(e) => setKeluhan(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                placeholder="Tulis keluhan atau masalah yang Anda alami..."
              />
            </div>

            <button
              onClick={kirim}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition disabled:opacity-50"
            >
              {isLoading ? "Mengirim..." : "Kirim Tiket"}
            </button>
          </div>
        </div>

        {/* Daftar Tiket */}
        <div className="bg-white rounded shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Riwayat Tiket ({tiket.length})</h2>
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
                        !t.status || t.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : t.status === "diproses"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {t.status === "diproses" ? "Diproses" : t.status === "selesai" ? "Selesai" : "Pending"}
                    </span>
                  </div>
                  <p className="text-gray-700">{t.keluhan}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}