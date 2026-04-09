import { supabase } from "../supabase";
import { useEffect, useState } from "react";
import Layout from "./layout";

export default function Admin() {
  const [tiket, setTiket] = useState([]);
  const [activeFilter, setActiveFilter] = useState("semua");
  const [selectedTiket, setSelectedTiket] = useState(null);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    let { data, error } = await supabase
      .from("tiket")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
    } else {
      setTiket(data || []);
    }
  };

  const ubahStatus = async (id, statusBaru) => {
    const { error } = await supabase
      .from("tiket")
      .update({ status: statusBaru })
      .eq("id", id);

    if (error) {
      alert("Gagal update!");
    } else {
      getData();
    }
  };

  const filteredTiket =
    activeFilter === "semua"
      ? tiket
      : tiket.filter((t) => t.status === activeFilter);

  const statTotal = tiket.length;
  const statPending = tiket.filter((t) => !t.status || t.status === "pending")
    .length;
  const statProses = tiket.filter((t) => t.status === "diproses").length;
  const statSelesai = tiket.filter((t) => t.status === "selesai").length;

  return (
    <Layout title="Dashboard Admin">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded shadow p-6 border-l-4 border-gray-400">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">Total Tiket</p>
                <p className="text-3xl font-bold text-gray-800">{statTotal}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded shadow p-6 border-l-4 border-gray-400">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">Menunggu</p>
                <p className="text-3xl font-bold text-gray-800">{statPending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded shadow p-6 border-l-4 border-yellow-400">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">Diproses</p>
                <p className="text-3xl font-bold text-gray-800">{statProses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded shadow p-6 border-l-4 border-green-400">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">Selesai</p>
                <p className="text-3xl font-bold text-gray-800">{statSelesai}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded shadow p-4 flex gap-2 flex-wrap">
          {[
            { key: "semua", label: "Semua", count: statTotal },
            { key: "pending", label: "Menunggu", count: statPending },
            { key: "diproses", label: "Diproses", count: statProses },
            { key: "selesai", label: "Selesai", count: statSelesai },
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-4 py-2 rounded font-semibold transition ${
                activeFilter === filter.key
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded shadow overflow-hidden">
          {filteredTiket.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>Tidak ada tiket untuk ditampilkan</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                      Kode Tiket
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                      Keluhan
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                      Tanggal
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTiket.map((t, index) => (
                    <tr
                      key={t.id}
                      className={`border-b border-gray-200 hover:bg-gray-50 transition ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-800">
                          {t.kode_tiket}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700 max-w-xs truncate">
                        {t.keluhan}
                      </td>
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
                          {!t.status || t.status === "pending"
                            ? "Menunggu"
                            : t.status === "selesai"
                            ? "Selesai"
                            : "Diproses"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(t.created_at).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedTiket(t)}
                            className="px-3 py-1 bg-gray-800 hover:bg-gray-900 text-white rounded text-xs font-semibold transition"
                          >
                            Detail
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

      {/* Modal Detail */}
      {selectedTiket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded shadow max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-lg font-semibold text-gray-800">
                Detail Tiket
              </h2>
              <button
                onClick={() => setSelectedTiket(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm text-gray-600 font-semibold mb-1">Kode Tiket</p>
                <p className="text-lg font-semibold text-gray-800">
                  {selectedTiket.kode_tiket}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-semibold mb-1">Keluhan</p>
                <p className="text-gray-700 leading-relaxed text-sm">
                  {selectedTiket.keluhan}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-semibold mb-1">Status Saat Ini</p>
                <span
                  className={`inline-block px-3 py-1 rounded text-xs font-semibold ${
                    selectedTiket.status === "selesai"
                      ? "bg-green-100 text-green-800"
                      : selectedTiket.status === "diproses"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {selectedTiket.status === "selesai"
                    ? "Selesai"
                    : selectedTiket.status === "diproses"
                    ? "Diproses"
                    : "Menunggu"}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-semibold mb-1">Tanggal</p>
                <p className="text-gray-700 text-sm">
                  {new Date(selectedTiket.created_at).toLocaleDateString(
                    "id-ID",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 font-semibold mb-3">Ubah Status</p>
              <div className="space-y-2">
                {["pending", "diproses", "selesai"].map((status) => (
                  <button
                    key={status}
                    onClick={() => ubahStatus(selectedTiket.id, status)}
                    disabled={selectedTiket.status === status}
                    className="w-full px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 text-gray-800 text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === "selesai"
                      ? "Selesai"
                      : status === "diproses"
                      ? "Diproses"
                      : "Menunggu"}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedTiket(null)}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 rounded transition"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}