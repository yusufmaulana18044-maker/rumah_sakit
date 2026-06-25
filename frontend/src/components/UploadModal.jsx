import { useState } from "react";
import { X, Upload, FileText, Image, File } from "lucide-react";

export default function UploadModal({ isOpen, onClose, onUpload, employeeName, documentTypes }) {
  const [selectedType, setSelectedType] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedType) {
      alert("Pilih jenis dokumen terlebih dahulu");
      return;
    }
    
    if (!selectedFile) {
      alert("Pilih file yang akan diupload");
      return;
    }

    setIsUploading(true);
    
    // Simulasi upload (nanti diganti dengan Supabase)
    setTimeout(() => {
      const newDoc = {
        id: Date.now(),
        type: selectedType,
        name: selectedFile.name,
        url: URL.createObjectURL(selectedFile),
        uploaded_at: new Date().toISOString().split('T')[0],
        size: selectedFile.size
      };
      
      onUpload(newDoc);
      setIsUploading(false);
      onClose();
      
      // Reset form
      setSelectedType("");
      setSelectedFile(null);
      setDescription("");
    }, 1500);
  };

  const getFileIcon = () => {
    if (!selectedFile) return <File className="w-8 h-8 text-gray-400" />;
    if (selectedFile.type.includes("pdf")) return <FileText className="w-8 h-8 text-red-500" />;
    if (selectedFile.type.includes("image")) return <Image className="w-8 h-8 text-green-500" />;
    return <File className="w-8 h-8 text-blue-500" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            📤 Upload Dokumen
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pegawai
            </label>
            <input
              type="text"
              value={employeeName}
              disabled
              className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jenis Dokumen <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-teal-400 focus:outline-none"
              required
            >
              <option value="">-- Pilih Jenis Dokumen --</option>
              {documentTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              File <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-teal-400 transition cursor-pointer">
              <input
                type="file"
                id="fileInput"
                className="hidden"
                onChange={handleFileSelect}
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <label htmlFor="fileInput" className="cursor-pointer block">
                <div className="flex flex-col items-center">
                  {getFileIcon()}
                  <p className="mt-2 text-sm text-gray-600">
                    {selectedFile ? selectedFile.name : "Klik untuk pilih file"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PDF, JPG, PNG (maks. 10MB)
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi (opsional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="2"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-teal-400 focus:outline-none"
              placeholder="Tambahkan keterangan jika perlu..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="flex-1 bg-gradient-to-r from-teal-600 to-blue-600 text-white py-2 rounded-lg hover:from-teal-700 hover:to-blue-700 transition disabled:opacity-50"
            >
              {isUploading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Mengupload...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}