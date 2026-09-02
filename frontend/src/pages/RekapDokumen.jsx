// src/pages/RekapDokumen.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, Users, FileText, CheckCircle, XCircle, Clock,
  Loader2, Eye, Download, Printer, Filter, ClipboardList,
  UserCheck, UserX, TrendingUp, TrendingDown
} from "lucide-react";
import { supabase } from "../supabase";
import Breadcrumb from "../components/Breadcrumb";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const KATEGORI = [
  { id: 1, nama: "SK Pangkat (Mulai CPNS)" },
  { id: 2, nama: "SK Fungsional" },
  { id: 3, nama: "Data Pribadi" },
  { id: 4, nama: "Riwayat Pendidikan" },
  { id: 5, nama: "Uraian Tugas" },
  { id: 6, nama: "SPK RKK (Khusus Nakes)" },
  { id: 7, nama: "Penilaian Kinerja (SKP)" },
  { id: 8, nama: "SPMT" },
  { id: 9, nama: "Orientasi" },
  { id: 10, nama: "KGB" },
  { id: 11, nama: "Pengembangan Kompetensi" },
  { id: 12, nama: "Riwayat Jabatan" },
  { id: 13, nama: "Check Up" },
  { id: 14, nama: "Lain-lain" }
];

export default function RekapDokumen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pegawai, setPegawai] = useState([]);
  const [dokumen, setDokumen] = useState([]);
  const [selectedKategori, setSelectedKategori] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: pegawaiData, error: pegawaiError } = await supabase
        .from("pegawai")
        .select("id, full_name, nip, position, work_unit, status")
        .order("full_name", { ascending: true });

      if (pegawaiError) throw pegawaiError;

      const { data: dokumenData, error: dokumenError } = await supabase
        .from("dokumen")
        .select("employee_id, category, status, file_url");

      if (dokumenError) throw dokumenError;

      setPegawai(pegawaiData || []);
      setDokumen(dokumenData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDokumenStatus = (employeeId, kategoriId) => {
    const doc = dokumen.find(d => d.employee_id === employeeId && d.category === kategoriId);
    if (doc) {
      return {
        ada: true,
        status: doc.status,
        file_url: doc.file_url
      };
    }
    return { ada: false, status: null, file_url: null };
  };

  const getRekapData = () => {
    const kategori = KATEGORI.find(k => k.id === parseInt(selectedKategori));
    const data = pegawai.map(emp => {
      const docStatus = getDokumenStatus(emp.id, parseInt(selectedKategori));
      return {
        ...emp,
        dokumenAda: docStatus.ada,
        dokumenStatus: docStatus.status,
        file_url: docStatus.file_url
      };
    });

    let filtered = data.filter(emp =>
      emp.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.nip?.includes(searchTerm)
    );

    if (filterStatus === "sudah") {
      filtered = filtered.filter(emp => emp.dokumenAda === true);
    } else if (filterStatus === "belum") {
      filtered = filtered.filter(emp => emp.dokumenAda === false);
    }

    return {
      kategori,
      data: filtered,
      total: filtered.length,
      sudah: filtered.filter(emp => emp.dokumenAda).length,
      belum: filtered.filter(emp => !emp.dokumenAda).length
    };
  };

  const rekap = getRekapData();

  const exportToExcel = () => {
    const excelData = rekap.data.map(emp => ({
      'NIP': emp.nip || '-',
      'Nama': emp.full_name || '-',
      'Jabatan': emp.position || '-',
      'Unit Kerja': emp.work_unit || '-',
      'Status Pegawai': emp.status || '-',
      'Status Dokumen': emp.dokumenAda ? (emp.dokumenStatus || 'Terverifikasi') : 'Belum Upload'
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Rekap Dokumen');
    XLSX.writeFile(wb, `Rekap_${rekap.kategori?.nama || 'Dokumen'}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF('landscape', 'mm', 'a4');
    doc.setFontSize(16);
    doc.text(`Rekap Dokumen ${rekap.kategori?.nama || ''}`, 14, 22);
    doc.setFontSize(10);
    doc.text(`Dicetak: ${new Date().toLocaleDateString('id-ID')}`, 14, 30);
    doc.text(`Total: ${rekap.total} | Sudah: ${rekap.sudah} | Belum: ${rekap.belum}`, 14, 37);

    const tableData = rekap.data.map(emp => [
      emp.nip || '-',
      emp.full_name || '-',
      emp.position || '-',
      emp.work_unit || '-',
      emp.dokumenAda ? (emp.dokumenStatus || 'Terverifikasi') : 'Belum Upload'
    ]);

    autoTable(doc, {
      head: [['NIP', 'Nama', 'Jabatan', 'Unit Kerja', 'Status Dokumen']],
      body: tableData,
      startY: 42,
      styles: { fontSize: 7, cellPadding: 1.5 },
      headStyles: { fillColor: [13, 148, 136], textColor: [255, 255, 255], fontSize: 8, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    doc.save(`Rekap_${rekap.kategori?.nama || 'Dokumen'}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
        <p className="text-gray-500">Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb 
        customItems={[
          { label: 'Dashboard', url: '/dashboard' },
          { label: 'Rekap Kelengkapan', isLast: true }
        ]}
      />

      {/* Header dengan Background Gradien */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur p-3 rounded-xl">
                <ClipboardList className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">📊 Rekap Kelengkapan Dokumen</h1>
                <p className="text-teal-100 text-sm mt-0.5">Lihat siapa saja yang sudah dan belum mengumpulkan dokumen</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={exportToExcel}
              className="bg-white/20 hover:bg-white/30 backdrop-blur text-white px-4 py-2 rounded-lg transition flex items-center gap-2 border border-white/20"
            >
              <Download className="w-4 h-4" />
              Excel
            </button>
            <button
              onClick={exportToPDF}
              className="bg-white/20 hover:bg-white/30 backdrop-blur text-white px-4 py-2 rounded-lg transition flex items-center gap-2 border border-white/20"
            >
              <Printer className="w-4 h-4" />
              PDF
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards - Modern dengan Icon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Pegawai</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{rekap.total}</p>
            </div>
            <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/50 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">✅ Sudah Upload</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{rekap.sudah}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">❌ Belum Upload</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{rekap.belum}</p>
            </div>
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center">
              <UserX className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">📈 Persentase</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {rekap.total > 0 ? Math.round((rekap.sudah / rekap.total) * 100) : 0}%
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar Kelengkapan */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Kelengkapan Dokumen {rekap.kategori?.nama || ''}
          </span>
          <span className="text-sm font-bold text-teal-600 dark:text-teal-400">
            {rekap.total > 0 ? Math.round((rekap.sudah / rekap.total) * 100) : 0}%
          </span>
        </div>
        <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-teal-500 to-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${rekap.total > 0 ? (rekap.sudah / rekap.total) * 100 : 0}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-400 dark:text-gray-500">
          <span>{rekap.sudah} sudah upload</span>
          <span>{rekap.belum} belum upload</span>
        </div>
      </div>

      {/* Filter - Lebih Modern */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Pilih Kategori */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
              📂 Pilih Kategori Dokumen
            </label>
            <select
              value={selectedKategori}
              onChange={(e) => setSelectedKategori(parseInt(e.target.value))}
              className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-teal-400 focus:outline-none bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm"
            >
              {KATEGORI.map((k) => (
                <option key={k.id} value={k.id}>
                  {String(k.id).padStart(2, "0")} - {k.nama}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
              🔍 Cari Pegawai
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="NIP atau Nama..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-teal-400 focus:outline-none bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm"
              />
            </div>
          </div>

          {/* Filter Status */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
              🎯 Filter Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-teal-400 focus:outline-none bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm"
            >
              <option value="semua">📂 Semua</option>
              <option value="sudah">✅ Sudah Upload</option>
              <option value="belum">❌ Belum Upload</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabel - Lebih Rapi */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-teal-50 dark:from-gray-700/50 dark:to-teal-900/20 border-b dark:border-gray-700">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">No</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">NIP</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nama Pegawai</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Jabatan</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Unit Kerja</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {rekap.data.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center text-gray-500 dark:text-gray-400">
                    <FileText className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="font-medium">Tidak ada data pegawai</p>
                    <p className="text-sm mt-1">Coba ubah filter atau kategori yang dipilih</p>
                  </td>
                </tr>
              ) : (
                rekap.data.map((emp, index) => (
                  <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-150">
                    <td className="px-4 py-3.5 text-sm text-gray-500 dark:text-gray-400 font-medium">{index + 1}</td>
                    <td className="px-4 py-3.5 font-mono text-sm font-medium text-gray-700 dark:text-gray-300">{emp.nip || '-'}</td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-gray-800 dark:text-white">{emp.full_name}</div>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-600 dark:text-gray-400">{emp.position || '-'}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-600 dark:text-gray-400">{emp.work_unit || '-'}</td>
                    <td className="px-4 py-3.5 text-center">
                      {emp.dokumenAda ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 shadow-sm">
                          <CheckCircle className="w-3.5 h-3.5" />
                          {emp.dokumenStatus || 'Terverifikasi'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 shadow-sm">
                          <XCircle className="w-3.5 h-3.5" />
                          Belum Upload
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {emp.dokumenAda ? (
                        <button
                          onClick={() => navigate(`/employees/${emp.id}`)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 rounded-lg transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Detail
                        </button>
                      ) : (
                        <button
                          onClick={() => navigate(`/kategori/${selectedKategori}/upload`)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-teal-50 text-teal-600 hover:bg-teal-100 dark:bg-teal-900/30 dark:text-teal-400 dark:hover:bg-teal-900/50 rounded-lg transition"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Upload
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 shadow-sm border border-gray-100 dark:border-gray-700">
          <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            Sudah: <strong className="text-green-600 dark:text-green-400">{rekap.sudah}</strong>
          </span>
          <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            Belum: <strong className="text-red-600 dark:text-red-400">{rekap.belum}</strong>
          </span>
          <span className="text-gray-400">|</span>
          <span className="text-gray-500 dark:text-gray-400">
            Total: <strong className="text-gray-800 dark:text-white">{rekap.data.length}</strong> dari <strong>{pegawai.length}</strong> pegawai
          </span>
        </div>
        <div className="text-xs text-gray-400 dark:text-gray-500">
          Kategori: <span className="font-medium text-gray-600 dark:text-gray-300">{rekap.kategori?.nama || '-'}</span>
        </div>
      </div>
    </div>
  );
}