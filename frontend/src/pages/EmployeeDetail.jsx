import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  FileText,
  Download,
  Trash2,
  User,
  Briefcase,
  Calendar,
  Phone,
  Mail,
  MapPin,
  X,
  Loader2,
  Eye,
  EyeOff,
  Award,
  GraduationCap,
  CreditCard,
  Users,
  Building2,
} from "lucide-react";

import { supabase } from "../supabase";

// ============================================
// 14 KATEGORI DOKUMEN
// ============================================
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

const documentTypes = KATEGORI.map((kategori) => kategori.nama);

// ============================================
// COMPONENT MODAL UPLOAD
// ============================================
function UploadModal({
  isOpen,
  onClose,
  onUpload,
  employeeName,
  isLoading,
}) {
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    category: "",
    number: "",
    date: "",
    file: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Maksimal 5 MB
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file maksimal 5MB!");
      e.target.value = "";
      return;
    }

    // Format file yang diperbolehkan
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Hanya file PDF, JPG, JPEG, PNG yang diizinkan!");
      e.target.value = "";
      return;
    }

    setFormData((prev) => ({
      ...prev,
      file,
      name: prev.name || file.name,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.type || !formData.name || !formData.file) {
      alert("Mohon lengkapi semua field yang diperlukan!");
      return;
    }

    try {
      await onUpload(formData);

      setFormData({
        type: "",
        name: "",
        category: "",
        number: "",
        date: "",
        file: null,
      });

      onClose();
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
              Upload Dokumen
            </h3>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {employeeName}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
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
              <option value="">-- Pilih Jenis --</option>

              {documentTypes.map((doc) => (
                <option key={doc} value={doc}>
                  {doc}
                </option>
              ))}
            </select>
          </div>

          {/* Nama File */}
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
              placeholder="Contoh: SK_Pangkat_2024.pdf"
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Kategori
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-teal-400 focus:outline-none dark:bg-gray-700 dark:text-white"
            >
              <option value="">-- Pilih Kategori --</option>

              {KATEGORI.map((kategori) => (
                <option key={kategori.id} value={kategori.id}>
                  {kategori.nama}
                </option>
              ))}
            </select>
          </div>

          {/* Nomor Surat */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nomor Surat
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

          {/* Tanggal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tanggal
            </label>

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-teal-400 focus:outline-none dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* File */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Pilih File <span className="text-red-500">*</span>
            </label>

            <input
              type="file"
              onChange={handleFileChange}
              required
              accept=".pdf,.jpg,.jpeg,.png"
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-teal-400 focus:outline-none dark:bg-gray-700 dark:text-white"
            />

            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Format: PDF, JPG, PNG (Maksimal 5MB)
            </p>
          </div>

          {/* Tombol */}
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
              className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
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
// MAIN COMPONENT
// ============================================
export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAllBio, setShowAllBio] = useState(false);

  // ============================================
  // AMBIL DATA PEGAWAI & DOKUMEN
  // ============================================
  useEffect(() => {
    const fetchEmployee = async () => {
      if (!id) return;

      setIsLoading(true);

      try {
        const { data: empData, error: empError } = await supabase
          .from("pegawai")
          .select("*")
          .eq("id", id)
          .single();

        if (empError) {
          throw empError;
        }

        setEmployee(empData);

        const { data: docData, error: docError } = await supabase
          .from("dokumen")
          .select("*")
          .eq("employee_id", id)
          .order("uploaded_at", { ascending: false });

        if (docError) {
          throw docError;
        }

        setDocuments(docData || []);
      } catch (error) {
        console.error("Error fetching employee:", error);
        alert("Gagal mengambil data pegawai: " + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  // ============================================
  // UPLOAD DOKUMEN KE SUPABASE
  // ============================================
  const handleUpload = async (formData) => {
    if (!employee) {
      throw new Error("Data pegawai belum tersedia.");
    }

    setIsLoading(true);

    try {
      const file = formData.file;

      if (!file) {
        throw new Error("File belum dipilih.");
      }

      const fileExt = file.name.split(".").pop();

      const fileName = `${Date.now()}-${employee.id}.${fileExt}`;

      const filePath = `pegawai/${employee.id}/${fileName}`;

      // Upload file ke Storage
      const { error: uploadError } = await supabase.storage
        .from("dokumen")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Dapatkan URL publik
      const { data: urlData } = supabase.storage
        .from("dokumen")
        .getPublicUrl(filePath);

      if (!urlData?.publicUrl) {
        throw new Error("URL file tidak berhasil dibuat.");
      }

      // Simpan metadata ke database
      const documentData = {
        employee_id: employee.id,
        type: formData.type,
        name: formData.name || file.name,
        category: parseInt(formData.category, 10) || 1,
        number: formData.number || "-",
        uploaded_at:
          formData.date || new Date().toISOString().split("T")[0],
        status: "tunggu",
        file_url: urlData.publicUrl,
        file_path: filePath,
        file_name: fileName,
        file_size: file.size,
        file_type: file.type,
      };

      const { data: newDoc, error: dbError } = await supabase
        .from("dokumen")
        .insert([documentData])
        .select()
        .single();

      if (dbError) {
        // Jika database gagal, hapus file dari storage
        await supabase.storage
          .from("dokumen")
          .remove([filePath]);

        throw dbError;
      }

      // Update tampilan
      setDocuments((prev) => [newDoc, ...prev]);

      alert("✅ Dokumen berhasil diupload!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("❌ Gagal upload dokumen: " + error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // DOWNLOAD DOKUMEN
  // ============================================
  const handleDownload = async (doc) => {
    try {
      if (!doc.file_path) {
        if (doc.file_url) {
          window.open(doc.file_url, "_blank");
          return;
        }

        alert("File tidak ditemukan di server.");
        return;
      }

      const { data, error } = await supabase.storage
        .from("dokumen")
        .download(doc.file_path);

      if (error) {
        throw error;
      }

      const url = URL.createObjectURL(data);

      const link = document.createElement("a");

      link.href = url;
      link.download = doc.name || "dokumen";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      alert("❌ Gagal download dokumen: " + error.message);
    }
  };

  // ============================================
  // PREVIEW DOKUMEN
  // ============================================
  const handlePreviewDoc = (doc) => {
    if (doc.file_url) {
      window.open(doc.file_url, "_blank");
    } else {
      alert(
        `📄 Detail Dokumen\n\n` +
          `Jenis: ${doc.type}\n` +
          `Nama: ${doc.name}\n` +
          `Nomor: ${doc.number || "-"}\n` +
          `Upload: ${doc.uploaded_at || "-"}\n` +
          `Status: ${doc.status || "Belum diverifikasi"}`
      );
    }
  };

  // ============================================
  // HAPUS DOKUMEN
  // ============================================
  const handleDeleteDoc = async (docId, docName, filePath) => {
    const confirmed = window.confirm(
      `Yakin ingin menghapus dokumen "${docName}"?`
    );

    if (!confirmed) return;

    try {
      setIsLoading(true);

      // Hapus file dari Storage
      if (filePath) {
        const { error: storageError } = await supabase.storage
          .from("dokumen")
          .remove([filePath]);

        if (storageError) {
          console.error(
            "Storage delete error:",
            storageError
          );
        }
      }

      // Hapus data dari database
      const { error: dbError } = await supabase
        .from("dokumen")
        .delete()
        .eq("id", docId);

      if (dbError) {
        throw dbError;
      }

      // Update tampilan
      setDocuments((prev) =>
        prev.filter((doc) => doc.id !== docId)
      );

      alert("✅ Dokumen berhasil dihapus!");
    } catch (error) {
      console.error("Delete error:", error);
      alert("❌ Gagal hapus dokumen: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // LOADING
  // ============================================
  if (isLoading && !employee) {
    return (
      <div className="p-6 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-teal-600" />
        <p className="text-gray-500 mt-2">Loading...</p>
      </div>
    );
  }

  // ============================================
  // PEGAWAI TIDAK DITEMUKAN
  // ============================================
  if (!employee) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          Pegawai tidak ditemukan
        </p>

        <button
          onClick={() => navigate("/employees")}
          className="mt-4 text-teal-600 hover:underline dark:text-teal-400"
        >
          Kembali ke daftar pegawai
        </button>
      </div>
    );
  }

  // ============================================
  // DATA TAMBAHAN BIODATA
  // ============================================
  const extraBio = {
    golongan: "IV/c – Pembina Utama Muda",
    tmtPangkat: "01 April 2022",
    pendidikan: "Spesialis Bedah – UI (2010)",
    npwp: "12.345.678.9-012.000",
    statusKeluarga: "Menikah, 2 anak",
    agama: "Islam",
    jenisKelamin:
      employee.gender === "L"
        ? "Laki-laki"
        : "Perempuan",
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="p-6">

      {/* Tombol Kembali */}
      <button
        onClick={() => navigate("/employees")}
        className="flex items-center gap-2 text-gray-600 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-400 mb-4 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ========================================
            KOLOM KIRI - INFORMASI PEGAWAI
        ======================================== */}
        <div className="lg:col-span-1">

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 relative">

            {/* Tombol Lihat Semua */}
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

            {/* Foto / Avatar */}
            <div className="text-center mb-4">

              <div className="w-24 h-24 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
                <User className="w-12 h-12 text-white" />
              </div>

              <h2 className="text-xl font-bold text-gray-800 dark:text-white mt-3">
                {employee.full_name}
              </h2>

              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {employee.position}
              </p>

              <span
                className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                  employee.status === "aktif"
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                }`}
              >
                {employee.status === "aktif"
                  ? "🟢 Aktif"
                  : "🟡 Cuti"}
              </span>
            </div>

            {/* Biodata */}
            <div className="border-t dark:border-gray-700 pt-4 space-y-3">

              {/* NIP */}
              <div className="flex items-start gap-3">
                <Briefcase className="w-4 h-4 text-gray-400 mt-0.5" />

                <div>
                  <p className="text-xs text-gray-400">
                    NIP
                  </p>

                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {employee.nip}
                  </p>
                </div>
              </div>

              {/* Unit Kerja */}
              <div className="flex items-start gap-3">
                <Building2 className="w-4 h-4 text-gray-400 mt-0.5" />

                <div>
                  <p className="text-xs text-gray-400">
                    Unit Kerja
                  </p>

                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {employee.work_unit}
                  </p>
                </div>
              </div>

              {/* Tempat Tanggal Lahir */}
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />

                <div>
                  <p className="text-xs text-gray-400">
                    Tempat, Tanggal Lahir
                  </p>

                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {employee.birthplace},{" "}
                    {employee.birth_date}
                  </p>
                </div>
              </div>

              {/* Telepon */}
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-gray-400 mt-0.5" />

                <div>
                  <p className="text-xs text-gray-400">
                    No. Telepon
                  </p>

                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {employee.phone}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-gray-400 mt-0.5" />

                <div>
                  <p className="text-xs text-gray-400">
                    Email
                  </p>

                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {employee.email}
                  </p>
                </div>
              </div>

              {/* Alamat */}
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />

                <div>
                  <p className="text-xs text-gray-400">
                    Alamat
                  </p>

                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {employee.address}
                  </p>
                </div>
              </div>

              {/* Extra Biodata */}
              {showAllBio && (
                <div className="border-t border-dashed border-gray-200 dark:border-gray-700 pt-3 mt-2 space-y-3">

                  {/* Golongan */}
                  <div className="flex items-start gap-3">
                    <Award className="w-4 h-4 text-teal-500 mt-0.5" />

                    <div>
                      <p className="text-xs text-gray-400">
                        Golongan
                      </p>

                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {extraBio.golongan}
                      </p>
                    </div>
                  </div>

                  {/* TMT Pangkat */}
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-teal-500 mt-0.5" />

                    <div>
                      <p className="text-xs text-gray-400">
                        TMT Pangkat
                      </p>

                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {extraBio.tmtPangkat}
                      </p>
                    </div>
                  </div>

                  {/* Pendidikan */}
                  <div className="flex items-start gap-3">
                    <GraduationCap className="w-4 h-4 text-teal-500 mt-0.5" />

                    <div>
                      <p className="text-xs text-gray-400">
                        Pendidikan
                      </p>

                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {extraBio.pendidikan}
                      </p>
                    </div>
                  </div>

                  {/* NPWP */}
                  <div className="flex items-start gap-3">
                    <CreditCard className="w-4 h-4 text-teal-500 mt-0.5" />

                    <div>
                      <p className="text-xs text-gray-400">
                        NPWP
                      </p>

                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {extraBio.npwp}
                      </p>
                    </div>
                  </div>

                  {/* Status Keluarga */}
                  <div className="flex items-start gap-3">
                    <Users className="w-4 h-4 text-teal-500 mt-0.5" />

                    <div>
                      <p className="text-xs text-gray-400">
                        Status Keluarga
                      </p>

                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {extraBio.statusKeluarga}
                      </p>
                    </div>
                  </div>

                  {/* Jenis Kelamin */}
                  <div className="flex items-start gap-3">
                    <User className="w-4 h-4 text-teal-500 mt-0.5" />

                    <div>
                      <p className="text-xs text-gray-400">
                        Jenis Kelamin
                      </p>

                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {extraBio.jenisKelamin}
                      </p>
                    </div>
                  </div>

                  {/* Agama */}
                  <div className="flex items-start gap-3">
                    <Award className="w-4 h-4 text-teal-500 mt-0.5" />

                    <div>
                      <p className="text-xs text-gray-400">
                        Agama
                      </p>

                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {extraBio.agama}
                      </p>
                    </div>
                  </div>

                </div>
              )}
            </div>
          </div>
        </div>

        {/* ========================================
            KOLOM KANAN - DOKUMEN
        ======================================== */}
        <div className="lg:col-span-2">

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow">

            {/* Header Dokumen */}
            <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">

              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  📄 Dokumen Penting
                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Kelola file-file penting pegawai
                </p>
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

            {/* List Dokumen */}
            <div className="p-6">

              {documents.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">

                  <FileText className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />

                  <p>Belum ada dokumen yang diupload</p>

                  <p className="text-sm">
                    Klik tombol "Upload Dokumen" untuk menambahkan
                  </p>

                </div>
              ) : (

                <div className="space-y-3">

                  {documents.map((doc) => (

                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >

                      <div className="flex items-center gap-3">

                        <FileText className="w-8 h-8 text-blue-500 dark:text-blue-400" />

                        <div>

                          <p className="font-medium text-gray-800 dark:text-white">
                            {doc.type}
                          </p>

                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {doc.name}
                          </p>

                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            Upload:{" "}
                            {doc.uploaded_at
                              ? new Date(
                                  doc.uploaded_at
                                ).toLocaleDateString("id-ID")
                              : "-"}
                          </p>

                        </div>
                      </div>

                      <div className="flex gap-2">

                        {/* Preview */}
                        <button
                          type="button"
                          onClick={() => handlePreviewDoc(doc)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded transition"
                          title="Preview Dokumen"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Download */}
                        <button
                          type="button"
                          onClick={() => handleDownload(doc)}
                          className="p-2 text-teal-600 hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-teal-900/30 rounded transition"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        {/* Hapus */}
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteDoc(
                              doc.id,
                              doc.name,
                              doc.file_path
                            )
                          }
                          className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded transition"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </div>
                    </div>

                  ))}

                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* ========================================
          MODAL UPLOAD
      ======================================== */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUpload}
        employeeName={employee.full_name}
        isLoading={isLoading}
      />

      {/* ========================================
          CSS ANIMASI
      ======================================== */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
      `}</style>

    </div>
  );
}
