import Layout from "./layout";
import { supabase } from "../supabase";
import { useEffect, useState } from "react";
import { BarChart3, Clock, CheckCircle, AlertCircle, Printer, Edit2, Eye } from "lucide-react";

export default function Dashboard() {
  const [tiket, setTiket] = useState([]);
  const [activeFilter, setActiveFilter] = useState("semua");
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    let query = supabase.from("tiket").select("*");

    if (role === "user") {
      query = query.eq("user_id", user.id);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      console.log(error);
    } else {
      setTiket(data || []);
    }
  };

  const ubahStatus = async (id, statusBaru) => {
    const { error } = await supabase.from("tiket").update({ status: statusBaru }).eq("id", id);
    if (error) {
      alert("Gagal update!");
    } else {
      getData();
    }
  };

  // Filter tiket
  const filteredTiket = activeFilter === "semua" 
    ? tiket 
    : tiket.filter(t => t.status === activeFilter);

  const statTotal = tiket.length;
  const statPending = tiket.filter(t => !t.status || t.status === "pending").length;
  const statProses = tiket.filter(t => t.status === "diproses").length;
  const statSelesai = tiket.filter(t => t.status === "selesai").length;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded shadow p-6 border-l-4 border-gray-400">
            <p className="text-gray-600 text-sm mb-2">Total Tiket</p>
            <p className="text-3xl font-semibold text-gray-800">{statTotal}</p>
          </div>

          <div className="bg-white rounded shadow p-6 border-l-4 border-gray-400">
            <p className="text-gray-600 text-sm mb-2">Menunggu</p>
            <p className="text-3xl font-semibold text-gray-800">{statPending}</p>
          </div>

          <div className="bg-white rounded shadow p-6 border-l-4 border-gray-400">
            <p className="text-gray-600 text-sm mb-2">Diproses</p>
            <p className="text-3xl font-semibold text-gray-800">{statProses}</p>
          </div>

          <div className="bg-white rounded shadow p-6 border-l-4 border-gray-400">
            <p className="text-gray-600 text-sm mb-2">Selesai</p>
            <p className="text-3xl font-semibold text-gray-800">{statSelesai}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveFilter("semua")}
            className={`px-4 py-2 rounded font-medium transition ${
              activeFilter === "semua"
                ? "bg-gray-800 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Semua ({statTotal})
          </button>
          <button
            onClick={() => setActiveFilter("pending")}
            className={`px-4 py-2 rounded font-medium transition ${
              activeFilter === "pending"
                ? "bg-gray-800 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Menunggu ({statPending})
          </button>
          <button
            onClick={() => setActiveFilter("diproses")}
            className={`px-4 py-2 rounded font-medium transition ${
              activeFilter === "diproses"
                ? "bg-gray-800 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Diproses ({statProses})
          </button>
          <button
            onClick={() => setActiveFilter("selesai")}
            className={`px-4 py-2 rounded font-medium transition ${
              activeFilter === "selesai"
                ? "bg-gray-800 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Selesai ({statSelesai})
          </button>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded shadow overflow-hidden">
          {filteredTiket.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>Tidak ada tiket untuk ditampilkan</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-300">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Kode Tiket</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Keluhan</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tanggal</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTiket.map((t, index) => (
                    <tr key={t.id} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-800">{t.kode_tiket}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-700 max-w-xs truncate">{t.keluhan}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded text-xs font-semibold ${
                            t.status === "selesai"
                              ? "bg-green-100 text-green-800"
                              : t.status === "diproses"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {!t.status || t.status === "pending" ? "Menunggu" : t.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(t.created_at).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {role === "admin" && (
                            <>
                              {t.status !== "diproses" && (
                                <button
                                  onClick={() => ubahStatus(t.id, "diproses")}
                                  className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded transition"
                                >
                                  Proses
                                </button>
                              )}
                              {t.status !== "selesai" && (
                                <button
                                  onClick={() => ubahStatus(t.id, "selesai")}
                                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition"
                                >
                                  Selesai
                                </button>
                              )}
                            </>
                          )}
                          <button
                            onClick={() => window.print()}
                            className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded transition"
                          >
                            Print
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}