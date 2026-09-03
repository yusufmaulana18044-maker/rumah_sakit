// src/pages/KategoriDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Upload, FileText, Download, Trash2, Eye,
  CheckCircle, Clock, AlertCircle, Loader2, X, 
  XCircle, Edit // ✅ TAMBAHKAN XCircle & Edit
} from "lucide-react";
import { supabase } from "../supabase";
import SkeletonLoader from "../components/SkeletonLoader";
import Breadcrumb from "../components/Breadcrumb";

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

const STATUS_MAP = {
  verified: { lbl: "Terverifikasi", cls: "bg-green-100 text-green-700" },
  pending: { lbl: "Menunggu", cls: "bg-yellow-100 text-yellow-700" },
  rejected: { lbl: "Ditolak", cls: "bg-red-100 text-red-700" },
  ok: { lbl: "Terverifikasi", cls: "bg-green-100 text-green-700" },
  tunggu: { lbl: "Menunggu", cls: "bg-yellow-100 text-yellow-700" },
  revisi: { lbl: "Perlu Revisi", cls: "bg-red-100 text-red-700" },
};

function UploadModal({ isOpen, onClose, onUpload, kategoriName, isLoading }) {
  // ... (sama seperti sebelumnya, tidak berubah)
}

export default function KategoriDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [kategori, setKategori] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [verifying, setVerifying] = useState(null); // ✅ TAMBAHKAN
  const [stats, setStats] = useState({ total: 0, verified: 0, pending: 0, rejected: 0 });
  const [role, setRole] = useState(''); // ✅ TAMBAHKAN
  const [showRejectModal, setShowRejectModal] = useState(false); // ✅ TAMBAHKAN
  const [selectedDoc, setSelectedDoc] = useState(null); // ✅ TAMBAHKAN
  const [rejectReason, setRejectReason] = useState(''); // ✅ TAMBAHKAN

  useEffect(() => {
    const userRole = localStorage.getItem('role');
    setRole(userRole || '');
    
    const kat = KATEGORI_LIST.find(k => k.id === parseInt(id));
    if (kat) {
      setKategori(kat);
      fetchDocuments(kat.id);
    } else {
      setError("Kategori tidak ditemukan");
      setLoading(false);
    }
  }, [id]);

  const fetchDocuments = async (categoryId) => {
    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase
        .from("dokumen")
        .select(`
          *,
          pegawai:employee_id (
            id,
            full_name,
            nip,
            work_unit
          )
        `)
        .eq("category", categoryId)
        .order("uploaded_at", { ascending: false });

      if (error) throw error;

      const formattedDocs = data.map(doc => ({
        id: doc.id,
        name: doc.name || "Dokumen",
        type: doc.type || "pdf",
        file_url: doc.file_url || "",
        file_path: doc.file_path || "",
        status: doc.status || "pending",
        uploaded_at: doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleDateString("id-ID") : "-",
        employee: doc.pegawai?.full_name || "Tidak diketahui",
        employee_id: doc.employee_id,
        nip: doc.pegawai?.nip || "-",
        unit: doc.pegawai?.work_unit || "-",
        number: doc.number || "-",
        catatan_revisi: doc.catatan_revisi || "" // ✅ TAMBAHKAN
      }));

      setDocuments(formattedDocs);

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

  // ✅ FUNGSI VERIFIKASI
  const handleVerifikasi = async (docId, newStatus, catatan = '') => {
    setVerifying(docId);
    try {
      const updateData = { status: newStatus };
      if (newStatus === 'rejected' && catatan) {
        updateData.catatan_revisi = catatan;
      }
      
      const { error } = await supabase
        .from("dokumen")
        .update(updateData)
        .eq("id", docId);

      if (error) throw error;
      
      await fetchDocuments(parseInt(id));
      
      const statusLabels = {
        verified: 'Terverifikasi',
        pending: 'Pending',
        rejected: 'Ditolak'
      };
      alert(`✅ Status dokumen diubah menjadi "${statusLabels[newStatus]}"!`);
    } catch (error) {
      console.error("Error verifying document:", error);
      alert("❌ Gagal mengubah status: " + error.message);
    } finally {
      setVerifying(null);
      setShowRejectModal(false);
      setSelectedDoc(null);
      setRejectReason('');
    }
  };

  const handleDeleteDoc = async (docId, docName, filePath) => {
    if (!window.confirm(`Yakin ingin menghapus dokumen "${docName}"?`)) return;
    setDeleting(docId);
    try {
      if (filePath) {
        const { error: deleteError } = await supabase.storage
          .from('documents')
          .remove([filePath]);
        if (deleteError) console.error("Delete storage error:", deleteError);
      }

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

  const handleViewEmployee = (doc) => {
    if (doc.employee_id) {
      navigate(`/employees/${doc.employee_id}`);
    } else {
      alert("Data pegawai tidak ditemukan");
    }
  };

  const handleDownload = (doc) => {
    if (doc.file_url) {
      window.open(doc.file_url, "_blank");
    } else {
      alert("📥 File tidak tersedia untuk didownload");
    }
  };

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

  const handleUpload = async (formData) => {
    if (!kategori) return;
    setIsLoading(true);
    try {
      const nipInput = prompt("Masukkan NIP pegawai:");
      if (!nipInput) {
        setIsLoading(false);
        return;
      }

      const { data: empData, error: empError } = await supabase
        .from("pegawai")
        .select("id")
        .eq("nip", nipInput)
        .single();

      if (empError || !empData) {
        alert("❌ Pegawai dengan NIP tersebut tidak ditemukan!");
        setIsLoading(false);
        return;
      }

      const file = formData.file;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${empData.id}.${fileExt}`;
      const filePath = `pegawai/${empData.id}/${kategori.nama}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        alert("Gagal upload file: " + uploadError.message);
        setIsLoading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      const newDoc = {
        employee_id: empData.id,
        type: kategori.nama,
        name: formData.name || file.name,
        number: formData.number || "-",
        uploaded_at: new Date().toISOString(),
        status: "pending",
        file_url: urlData.publicUrl,
        file_path: filePath,
        category: kategori.id
      };

      const { error: dbError } = await supabase
        .from('dokumen')
        .insert([newDoc]);

      if (dbError) {
        console.error("DB Error:", dbError);
        alert("Gagal simpan data dokumen: " + dbError.message);
        setIsLoading(false);
        return;
      }

      await fetchDocuments(kategori.id);
      alert("✅ Dokumen berhasil diupload!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("❌ Terjadi kesalahan: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mt-2 animate-pulse"></div>
            </div>
            <div className="h-10 w-36 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border-l-4 border-gray-200 dark:border-gray-700">
              <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-7 w-10 bg-gray-200 dark:bg-gray-700 rounded mt-1 animate-pulse"></div>
            </div>
          ))}
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 p-4">
          <SkeletonLoader type="table" />
        </div>
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
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <Breadcrumb 
        customItems={[
          { label: 'Kategori', url: '/dashboard' },
          { label: kategori?.nama || 'Detail', isLast: true }
        ]}
      />
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Dashboard
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300 px-2 py-0.5 rounded">
                {String(kategori.id).padStart(2, "0")}
              </span>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{kategori.nama}</h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{stats.total} dokumen terupload</p>
          </div>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            disabled={isLoading}
            className="bg-gradient-to-r from-teal-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition flex items-center gap-2 disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            Unggah Dokumen
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border-l-4 border-teal-600 hover:scale-[1.02] transition-transform duration-200">
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Dokumen</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border-l-4 border-green-600 hover:scale-[1.02] transition-transform duration-200">
          <p className="text-xs text-gray-500 dark:text-gray-400">Terverifikasi</p>
          <p className="text-2xl font-bold text-green-700 dark:text-green-400">{stats.verified}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border-l-4 border-yellow-600 hover:scale-[1.02] transition-transform duration-200">
          <p className="text-xs text-gray-500 dark:text-gray-400">Menunggu</p>
          <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">{stats.pending}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border-l-4 border-red-600 hover:scale-[1.02] transition-transform duration-200">
          <p className="text-xs text-gray-500 dark:text-gray-400">Perlu Revisi</p>
          <p className="text-2xl font-bold text-red-700 dark:text-red-400">{stats.rejected}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
        {documents.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            <FileText className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-lg font-medium">Belum ada dokumen</p>
            <p className="text-sm mt-1">Pada kategori <strong className="text-gray-700 dark:text-gray-300">{kategori.nama}</strong></p>
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
                  {/* ✅ KOLOM VERIFIKASI UNTUK ADMIN */}
                  {role === 'admin' && (
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Verifikasi</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {documents.map((doc) => {
                  const status = STATUS_MAP[doc.status] || STATUS_MAP.pending;
                  return (
                    <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-800 dark:text-white">{doc.type}</div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 truncate max-w-[200px]">{doc.name}</div>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleViewEmployee(doc)} className="font-medium text-blue-600 hover:text-blue-800 hover:underline text-left cursor-pointer dark:text-blue-400 dark:hover:text-blue-300">
                          {doc.employee}
                        </button>
                        <div className="text-xs text-gray-400 dark:text-gray-500">{doc.unit}</div>
                      </td>
                      <td className="px-4 py-3 font-mono text-sm text-gray-600 dark:text-gray-400">{doc.nip}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{doc.uploaded_at}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${status.cls}`}>{status.lbl}</span>
                        {doc.catatan_revisi && doc.status === 'rejected' && (
                          <div className="text-xs text-red-500 mt-1 truncate max-w-[150px]" title={doc.catatan_revisi}>
                            📝 {doc.catatan_revisi}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => handlePreviewDoc(doc)} className="p-1 text-blue-600 hover:bg-blue-50 rounded transition dark:text-blue-400 dark:hover:bg-blue-900/30" title="Preview Dokumen">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDownload(doc)} className="p-1 text-teal-600 hover:bg-teal-50 rounded transition dark:text-teal-400 dark:hover:bg-teal-900/30" title="Download">
                            <Download className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteDoc(doc.id, doc.name, doc.file_path)} disabled={deleting === doc.id} className="p-1 text-red-600 hover:bg-red-50 rounded transition disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-900/30" title="Hapus">
                            {deleting === doc.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                      {/* ✅ TOMBOL VERIFIKASI UNTUK ADMIN */}
                      {role === 'admin' && (
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleVerifikasi(doc.id, 'verified')}
                              disabled={verifying === doc.id || doc.status === 'verified'}
                              className={`p-1 rounded transition ${doc.status === 'verified' ? 'text-green-300 cursor-not-allowed' : 'text-green-600 hover:bg-green-50'}`}
                              title="Terverifikasi"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedDoc(doc);
                                setShowRejectModal(true);
                              }}
                              disabled={verifying === doc.id || doc.status === 'rejected'}
                              className={`p-1 rounded transition ${doc.status === 'rejected' ? 'text-red-300 cursor-not-allowed' : 'text-red-600 hover:bg-red-50'}`}
                              title="Tolak"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleVerifikasi(doc.id, 'pending')}
                              disabled={verifying === doc.id || doc.status === 'pending'}
                              className={`p-1 rounded transition ${doc.status === 'pending' ? 'text-yellow-300 cursor-not-allowed' : 'text-yellow-600 hover:bg-yellow-50'}`}
                              title="Pending"
                            >
                              <Clock className="w-4 h-4" />
                            </button>
                          </div>
                          {verifying === doc.id && <Loader2 className="w-4 h-4 animate-spin text-teal-600" />}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="text-xs text-gray-400 dark:text-gray-500 text-center">
        Menampilkan {documents.length} dokumen dari kategori {kategori.nama}
      </div>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUpload}
        kategoriName={kategori.nama}
        isLoading={isLoading}
      />

      {/* ✅ MODAL TOLAK DENGAN CATATAN */}
      {showRejectModal && selectedDoc && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">Tolak Dokumen</h3>
              <button onClick={() => setShowRejectModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Berikan alasan penolakan untuk dokumen <strong>"{selectedDoc.name}"</strong>
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Contoh: Dokumen tidak lengkap, mohon upload ulang dengan data yang benar."
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-teal-400 focus:outline-none dark:bg-gray-700 dark:text-white min-h-[100px]"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  if (!rejectReason.trim()) {
                    alert('Silakan isi alasan penolakan!');
                    return;
                  }
                  handleVerifikasi(selectedDoc.id, 'rejected', rejectReason);
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Tolak
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}