import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import Layout from "../components/layout";

export default function Laporan() {
  const [tiket, setTiket] = useState([]);
  const [filteredTiket, setFilteredTiket] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const role = localStorage.getItem("role");

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    let query = supabase.from("tiket").select("*");

    if (role === "user") {
      const user = JSON.parse(localStorage.getItem("user"));
      query = query.eq("user_id", user.id);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      console.log(error);
    } else {
      setTiket(data || []);
      setFilteredTiket(data || []);
    }
  };

  const filterByDate = () => {
    if (!startDate || !endDate) {
      setFilteredTiket(tiket);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // End of day

    const filtered = tiket.filter(t => {
      const ticketDate = new Date(t.created_at);
      return ticketDate >= start && ticketDate <= end;
    });

    setFilteredTiket(filtered);
  };

  const exportToCSV = () => {
    const headers = ["Kode Tiket", "Keluhan", "Status", "Tanggal"];
    const csvContent = [
      headers.join(","),
      ...filteredTiket.map(t => [
        t.kode_tiket,
        `"${t.keluhan.replace(/"/g, '""')}"`,
        t.status || "pending",
        new Date(t.created_at).toLocaleDateString("id-ID")
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `laporan_tiket_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printReport = () => {
    window.print();
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Laporan Tiket</h1>
          <div className="flex gap-2">
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition"
            >
              Export CSV
            </button>
            <button
              onClick={printReport}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
            >
              Print
            </button>
          </div>
        </div>

        {/* Filter Date */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Filter Tanggal</h2>
          <div className="flex gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Mulai
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Akhir
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={filterByDate}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition"
            >
              Filter
            </button>
          </div>
        </div>

        {/* Report Table */}
        <div className="bg-white rounded shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Data Tiket ({filteredTiket.length})</h2>
          </div>

          {filteredTiket.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>Tidak ada data tiket untuk ditampilkan</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kode Tiket
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Keluhan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTiket.map((t, index) => (
                    <tr key={t.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {t.kode_tiket}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {t.keluhan}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          !t.status || t.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : t.status === "diproses"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}>
                          {t.status === "diproses" ? "Diproses" : t.status === "selesai" ? "Selesai" : "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(t.created_at).toLocaleDateString("id-ID")}
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