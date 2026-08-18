import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, FileText, Download, Trash2, User, Briefcase, Calendar, Phone, Mail, MapPin } from "lucide-react";
import { supabase } from "../supabase";

// Daftar tipe dokumen yang tersedia
const documentTypes = [
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

// Component Modal Upload (sementara digabung di sini)
const UploadModal = ({ isOpen, onClose, onUpload, employeeName, documentTypes }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedType, setSelectedType] = useState(documentTypes[0] || "");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Pilih file terlebih dahulu!");
      return;
    }
    if (!selectedType) {
      alert("Pilih jenis dokumen!");
      return;
    }

    setIsLoading(true);
    try {
      await onUpload(selectedFile, selectedType);
      setSelectedFile(null);
      setSelectedType(documentTypes[0] || "");
      onClose();
    } catch (error) {
      console.error("Upload error:", error);
      alert("Gagal upload dokumen: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Upload Dokumen</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-4">Upload dokumen untuk: <span className="font-semibold">{employeeName}</span></p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Dokumen</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none"
              required
            >
              {documentTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Pilih File</label>
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none"
              required
            />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition disabled:opacity-50"
            >
              {isLoading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Ambil data pegawai & dokumen dari Supabase
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
        setDocuments(docData || []);

      } catch (error) {
        console.error("Error fetching employee:", error);
        alert("Gagal mengambil data pegawai");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchEmployee();
  }, [id]);

  // UPLOAD DOKUMEN KE SUPABASE
  const handleUpload = async (file, docType) => {
    if (!file || !docType) {
      alert("Pilih file dan jenis dokumen!");
      return;
    }

    try {
      // 1. Upload file ke Supabase Storage
      const filePath = `pegawai/${employee.id}/${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Dapatkan URL publik
      const { data: urlData } = supabase.storage
        .from("documents")
        .getPublicUrl(filePath);

      // 3. Simpan metadata ke tabel dokumen
      const { data: docData, error: dbError } = await supabase
        .from("dokumen")
        .insert([{
          employee_id: employee.id,
          name: file.name,
          type: docType,
          file_path: filePath,
          file_url: urlData.publicUrl,
          status: "pending"
        }])
        .select();

      if (dbError) throw dbError;

      // 4. Update state
      setDocuments([docData[0], ...documents]);
      alert("✅ Dokumen berhasil diupload!");

    } catch (error) {
      console.error("Upload error:", error);
      alert("❌ Gagal upload dokumen: " + error.message);
      throw error;
    }
  };

  // DOWNLOAD DOKUMEN DARI SUPABASE
  const handleDownload = async (doc) => {
    try {
      if (!doc.file_path) {
        alert("File tidak ditemukan di server.");
        return;
      }

      const { data, error } = await supabase.storage
        .from("documents")
        .download(doc.file_path);

      if (error) throw error;

      // Buat URL blob dan download
      const url = URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = doc.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Download error:", error);
      alert("❌ Gagal download dokumen: " + error.message);
    }
  };

  // HAPUS DOKUMEN
  const handleDeleteDoc = async (docId, docName, filePath) => {
    if (!window.confirm(`Yakin ingin menghapus dokumen "${docName}"?`)) return;

    try {
      // 1. Hapus file dari Storage
      if (filePath) {
        const { error: storageError } = await supabase.storage
          .from("documents")
          .remove([filePath]);

        if (storageError) throw storageError;
      }

      // 2. Hapus metadata dari database
      const { error: dbError } = await supabase
        .from("dokumen")
        .delete()
        .eq("id", docId);

      if (dbError) throw dbError;

      // 3. Update state
      setDocuments(documents.filter(doc => doc.id !== docId));
      alert("✅ Dokumen berhasil dihapus!");

    } catch (error) {
      console.error("Delete error:", error);
      alert("❌ Gagal hapus dokumen: " + error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Pegawai tidak ditemukan</p>
        <button onClick={() => navigate("/employees")} className="mt-4 text-teal-600 hover:underline">
          Kembali ke daftar pegawai
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Tombol Kembali */}
      <button
        onClick={() => navigate("/employees")}
        className="flex items-center gap-2 text-gray-600 hover:text-teal-600 mb-4 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri - Info Pegawai */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-center mb-4">
              <div className="w-24 h-24 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
                <User className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mt-3">{employee.full_name}</h2>
              <p className="text-gray-500 text-sm">{employee.position}</p>
              <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                employee.status === "aktif" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
              }`}>
                {employee.status === "aktif" ? "Aktif" : "Cuti"}
              </span>
            </div>

            <div className="border-t pt-4 space-y-3">
              <div className="flex items-start gap-3">
                <Briefcase className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400">NIP</p>
                  <p className="text-sm text-gray-700">{employee.nip}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Briefcase className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400">Unit Kerja</p>
                  <p className="text-sm text-gray-700">{employee.work_unit}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400">Tempat, Tanggal Lahir</p>
                  <p className="text-sm text-gray-700">{employee.birthplace}, {employee.birth_date}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400">No. Telepon</p>
                  <p className="text-sm text-gray-700">{employee.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="text-sm text-gray-700">{employee.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400">Alamat</p>
                  <p className="text-sm text-gray-700">{employee.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan - Dokumen */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow">
            <div className="p-6 border-b flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">📄 Dokumen Penting</h2>
                <p className="text-sm text-gray-500">Kelola file-file penting pegawai</p>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Dokumen
              </button>
            </div>

            <div className="p-6">
              {documents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p>Belum ada dokumen yang diupload</p>
                  <p className="text-sm">Klik tombol "Upload Dokumen" untuk menambahkan</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-blue-500" />
                        <div>
                          <p className="font-medium text-gray-800">{doc.type}</p>
                          <p className="text-xs text-gray-500">{doc.name}</p>
                          <p className="text-xs text-gray-400">
                            Upload: {doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleDateString('id-ID') : '-'}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDownload(doc)}
                          className="p-2 text-teal-600 hover:bg-teal-50 rounded transition"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDoc(doc.id, doc.name, doc.file_path)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition"
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

      {/* Modal Upload */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUpload}
        employeeName={employee.full_name}
        documentTypes={documentTypes}
      />
    </div>
  );
}