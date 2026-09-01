// src/pages/EmployeeDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import {
  ArrowLeft, Upload, FileText, Download, Trash2, User, Briefcase,
  Calendar, Phone, Mail, MapPin, X, Loader2, Eye, EyeOff,
  Award, GraduationCap, CreditCard, Users, Building2,
  CheckCircle, Clock, AlertCircle
} from "lucide-react";

// 14 Kategori Dokumen
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
  { id: 14, nama: "Lain-lain" },
];

const documentTypes = KATEGORI.map(k => k.nama);

// ✅ MAPPING STATUS
const STATUS_MAP = {
  verified: { lbl: "Terverifikasi", cls: "bg-green-100 text-green-700" },
  pending: { lbl: "Menunggu", cls: "bg-yellow-100 text-yellow-700" },
  rejected: { lbl: "Perlu Revisi", cls: "bg-red-100 text-red-700" },
};

// ============================================
// COMPONENT MODAL UPLOAD
// ============================================
function UploadModal({ isOpen, onClose, onUpload, employeeName, isLoading }) {
  const [formData, setFormData] = useState({
    type: "",
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
      // Validasi ukuran (5 MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("❌ Ukuran file maksimal 5 MB!");
        e.target.value = "";
        return;
      }

      // Validasi format
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
        name: file.name.replace(/\.[^/.]+$/, "") // Auto-fill nama file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.type || !formData.file) {
      alert("Mohon lengkapi semua field yang diperlukan");
      return;
    }
    await onUpload(formData);
    onClose();
    // Reset form
    setFormData({ type: "", name: "", number: "", date: "", file: null });
    setSelectedFile(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center">
              <Upload className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">Upload Dokumen</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{employeeName}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Jenis Dokumen */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Jenis Dokumen <span className="text-red-500">*</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-teal-400 focus:outline-none dark:bg-gray-700 dark:text-white"
            >
              <option value="">-- Pilih Jenis Dokumen --</option>
              {documentTypes.map(doc => (
                <option key={doc} value={doc}>{doc}</option>
              ))}
            </select>
          </div>

          {/* Nama File (Auto-fill) */}
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

          {/* Nomor Surat */}
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

          {/* Tanggal Dokumen */}
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

          {/* Pilih File */}
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
                    <p className="text-xs text-gray-400 mt-1">
                      Format: PDF, PNG, JPG • Maks 5 MB
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Tombol Aksi */}
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

// ============================================
// MAIN COMPONENT EMPLOYEE DETAIL
// ============================================
export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAllBio, setShowAllBio] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [stats, setStats] = useState({ total: 0, verified: 0, pending: 0, rejected: 0 });

  // Ambil data pegawai dari Supabase
  useEffect(() => {
    const fetchEmployee = async () => {
      setIsLoading(true);
      try {
        // 1. Ambil data pegawai
        const { data: empData, error: empError } = await supabase
          .from("pegawai")
          .select("*")
          .eq("id", id)
          .single();

        if (empError) throw empError;
        setEmployee(empData);

        // 2. Ambil dokumen pegawai
        const { data: docData, error: docError } = await supabase
          .from("dokumen")
          .select("*")
          .eq("employee_id", id)
          .order("uploaded_at", { ascending: false });

        if (docError) throw docError;
        
        const formattedDocs = docData || [];
        setDocuments(formattedDocs);

        // Hitung statistik
        const verified = formattedDocs.filter(d => d.status === "verified").length;
        const pending = formattedDocs.filter(d => d.status === "pending").length;
        const rejected = formattedDocs.filter(d => d.status === "rejected").length;
        setStats({
          total: formattedDocs.length,
          verified,
          pending,
          rejected
        });

      } catch (error) {
        console.error("Error fetching employee:", error);
        alert("Gagal mengambil data pegawai");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchEmployee();
  }, [id]);

  // ============================================
  // FUNGSI UPLOAD KE SUPABASE
  // ============================================
  const handleUpload = async (formData) => {
    setIsLoading(true);
    try {
      const file = formData.file;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${employee.id}.${fileExt}`;
      const filePath = `pegawai/${employee.id}/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
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

      // Cari ID kategori dari nama dokumen
      const kategori = KATEGORI.find(k => k.nama === formData.type);
      
      const newDoc = {
        id: Date.now(),
        employee_id: employee.id,
        type: formData.type,
        name: formData.name,
        number: formData.number || "-",
        uploaded_at: new Date().toISOString(),
        status: "pending",
        file_url: urlData.publicUrl,
        file_path: filePath,
        file_name: fileName,
        file_size: file.size,
        file_type: file.type,
        category: kategori ? kategori.id : 14 // default ke "Lain-lain"
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

      setDocuments(prev => [newDoc, ...prev]);
      
      // Update statistik
      setStats(prev => ({
        ...prev,
        total: prev.total + 1,
        pending: prev.pending + 1
      }));
      
      alert("✅ Dokumen berhasil diupload!");

    } catch (error) {
      console.error("Upload error:", error);
      alert("❌ Terjadi kesalahan: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // FUNGSI HAPUS DOKUMEN
  // ============================================
  const handleDeleteDoc = async (docId, docName, filePath) => {
    if (!window.confirm(`Yakin ingin menghapus dokumen "${docName}"?`)) return;

    setDeleting(docId);
    try {
      if (filePath) {
        const { error: deleteError } = await supabase.storage
          .from('documents')
          .remove([filePath]);

        if (deleteError) {
          console.error("Delete storage error:", deleteError);
        }
      }

      const { error: dbError } = await supabase
        .from('dokumen')
        .delete()
        .eq('id', docId);

      if (dbError) {
        console.error("Delete DB error:", dbError);
        alert("Gagal hapus dokumen: " + dbError.message);
        return;
      }

      const deletedDoc = documents.find(d => d.id === docId);
      setDocuments(documents.filter(doc => doc.id !== docId));
      
      // Update statistik
      if (deletedDoc) {
        setStats(prev => ({
          ...prev,
          total: prev.total - 1,
          verified: deletedDoc.status === "verified" ? prev.verified - 1 : prev.verified,
          pending: deletedDoc.status === "pending" ? prev.pending - 1 : prev.pending,
          rejected: deletedDoc.status === "rejected" ? prev.rejected - 1 : prev.rejected,
        }));
      }
      
      alert("✅ Dokumen berhasil dihapus!");

    } catch (error) {
      console.error("Delete error:", error);
      alert("❌ Gagal hapus dokumen: " + error.message);
    } finally {
      setDeleting(null);
    }
  };

  // ============================================
  // FUNGSI PREVIEW DOKUMEN (MATA)
  // ============================================
  const handlePreviewDoc = (doc) => {
    if (doc.file_url) {
      window.open(doc.file_url, '_blank');
    } else {
      alert(
        `📄 Detail Dokumen\n\n` +
        `Jenis: ${doc.type}\n` +
        `Nama: ${doc.name}\n` +
        `Nomor: ${doc.number || '-'}\n` +
        `Upload: ${new Date(doc.uploaded_at).toLocaleDateString('id-ID')}\n` +
        `Status: ${doc.status || 'Belum diverifikasi'}`
      );
    }
  };

  // ============================================
  // FUNGSI DOWNLOAD DOKUMEN
  // ============================================
  const handleDownload = (doc) => {
    if (doc.file_url) {
      window.open(doc.file_url, "_blank");
    } else {
      alert("📥 File tidak tersedia untuk didownload");
    }
  };

  if (!employee) {
    return (
      <div className="p-6 text-center">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">Memuat data pegawai...</p>
      </div>
    );
  }

  // Data tambahan untuk biodata lengkap
  const extraBio = {
    golongan: "IV/c – Pembina Utama Muda",
    tmtPangkat: "01 April 2022",
    pendidikan: "Spesialis Bedah – UI (2010)",
    npwp: "12.345.678.9-012.000",
    statusKeluarga: "Menikah, 2 anak",
    agama: "Islam",
    jenisKelamin: employee.gender === "L" ? "Laki-laki" : "Perempuan"
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Tombol Kembali */}
      <button
        onClick={() => navigate("/employees")}
        className="flex items-center gap-2 text-gray-600 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-400 mb-4 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri - Info Pegawai */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 relative">
            {/* 👁️ Toggle Mata - di pojok kanan atas */}
            <button
              onClick={() => setShowAllBio(!showAllBio)}
              className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 transition"
            >
              {showAllBio ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  <span>Sembunyikan</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span>Lihat Semua</span>
                </>
              )}
            </button>

            <div className="text-center mb-4">
              <div className="w-24 h-24 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
                <User className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mt-3">{employee.full_name}</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{employee.position}</p>
              <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${employee.status === "aktif"
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                }`}>
                {employee.status === "aktif" ? "🟢 Aktif" : "🟡 Cuti"}
              </span>
            </div>

            <div className="border-t dark:border-gray-700 pt-4 space-y-3">
              {/* BIODATA UTAMA */}
              <div className="flex items-start gap-3">
                <Briefcase className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">NIP</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{employee.nip}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Building2 className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Unit Kerja</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{employee.work_unit}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Tempat, Tanggal Lahir</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{employee.birthplace}, {employee.birth_date}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">No. Telepon</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{employee.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Email</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{employee.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Alamat</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{employee.address}</p>
                </div>
              </div>

              {/* EXTRA BIODATA */}
              {showAllBio && (
                <div className="border-t border-dashed border-gray-200 dark:border-gray-700 pt-3 mt-2 space-y-3 animate-fadeIn">
                  <div className="flex items-start gap-3">
                    <Award className="w-4 h-4 text-teal-500 dark:text-teal-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-400 dark:text-gray-500">Golongan</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{extraBio.golongan}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-teal-500 dark:text-teal-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-400 dark:text-gray-500">TMT Pangkat</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{extraBio.tmtPangkat}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <GraduationCap className="w-4 h-4 text-teal-500 dark:text-teal-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-400 dark:text-gray-500">Pendidikan</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{extraBio.pendidikan}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CreditCard className="w-4 h-4 text-teal-500 dark:text-teal-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-400 dark:text-gray-500">NPWP</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{extraBio.npwp}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="w-4 h-4 text-teal-500 dark:text-teal-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-400 dark:text-gray-500">Status Keluarga</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{extraBio.statusKeluarga}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <User className="w-4 h-4 text-teal-500 dark:text-teal-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-400 dark:text-gray-500">Jenis Kelamin</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{extraBio.jenisKelamin}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Award className="w-4 h-4 text-teal-500 dark:text-teal-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-400 dark:text-gray-500">Agama</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{extraBio.agama}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Kolom Kanan - Dokumen */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
            <div className="p-6 border-b dark:border-gray-700 flex flex-wrap justify-between items-center gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">📄 Dokumen Penting</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Kelola file-file penting pegawai</p>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                disabled={isLoading}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition flex items-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                Upload Dokumen
              </button>
            </div>

            {/* Statistik */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 border-b dark:border-gray-700">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.total}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{stats.verified}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Terverifikasi</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Menunggu</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Perlu Revisi</p>
              </div>
            </div>

            <div className="p-6">
              {documents.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <FileText className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                  <p>Belum ada dokumen yang diupload</p>
                  <p className="text-sm">Klik tombol "Upload Dokumen" untuk menambahkan</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc) => {
                    const filePath = doc.file_path || (doc.file_url ? doc.file_url.split('/').pop() : null);
                    const status = STATUS_MAP[doc.status] || STATUS_MAP.pending;
                    
                    return (
                      <div key={doc.id} className="flex flex-wrap items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition gap-3">
                        <div className="flex items-center gap-3 min-w-[200px]">
                          <FileText className="w-8 h-8 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-800 dark:text-white">{doc.type}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{doc.name}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              Upload: {new Date(doc.uploaded_at).toLocaleDateString('id-ID')}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${status.cls}`}>
                            {status.lbl}
                          </span>
                          
                          <div className="flex gap-2">
                            {/* 👁️ TOMBOL PREVIEW - MATA */}
                            <button
                              onClick={() => handlePreviewDoc(doc)}
                              className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded transition"
                              title="Preview Dokumen"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDownload(doc)}
                              className="p-2 text-teal-600 hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-teal-900/30 rounded transition"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteDoc(doc.id, doc.name, filePath)}
                              disabled={deleting === doc.id}
                              className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded transition disabled:opacity-50"
                              title="Hapus"
                            >
                              {deleting === doc.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Upload */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUpload}
        employeeName={employee.full_name}
        isLoading={isLoading}
      />

      {/* CSS Animasi */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
      `}</style>
    </div>
  );
}