// src/pages/EmployeeList.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Eye, Edit, Trash2, Users, Download } from "lucide-react";
import { supabase } from "../supabase";
import * as XLSX from 'xlsx'; // ✅ IMPORT XLSX

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
  const [error, setError] = useState("");

  // Ambil data dari Supabase
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    setError("");
    try {
      console.log("🔍 Fetching from table: pegawai");
      const { data, error } = await supabase
        .from('pegawai')
        .select('*')
        .order('full_name', { ascending: true });
      
      console.log("📊 Data:", data);
      console.log("❌ Error:", error);
      
      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error("🔥 Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Yakin ingin menghapus pegawai "${name}"?`)) return;
    
    try {
      const { error } = await supabase
        .from('pegawai')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      fetchEmployees();
      alert(`✅ Pegawai "${name}" berhasil dihapus!`);
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('❌ Gagal menghapus pegawai: ' + error.message);
    }
  };

  // ✅ FUNGSI EXPORT EXCEL
  const exportToExcel = () => {
    console.log("📊 Exporting data:", employees.length, "records");
    
    if (!employees || employees.length === 0) {
      alert('⚠️ Tidak ada data untuk diexport!');
      return;
    }

    try {
      // Format data untuk export
      const exportData = employees.map(emp => ({
        'Nama Lengkap': emp.full_name || '-',
        'NIP': emp.nip || '-',
        'Jabatan': emp.position || '-',
        'Unit Kerja': emp.work_unit || '-',
        'Status': emp.status === 'aktif' ? '✅ Aktif' : emp.status === 'cuti' ? '⏳ Cuti' : '⚪ Nonaktif',
        'Jenis Kelamin': emp.gender === 'L' ? 'Laki-laki' : 'Perempuan',
        'No. Telepon': emp.phone || '-',
        'Email': emp.email || '-',
        'Tempat Lahir': emp.birthplace || '-',
        'Tanggal Lahir': emp.birth_date || '-',
        'Alamat': emp.address || '-',
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      
      // Atur lebar kolom
      ws['!cols'] = [
        { wch: 25 }, // Nama Lengkap
        { wch: 20 }, // NIP
        { wch: 20 }, // Jabatan
        { wch: 18 }, // Unit Kerja
        { wch: 12 }, // Status
        { wch: 15 }, // Jenis Kelamin
        { wch: 15 }, // No. Telepon
        { wch: 25 }, // Email
        { wch: 15 }, // Tempat Lahir
        { wch: 15 }, // Tanggal Lahir
        { wch: 30 }, // Alamat
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Data Pegawai');
      XLSX.writeFile(wb, `Data_Pegawai_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      console.log("✅ Export berhasil!");
      alert('✅ Export Excel berhasil! File telah terdownload.');
    } catch (error) {
      console.error("❌ Export error:", error);
      alert('❌ Gagal export: ' + error.message);
    }
  };

  // Filter data
  const filteredEmployees = employees.filter(emp => {
    const searchLower = search.toLowerCase();
    return (
      emp.nip?.toLowerCase().includes(searchLower) ||
      emp.full_name?.toLowerCase().includes(searchLower) ||
      emp.position?.toLowerCase().includes(searchLower) ||
      emp.work_unit?.toLowerCase().includes(searchLower)
    );
  });

  // Filter status
  const statusFiltered = filteredEmployees.filter(emp => {
    if (filterStatus === "semua") return true;
    if (filterStatus === "aktif") return emp.status === "aktif";
    if (filterStatus === "cuti") return emp.status === "cuti";
    return true;
  });

  const getStatusBadge = (status) => {
    if (status === "aktif") {
      return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">🟢 Aktif</span>;
    } else if (status === "cuti") {
      return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">🟡 Cuti</span>;
    }
    return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">⚪ Nonaktif</span>;
  };

  // Statistik
  const stats = {
    total: employees.length,
    aktif: employees.filter(e => e.status === "aktif").length,
    cuti: employees.filter(e => e.status === "cuti").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
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
          <p className="text-gray-500 text-sm mt-1">Kelola data pegawai RSUD Dr. Harjono S. Ponorogo</p>
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
          <p className="text-xs text-gray-500">Total Pegawai</p>
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
        <div className="bg-white rounded-lg shadow-sm p-3 border-l-4 border-emerald-600">
          <p className="text-xs text-gray-500">Export</p>
          <button
            onClick={exportToExcel}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-sm transition flex items-center justify-center gap-1"
          >
            <Download className="w-4 h-4" />
            Export Excel
          </button>
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
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {statusFiltered.length === 0 ? (
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {statusFiltered.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800">{emp.full_name}</div>
                      <div className="text-xs text-gray-400">{emp.position}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-sm text-gray-600">{emp.nip}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{emp.work_unit}</td>
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}