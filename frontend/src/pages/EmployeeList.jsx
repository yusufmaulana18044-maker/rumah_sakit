// src/pages/EmployeeList.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Eye, Edit, Trash2, Users, Loader2, Download, FileSpreadsheet, FileText } from "lucide-react";
import { supabase } from "../supabase";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import SkeletonLoader from "../components/SkeletonLoader";
import Breadcrumb from "../components/Breadcrumb";

// 14 Kategori Dokumen
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

// ============================================
// KOMPONEN EXPORT BUTTON (TERINTEGRASI)
// ============================================
function ExportButton({ data, filename = 'laporan-pegawai', className = '' }) {
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const columns = [
    { key: 'nip', label: 'NIP' },
    { key: 'full_name', label: 'Nama Lengkap' },
    { key: 'position', label: 'Jabatan' },
    { key: 'work_unit', label: 'Unit Kerja' },
    { key: 'status', label: 'Status' },
    { key: 'phone', label: 'Telepon' },
    { key: 'email', label: 'Email' },
    { key: 'address', label: 'Alamat' },
    { key: 'dokumenCount', label: 'Jumlah Dokumen' },
  ];

  const exportToExcel = () => {
    setLoading(true);
    try {
      const excelData = data.map(row => {
        const obj = {};
        columns.forEach(col => {
          let value = row[col.key] !== undefined && row[col.key] !== null ? row[col.key] : '-';
          obj[col.label] = value;
        });
        return obj;
      });

      const ws = XLSX.utils.json_to_sheet(excelData);
      const colWidths = columns.map(col => ({
        wch: Math.max(col.label.length * 2, 12)
      }));
      ws['!cols'] = colWidths;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Pegawai');
      XLSX.writeFile(wb, `${filename}.xlsx`);
      
      setLoading(false);
      setShowMenu(false);
      alert('✅ Export Excel berhasil!');
    } catch (error) {
      console.error('Export Excel error:', error);
      alert('❌ Gagal export Excel: ' + error.message);
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    setLoading(true);
    try {
      const doc = new jsPDF('landscape', 'mm', 'a4');
      
      doc.setFontSize(16);
      doc.text('Laporan Data Pegawai', 14, 22);
      doc.setFontSize(10);
      doc.text(`Dicetak: ${new Date().toLocaleDateString('id-ID')}`, 14, 30);
      
      const tableData = data.map(row => {
        return columns.map(col => {
          const value = row[col.key] !== undefined && row[col.key] !== null ? row[col.key] : '-';
          return String(value);
        });
      });

      const tableHeaders = columns.map(col => col.label);

      autoTable(doc, {
        head: [tableHeaders],
        body: tableData,
        startY: 38,
        styles: { fontSize: 7, cellPadding: 1.5 },
        headStyles: { fillColor: [13, 148, 136], textColor: [255, 255, 255], fontSize: 8, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [240, 240, 240] },
        didDrawPage: function(data) {
          doc.setFontSize(8);
          doc.text(
            `Halaman ${data.pageNumber} - SICAKEP v2.0`,
            doc.internal.pageSize.getWidth() / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
          );
        },
      });

      doc.save(`${filename}.pdf`);
      setLoading(false);
      setShowMenu(false);
      alert('✅ Export PDF berhasil!');
    } catch (error) {
      console.error('Export PDF error:', error);
      alert('❌ Gagal export PDF: ' + error.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <button className={`flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-lg ${className}`} disabled>
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading...
      </button>
    );
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={`flex items-center gap-2 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition shadow-md ${className}`}
      >
        <Download className="w-4 h-4" />
        Ekspor Data
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 overflow-hidden">
          <button
            onClick={exportToExcel}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 dark:hover:bg-green-900/20 transition text-left text-sm text-gray-700 dark:text-gray-300"
          >
            <FileSpreadsheet className="w-4 h-4 text-green-600" />
            <span>Export ke Excel</span>
          </button>
          <button
            onClick={exportToPDF}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition text-left text-sm text-gray-700 dark:text-gray-300 border-t border-gray-100 dark:border-gray-700"
          >
            <FileText className="w-4 h-4 text-red-600" />
            <span>Export ke PDF</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================
// MAIN COMPONENT EMPLOYEE LIST
// ============================================
export default function EmployeeList() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    setError("");
    try {
      const { data: pegawai, error: pegawaiError } = await supabase
        .from("pegawai")
        .select("*")
        .order("full_name", { ascending: true });

      if (pegawaiError) throw pegawaiError;

      const employeesWithDocs = await Promise.all(
        (pegawai || []).map(async (emp) => {
          const { data: docs, error: docsError } = await supabase
            .from("dokumen")
            .select("category")
            .eq("employee_id", emp.id);

          if (docsError) throw docsError;

          const docCategories = docs.map(doc => doc.category);
          const kelengkapan = KATEGORI.map((_, index) => 
            docCategories.includes(index + 1) ? "isi" : ""
          );

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
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Yakin ingin menghapus pegawai "${name}"?`)) return;
    
    try {
      const { error: docError } = await supabase
        .from("dokumen")
        .delete()
        .eq("employee_id", id);

      if (docError) console.error("Error deleting documents:", docError);

      const { error } = await supabase
        .from("pegawai")
        .delete()
        .eq("id", id);

      if (error) throw error;

      await fetchEmployees();
      alert(`✅ Pegawai "${name}" berhasil dihapus!`);
    } catch (error) {
      console.error("Delete error:", error);
      alert("❌ Gagal menghapus pegawai: " + error.message);
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const searchLower = search.toLowerCase();
    const matchesSearch = 
      emp.nip?.toLowerCase().includes(searchLower) ||
      emp.full_name?.toLowerCase().includes(searchLower) ||
      emp.position?.toLowerCase().includes(searchLower) ||
      emp.work_unit?.toLowerCase().includes(searchLower);
    
    const matchesStatus = filterStatus === "semua" || emp.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    if (status === "aktif") {
      return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">Aktif</span>;
    } else if (status === "cuti") {
      return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300">Cuti</span>;
    }
    return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">-</span>;
  };

  const stats = {
    total: employees.length,
    aktif: employees.filter(e => e.status === "aktif").length,
    cuti: employees.filter(e => e.status === "cuti").length,
    dokumen: employees.reduce((sum, e) => sum + (e.dokumenCount || 0), 0)
  };

  // ✅ SKELETON LOADING
  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded mt-2 animate-pulse"></div>
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="h-10 w-36 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 border-l-4 border-gray-200 dark:border-gray-700">
              <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-6 w-8 bg-gray-200 dark:bg-gray-700 rounded mt-1 animate-pulse"></div>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          <div className="h-10 w-40 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden p-4">
          <SkeletonLoader type="table" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">📋 Data Pegawai</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Kelola data pegawai RSUD Dr. Harjono S. Ponorogo</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <ExportButton data={employees} filename="laporan-pegawai" />
          <button
            onClick={() => navigate("/employees/new")}
            className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Tambah Pegawai
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 border-l-4 border-teal-600 hover:scale-[1.02] transition-transform duration-200">
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Pegawai</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 border-l-4 border-green-600 hover:scale-[1.02] transition-transform duration-200">
          <p className="text-xs text-gray-500 dark:text-gray-400">Aktif</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">{stats.aktif}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 border-l-4 border-yellow-600 hover:scale-[1.02] transition-transform duration-200">
          <p className="text-xs text-gray-500 dark:text-gray-400">Cuti</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">{stats.cuti}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 border-l-4 border-blue-600 hover:scale-[1.02] transition-transform duration-200">
          <p className="text-xs text-gray-500 dark:text-gray-400">Dokumen</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">{stats.dokumen}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari NIP, Nama, atau Jabatan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-teal-400 focus:outline-none bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-teal-400 focus:outline-none bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
        >
          <option value="semua">Semua Status</option>
          <option value="aktif">Aktif</option>
          <option value="cuti">Cuti</option>
        </select>
        <button 
          onClick={() => setSearch("")}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition text-gray-700 dark:text-gray-300"
        >
          Reset
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        {filteredEmployees.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <Users className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p>Tidak ada data pegawai</p>
            <p className="text-sm mt-1">Tambahkan pegawai baru dengan tombol "Tambah Pegawai"</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50 border-b dark:border-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Pegawai</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">NIP</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Unit Kerja</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Kelengkapan</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredEmployees.map((emp) => {
                  const filled = emp.kelengkapan?.filter(s => s === "isi").length || 0;
                  return (
                    <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-800 dark:text-white">{emp.full_name}</div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">{emp.position}</div>
                      </td>
                      <td className="px-4 py-3 font-mono text-sm text-gray-600 dark:text-gray-400">{emp.nip}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{emp.work_unit}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-0.5">
                          {emp.kelengkapan?.map((s, i) => (
                            <div key={i} className={`w-2.5 h-3.5 rounded-sm ${s === "isi" ? "bg-teal-600" : "bg-gray-200 dark:bg-gray-600"}`} title={KATEGORI[i]} />
                          ))}
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{filled} dari 14 kategori terisi</p>
                      </td>
                      <td className="px-4 py-3">{getStatusBadge(emp.status)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => navigate(`/employees/${emp.id}`)} className="p-1 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded transition" title="Lihat Detail">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => navigate(`/employees/${emp.id}/edit`)} className="p-1 text-teal-600 hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-teal-900/30 rounded transition" title="Edit">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(emp.id, emp.full_name)} className="p-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded transition" title="Hapus">
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

      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-teal-600 rounded-sm inline-block"></span> kategori terisi
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-gray-200 dark:bg-gray-600 rounded-sm inline-block"></span> belum ada berkas
        </span>
      </div>
    </div>
  );
}