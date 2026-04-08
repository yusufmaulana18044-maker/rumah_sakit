import Layout from "./layout";
import { supabase } from "../supabase";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [tiket, setTiket] = useState([]);
  const role = localStorage.getItem("role");
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
      setTiket(data);
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

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-indigo-600 mb-1">📊 Dashboard</h2>
        <p className="text-gray-700">
          Login sebagai: <span className="font-semibold">{role}</span>
        </p>
      </div>

      {/* Statistik sederhana */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-indigo-50 p-4 rounded-2xl shadow">
          <p className="text-gray-500">Total Tiket</p>
          <p className="text-2xl font-bold">{tiket.length}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-2xl shadow">
          <p className="text-gray-500">Diproses</p>
          <p className="text-2xl font-bold">{tiket.filter(t => t.status === "diproses").length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-2xl shadow">
          <p className="text-gray-500">Selesai</p>
          <p className="text-2xl font-bold">{tiket.filter(t => t.status === "selesai").length}</p>
        </div>
      </div>

      {/* Tiket list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tiket.map((t) => (
          <div key={t.id} className="bg-white p-5 rounded-2xl shadow hover:shadow-xl transition">
            <p className="text-xl font-semibold text-indigo-600">{t.kode_tiket}</p>
            <p className="mt-1 text-gray-700">{t.keluhan}</p>
            <p className="mt-2">
              Status:{" "}
              <span
                className={
                  t.status === "selesai"
                    ? "text-green-600 font-bold"
                    : t.status === "diproses"
                    ? "text-yellow-500 font-bold"
                    : "text-gray-400 font-bold"
                }
              >
                {t.status || "menunggu"}
              </span>
            </p>

            {/* Admin actions */}
            {role === "admin" && (
              <div className="mt-3 flex gap-2">
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  onClick={() => ubahStatus(t.id, "diproses")}
                >
                  Proses
                </button>
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  onClick={() => ubahStatus(t.id, "selesai")}
                >
                  Selesai
                </button>
              </div>
            )}

            {/* Print */}
            <button
              className="mt-3 bg-gray-800 text-white px-3 py-1 rounded hover:bg-black"
              onClick={() => window.print()}
            >
              🖨️ Print
            </button>
          </div>
        ))}
      </div>
    </Layout>
  );
}