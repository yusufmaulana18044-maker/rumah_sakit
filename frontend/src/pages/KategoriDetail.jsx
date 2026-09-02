// src/pages/KategoriDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Upload, FileText, Download, Trash2, Eye,
  CheckCircle, Clock, AlertCircle, Loader2, X
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
  rejected: { lbl: "Perlu Revisi", cls: "bg-red-100 text-red-700" },
  ok: { lbl: "Terverifikasi", cls: "bg-green-100 text-green-700" },
  tunggu: { lbl: "Menunggu", cls: "bg-yellow-100 text-yellow-700" },
  revisi: { lbl: "Perlu Revisi", cls: "bg-red-100 text-red-700" },
};

function UploadModal({ isOpen, onClose, onUpload, kategoriName, isLoading }) {
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    date: "",
    file: null
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("❌ Ukuran file maksimal 5 MB!");
        e.target.value = "";
        return;
      }
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        alert("❌ Hanya file PDF, JPG, JPEG, PNG yang diizinkan!");
        e.target.value = "";
        return;
      }
      setSelectedFile(file);
      setFormData(prev => ({
        ...prev,
        file: file,
        name: file.name.replace(/\.[^/.]+$/, "")
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file) {
      alert("Mohon pilih file yang akan diupload");
      return;
    }
    await onUpload(formData);
    onClose();
    setFormData({ name: "", number: "", date: "", file: null });
    setSelectedFile(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center">
              <Upload className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">Upload Dokumen</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Kategori: {kategoriName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" disabled={isLoading}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nama File <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-teal-400 focus:outline-none dark:bg-gray-700 dark:text-white"
              placeholder="Nama file akan terisi otomatis"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nomor Surat <span className="text-gray-400 text-xs">(opsional)</span>
            </label>
            <input
              type="text"
              name="number"
              value={formData.number}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-teal-400 focus:outline-none dark:bg-gray-700 dark:text-white"
              placeholder="Contoh: 800/123/SK/2024"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tanggal Dokumen <span className="text-gray-400 text-xs">(opsional)</span>
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-teal-400 focus:outline-none dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Pilih File <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-teal-400 transition">
              <input
                type="file"
                onChange={handleFileChange}
                required
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                id="fileInput"
              />
              <label htmlFor="fileInput" className="cursor-pointer block">
                {selectedFile ? (
                  <div className="flex items-center justify-center gap-3 text-teal-600 dark:text-teal-400">
                    <FileText className="w-8 h-8" />
                    <div className="text-left">
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-xs text-gray-400">
                        {Math.round(selectedFile.size / 1024)} KB • {selectedFile.type}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">Klik atau seret file ke sini</p>
                    <p className="text-xs text-gray-400 mt-1">Format: PDF, PNG, JPG • Maks 5 MB</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:from-teal-700 hover:to-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Mengupload...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
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
  const [stats, setStats] = useState({ total: 0, verified: 0, pending: 0, rejected: 0 });

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
        number: doc.number || "-"
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

  // ✅ SKELETON LOADING
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
    </div>
  );
}