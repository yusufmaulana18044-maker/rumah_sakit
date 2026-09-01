// src/pages/KategoriDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Upload, FileText, Download, Trash2, Eye,
  CheckCircle, Clock, AlertCircle, Loader2
} from "lucide-react";
import { supabase } from "../supabase";

// ✅ MAPPING KATEGORI (14 kategori)
const KATEGORI_LIST = [
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

// ✅ MAPPING STATUS
const STATUS_MAP = {
  verified: { lbl: "Terverifikasi", cls: "bg-green-100 text-green-700" },
  pending: { lbl: "Menunggu", cls: "bg-yellow-100 text-yellow-700" },
  rejected: { lbl: "Perlu Revisi", cls: "bg-red-100 text-red-700" },
  ok: { lbl: "Terverifikasi", cls: "bg-green-100 text-green-700" },
  tunggu: { lbl: "Menunggu", cls: "bg-yellow-100 text-yellow-700" },
  revisi: { lbl: "Perlu Revisi", cls: "bg-red-100 text-red-700" },
};

export default function KategoriDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [kategori, setKategori] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({ total: 0, verified: 0, pending: 0, rejected: 0 });
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    const kat = KATEGORI_LIST.find(k => k.id === parseInt(id));
    if (kat) {
      setKategori(kat);
      fetchDocuments(kat.id);
    } else {
      setError("Kategori tidak ditemukan");
      setLoading(false);
    }
  }, [id]);

  // ✅ FETCH DOKUMEN DARI SUPABASE
  const fetchDocuments = async (categoryId) => {
    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase
        .from("dokumen")
        .select(`
          *,
          pegawai:pegawai_id (
            id,
            nama,
            nip,
            unit_kerja
          )
        `)
        .eq("kategori_id", categoryId)
        .order("tgl_upload", { ascending: false });

      if (error) throw error;

      // Format data
      const formattedDocs = data.map(doc => ({
        id: doc.id,
        name: doc.nama || "Dokumen",
        type: doc.type || "pdf",
        file_url: doc.file_url || "",
        file_path: doc.file_path || "",
        status: doc.status || "pending",
        uploaded_at: doc.tgl_upload ? new Date(doc.tgl_upload).toLocaleDateString("id-ID") : "-",
        employee: doc.pegawai?.nama || "Tidak diketahui",
        employee_id: doc.pegawai_id,
        nip: doc.pegawai?.nip || "-",
        unit: doc.pegawai?.unit_kerja || "-",
        number: doc.nomor || "-"
      }));

      setDocuments(formattedDocs);

      // Hitung statistik
      const verified = formattedDocs.filter(d => d.status === "verified" || d.status === "ok").length;
      const pending = formattedDocs.filter(d => d.status === "pending" || d.status === "tunggu").length;
      const rejected = formattedDocs.filter(d => d.status === "rejected" || d.status === "revisi").length;
      setStats({
        total: formattedDocs.length,
        verified,
        pending,
        rejected
      });

    } catch (error) {
      console.error("Error fetching documents:", error);
      setError("Gagal memuat data dokumen");
    } finally {
      setLoading(false);
    }
  };

  // ✅ HAPUS DOKUMEN
  const handleDeleteDoc = async (docId, docName) => {
    if (!window.confirm(`Yakin ingin menghapus dokumen "${docName}"?`)) return;
    
    setDeleting(docId);
    try {
      const { error } = await supabase
        .from("dokumen")
        .delete()
        .eq("id", docId);

      if (error) throw error;

      await fetchDocuments(parseInt(id));
      alert("✅ Dokumen berhasil dihapus!");

    } catch (error) {
      console.error("Error deleting document:", error);
      alert("❌ Gagal menghapus dokumen: " + error.message);
    } finally {
      setDeleting(null);
    }
  };

  // ✅ LIHAT PEGAWAI
  const handleViewEmployee = (doc) => {
    if (doc.employee_id) {
      navigate(`/employees/${doc.employee_id}`);
    } else {
      alert("Data pegawai tidak ditemukan");
    }
  };

  // ✅ DOWNLOAD DOKUMEN
  const handleDownload = (doc) => {
    if (doc.file_url) {
      window.open(doc.file_url, "_blank");
    } else {
      alert("📥 File tidak tersedia untuk didownload");
    }
  };

  // ✅ PREVIEW DOKUMEN
  const handlePreviewDoc = (doc) => {
    if (doc.file_url) {
      window.open(doc.file_url, '_blank');
    } else {
      alert(
        `📄 Detail Dokumen\n\n` +
        `Jenis: ${doc.type}\n` +
        `Nama: ${doc.name}\n` +
        `Nomor: ${doc.number || '-'}\n` +
        `Upload: ${doc.uploaded_at}\n` +
        `Status: ${doc.status || 'Belum diverifikasi'}`
      );
    }
  };

  // ✅ UPLOAD DOKUMEN
  const handleUpload = () => {
    navigate(`/kategori/${id}/upload`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
        <p className="text-gray-500 text-sm">Memuat dokumen...</p>
      </div>
    );
  }

  if (error || !kategori) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-500">{error || "Kategori tidak ditemukan"}</p>
        <button onClick={() => navigate("/dashboard")} className="mt-4 text-teal-600 hover:underline">
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tombol Kembali */}
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Dashboard
      </button>

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono bg-teal-100 text-teal-700 px-2 py-0.5 rounded">
                {String(kategori.id).padStart(2, "0")}
              </span>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{kategori.nama}</h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {stats.total} dokumen terupload
            </p>
          </div>
          <button
            onClick={handleUpload}
            className="bg-gradient-to-r from-teal-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Unggah Dokumen
          </button>
        </div>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border-l-4 border-teal-600">
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Dokumen</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border-l-4 border-green-600">
          <p className="text-xs text-gray-500 dark:text-gray-400">Terverifikasi</p>
          <p className="text-2xl font-bold text-green-700 dark:text-green-400">{stats.verified}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border-l-4 border-yellow-600">
          <p className="text-xs text-gray-500 dark:text-gray-400">Menunggu</p>
          <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">{stats.pending}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border-l-4 border-red-600">
          <p className="text-xs text-gray-500 dark:text-gray-400">Perlu Revisi</p>
          <p className="text-2xl font-bold text-red-700 dark:text-red-400">{stats.rejected}</p>
        </div>
      </div>

      {/* Tabel Dokumen */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
        {documents.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            <FileText className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-lg font-medium">Belum ada dokumen</p>
            <p className="text-sm mt-1">Pada kategori <strong>{kategori.nama}</strong></p>
            <p className="text-sm">Gunakan tombol <strong>Unggah Dokumen</strong> untuk menambahkan berkas pertama.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50 border-b dark:border-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Dokumen</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Pegawai</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">NIP</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Tanggal</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {documents.map((doc) => {
                  const status = STATUS_MAP[doc.status] || STATUS_MAP.pending;
                  return (
                    <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-800 dark:text-white">{doc.type?.toUpperCase() || "FILE"}</div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 truncate max-w-[200px]">{doc.name}</div>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleViewEmployee(doc)}
                          className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline text-left cursor-pointer"
                        >
                          {doc.employee}
                        </button>
                        <div className="text-xs text-gray-400 dark:text-gray-500">{doc.unit}</div>
                      </td>
                      <td className="px-4 py-3 font-mono text-sm text-gray-600 dark:text-gray-400">{doc.nip}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{doc.uploaded_at}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${status.cls}`}>
                          {status.lbl}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handlePreviewDoc(doc)}
                            className="p-1 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded transition"
                            title="Preview"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDownload(doc)}
                            className="p-1 text-teal-600 hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-teal-900/30 rounded transition"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteDoc(doc.id, doc.name)}
                            disabled={deleting === doc.id}
                            className="p-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded transition disabled:opacity-50"
                            title="Hapus"
                          >
                            {deleting === doc.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
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

      {/* Footer Info */}
      <div className="text-xs text-gray-400 dark:text-gray-500 text-center">
        Menampilkan {documents.length} dokumen dari kategori {kategori.nama}
      </div>
    </div>
  );
}