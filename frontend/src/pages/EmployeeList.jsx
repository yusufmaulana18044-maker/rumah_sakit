// src/pages/EmployeeList.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Eye, Edit, Trash2, Users } from "lucide-react";
import { supabase } from "../supabase";

const KATEGORI = [
  "SK Pangkat (Mulai CPNS)",
  "SK Fungsional",
  "Data Pribadi",
  "Riwayat Pendidikan",
  "Uraian Tugas",
  "SPK RKK (Khusus Nakes)",
  "Penilaian Kinerja (SKP)",
  "SPMT",
  "Orientasi",
  "KGB",
  "Pengembangan Kompetensi",
  "Riwayat Jabatan",
  "Check Up",
  "Lain-lain"
];

export default function EmployeeList() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");
  const [loading, setLoading] = useState(true);

  // Ambil data dari Supabase
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        // 1. Ambil pegawai
        const { data: pegawai, error: pegawaiError } = await supabase
          .from("pegawai")
          .select("*")
          .order("full_name", { ascending: true });

        if (pegawaiError) throw pegawaiError;

        // 2. Ambil dokumen per pegawai
        const employeesWithDocs = await Promise.all(
          (pegawai || []).map(async (emp) => {
            const { data: docs, error: docsError } = await supabase
              .from("dokumen")
              .select("type")
              .eq("employee_id", emp.id);

            if (docsError) throw docsError;

            const docTypes = docs.map(doc => doc.type);
            const kelengkapan = KATEGORI.map(kat => docTypes.includes(kat) ? "isi" : "");

            return {
              ...emp,
              kelengkapan,
              dokumenCount: docs.length
            };
          })
        );

        setEmployees(employeesWithDocs || []);

      } catch (error) {
        console.error("Error fetching employees:", error);
        alert("Gagal mengambil data pegawai");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Yakin ingin menghapus pegawai "${name}"?`)) return;

    try {
      const { error } = await supabase
        .from("pegawai")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setEmployees(employees.filter(emp => emp.id !== id));
      alert(`✅ Pegawai "${name}" berhasil dihapus!`);
    } catch (error) {
      console.error("Delete error:", error);
      alert("❌ Gagal menghapus pegawai: " + error.message);
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.full_name?.toLowerCase().includes(search.toLowerCase()) ||
                          emp.nip?.includes(search) ||
                          emp.position?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "semua" || emp.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    if (status === "aktif") {
      return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Aktif</span>;
    }
    return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">Cuti</span>;
  };

  const stats = {
    total: employees.length,
    aktif: employees.filter(e => e.status === "aktif").length,
    cuti: employees.filter(e => e.status === "cuti").length,
    dokumen: employees.reduce((sum, e) => sum + (e.dokumenCount || 0), 0)
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Loading data pegawai...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">📋 Data Pegawai</h1>
          <p className="text-gray-500 text-sm mt-1">Kelengkapan berkas 14 kategori per pegawai</p>
        </div>
        <button
          onClick={() => navigate("/employees/new")}
          className="bg-teal-700 text-white px-4 py-2 rounded-lg hover:bg-teal-800 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah Pegawai
        </button>
      </div>

      {/* Stats Mini */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-lg shadow-sm p-3 border-l-4 border-teal-600">
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-3 border-l-4 border-green-600">
          <p className="text-xs text-gray-500">Aktif</p>
          <p className="text-xl font-bold text-gray-800">{stats.aktif}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-3 border-l-4 border-yellow-600">
          <p className="text-xs text-gray-500">Cuti</p>
          <p className="text-xl font-bold text-gray-800">{stats.cuti}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-3 border-l-4 border-blue-600">
          <p className="text-xs text-gray-500">Dokumen</p>
          <p className="text-xl font-bold text-gray-800">{stats.dokumen}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari NIP, Nama, atau Jabatan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-teal-400 focus:outline-none"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:border-teal-400 focus:outline-none"
        >
          <option value="semua">Semua Status</option>
          <option value="aktif">Aktif</option>
          <option value="cuti">Cuti</option>
        </select>
        <button 
          onClick={() => alert("Fitur Export Excel akan segera hadir!")}
          className="border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50"
        >
          Ekspor Excel
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredEmployees.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p>Tidak ada data pegawai</p>
            <p className="text-sm mt-1">Tambahkan pegawai baru dengan tombol "Tambah Pegawai"</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pegawai</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIP</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Kerja</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kelengkapan 14 kategori</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEmployees.map((emp) => {
                  const filled = emp.kelengkapan?.filter(s => s === "isi").length || 0;
                  return (
                    <tr key={emp.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-800">{emp.full_name}</div>
                        <div className="text-xs text-gray-400">{emp.position}</div>
                      </td>
                      <td className="px-4 py-3 font-mono text-sm text-gray-600">{emp.nip}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{emp.work_unit}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-0.5">
                          {emp.kelengkapan?.map((s, i) => (
                            <div 
                              key={i}
                              className={`w-2.5 h-3.5 rounded-sm ${s === "isi" ? "bg-teal-600" : "bg-gray-200"}`}
                              title={KATEGORI[i]}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{filled} dari 14 kategori terisi</p>
                      </td>
                      <td className="px-4 py-3">{getStatusBadge(emp.status)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/employees/${emp.id}`)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/employees/${emp.id}/edit`)}
                            className="p-1 text-teal-600 hover:bg-teal-50 rounded transition"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(emp.id, emp.full_name)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-teal-600 rounded-sm inline-block"></span> kategori terisi</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-gray-200 rounded-sm inline-block"></span> belum ada berkas</span>
      </div>
    </div>
  );
}