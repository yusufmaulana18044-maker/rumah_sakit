import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, FileText, Download, Trash2, User, Briefcase, Calendar, Phone, Mail, MapPin } from "lucide-react";
import dummyEmployees from "../data/dummyEmployees";
import { documentTypes } from "../data/dummyEmployees";

export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    const emp = dummyEmployees.find(e => e.id === parseInt(id));
    if (emp) {
      setEmployee(emp);
      setDocuments(emp.documents || []);
    }
  }, [id]);

  const handleUpload = (newDoc) => {
    setDocuments([...documents, newDoc]);
    // Nanti juga update ke Supabase
  };

  const handleDeleteDoc = (docId, docName) => {
    if (window.confirm(`Yakin ingin menghapus dokumen "${docName}"?`)) {
      setDocuments(documents.filter(doc => doc.id !== docId));
    }
  };

  const handleDownload = (doc) => {
    // Simulasi download (nanti ganti dengan file real dari Supabase Storage)
    alert(`Download file: ${doc.name}`);
  };

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
                          <p className="text-xs text-gray-400">Upload: {doc.uploaded_at}</p>
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
                          onClick={() => handleDeleteDoc(doc.id, doc.name)}
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