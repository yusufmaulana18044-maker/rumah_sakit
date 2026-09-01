// src/pages/UploadDokumen.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabase";
import { 
  ArrowLeft, 
  Upload, 
  File, 
  FileImage, 
  FileText, 
  CheckCircle,
  AlertCircle,
  Loader2,
  Trash2
} from "lucide-react";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const ALLOWED_TYPES = {
  'SK Pangkat (Mulai CPNS)': ['image/jpeg', 'image/png', 'application/pdf'],
  'SK Fungsional': ['image/jpeg', 'image/png', 'application/pdf'],
  'Data Pribadi': ['image/jpeg', 'image/png', 'application/pdf'],
  'Riwayat Pendidikan': ['image/jpeg', 'image/png', 'application/pdf'],
  'Uraian Tugas': ['image/jpeg', 'image/png', 'application/pdf'],
  'SPK RKK (Khusus Nakes)': ['image/jpeg', 'image/png', 'application/pdf'],
  'Penilaian Kinerja (SKP)': ['image/jpeg', 'image/png', 'application/pdf'],
  'SPMT': ['image/jpeg', 'image/png', 'application/pdf'],
  'Orientasi': ['image/jpeg', 'image/png', 'application/pdf'],
  'KGB': ['image/jpeg', 'image/png', 'application/pdf'],
  'Pengembangan Kompetensi': ['image/jpeg', 'image/png', 'application/pdf'],
  'Riwayat Jabatan': ['image/jpeg', 'image/png', 'application/pdf'],
  'Check Up': ['image/jpeg', 'image/png', 'application/pdf'],
  'Lain-lain': ['image/jpeg', 'image/png', 'application/pdf'],
  'default': ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
};

const KATEGORI_LIST = [
  { id: 1, name: 'SK Pangkat (Mulai CPNS)', folder: 'sk_pangkat' },
  { id: 2, name: 'SK Fungsional', folder: 'sk_fungsional' },
  { id: 3, name: 'Data Pribadi', folder: 'data_pribadi' },
  { id: 4, name: 'Riwayat Pendidikan', folder: 'riwayat_pendidikan' },
  { id: 5, name: 'Uraian Tugas', folder: 'uraian_tugas' },
  { id: 6, name: 'SPK RKK (Khusus Nakes)', folder: 'spk_rkk' },
  { id: 7, name: 'Penilaian Kinerja (SKP)', folder: 'penilaian_kinerja' },
  { id: 8, name: 'SPMT', folder: 'spmt' },
  { id: 9, name: 'Orientasi', folder: 'orientasi' },
  { id: 10, name: 'KGB', folder: 'kgb' },
  { id: 11, name: 'Pengembangan Kompetensi', folder: 'pengembangan_kompetensi' },
  { id: 12, name: 'Riwayat Jabatan', folder: 'riwayat_jabatan' },
  { id: 13, name: 'Check Up', folder: 'check_up' },
  { id: 14, name: 'Lain-lain', folder: 'lain_lain' }
];

export default function UploadDokumen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [pegawai, setPegawai] = useState([]);
  const [selectedPegawai, setSelectedPegawai] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('');
  const [nomorSurat, setNomorSurat] = useState('');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetchPegawai();
    if (id) {
      setSelectedPegawai(id);
    }
  }, [id]);

  const fetchPegawai = async () => {
    try {
      const { data, error } = await supabase
        .from('pegawai')
        .select('id, full_name, nip')
        .order('full_name', { ascending: true });
      
      if (error) throw error;
      setPegawai(data || []);
    } catch (error) {
      console.error('Error fetching pegawai:', error);
      setError('Gagal mengambil data pegawai');
    }
  };

  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return;

    setError('');
    setSuccess('');

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError(`Ukuran file terlalu besar! Maksimal ${MAX_FILE_SIZE / 1024 / 1024}MB`);
      return;
    }

    const kategori = KATEGORI_LIST.find(k => k.id === parseInt(selectedKategori));
    const allowedTypes = kategori ? ALLOWED_TYPES[kategori.name] : ALLOWED_TYPES['default'];
    
    if (!allowedTypes.includes(selectedFile.type)) {
      setError(`Format file tidak didukung! Gunakan: ${allowedTypes.join(', ')}`);
      return;
    }

    setFile(selectedFile);
    
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFilePreview(null);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFilePreview(null);
    setError('');
  };

  const getFileIcon = () => {
    if (!file) return <File className="w-12 h-12 text-gray-300" />;
    if (file.type.startsWith('image/')) {
      return <FileImage className="w-12 h-12 text-blue-500" />;
    }
    if (file.type === 'application/pdf') {
      return <FileText className="w-12 h-12 text-red-500" />;
    }
    return <File className="w-12 h-12 text-gray-300" />;
  };

  const getFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleUpload = async () => {
    if (!selectedPegawai) {
      setError('Pilih pegawai terlebih dahulu');
      return;
    }
    if (!selectedKategori) {
      setError('Pilih kategori dokumen terlebih dahulu');
      return;
    }
    if (!file) {
      setError('Pilih file yang akan diupload');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setUploadProgress(0);

    try {
      const kategoriObj = KATEGORI_LIST.find(k => k.id === parseInt(selectedKategori));
      const fileExt = file.name.split('.').pop();
      const fileName = `${selectedPegawai}_${Date.now()}.${fileExt}`;
      const filePath = `pegawai/${kategoriObj.folder}/${fileName}`;

      setUploadProgress(20);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      setUploadProgress(60);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      setUploadProgress(80);

      const { data: docData, error: docError } = await supabase
        .from('dokumen')
        .insert({
          employee_id: selectedPegawai,
          name: file.name,
          type: kategoriObj.name,
          number: nomorSurat || '-',
          file_path: filePath,
          file_url: urlData.publicUrl,
          category: parseInt(selectedKategori),
          status: 'pending',
          uploaded_at: new Date().toISOString()
        })
        .select();

      if (docError) throw docError;

      setUploadProgress(100);
      setSuccess('✅ Dokumen berhasil diupload!');
      
      setTimeout(() => {
        setFile(null);
        setFilePreview(null);
        setNomorSurat('');
        setSelectedKategori('');
        setUploadProgress(0);
        navigate(`/kategori/${selectedKategori}`);
      }, 2000);

    } catch (error) {
      console.error('Upload error:', error);
      setError(`Gagal upload: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali
      </button>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800">📤 Upload Dokumen</h1>
        <p className="text-gray-500 text-sm mt-1">Upload dokumen pegawai ke sistem SICAKEP</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{success}</span>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pilih Pegawai <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedPegawai}
            onChange={(e) => setSelectedPegawai(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-200"
          >
            <option value="">-- Pilih Pegawai --</option>
            {pegawai.map((p) => (
              <option key={p.id} value={p.id}>
                {p.full_name} - {p.nip}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kategori Dokumen <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedKategori}
            onChange={(e) => setSelectedKategori(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-200"
          >
            <option value="">-- Pilih Kategori --</option>
            {KATEGORI_LIST.map((k) => (
              <option key={k.id} value={k.id}>
                {String(k.id).padStart(2, "0")} - {k.name}
              </option>
            ))}
          </select>
          {selectedKategori && (
            <p className="text-xs text-gray-400 mt-1">
              Format yang didukung: {ALLOWED_TYPES[KATEGORI_LIST.find(k => k.id === parseInt(selectedKategori))?.name || 'default'].join(', ')}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nomor Surat <span className="text-gray-400 text-xs">(opsional)</span>
          </label>
          <input
            type="text"
            value={nomorSurat}
            onChange={(e) => setNomorSurat(e.target.value)}
            placeholder="Contoh: 800/123/SK/2024"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload File <span className="text-red-500">*</span>
          </label>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              isDragging
                ? 'border-teal-400 bg-teal-50'
                : file
                ? 'border-green-400 bg-green-50'
                : 'border-gray-300 hover:border-teal-400 hover:bg-gray-50'
            }`}
          >
            {file ? (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  {filePreview ? (
                    <img
                      src={filePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                    />
                  ) : (
                    <div className="w-16 h-16 flex items-center justify-center">
                      {getFileIcon()}
                    </div>
                  )}
                  <div className="text-left">
                    <p className="font-medium text-gray-800">{file.name}</p>
                    <p className="text-sm text-gray-500">{getFileSize(file.size)}</p>
                    <p className="text-sm text-gray-500">{file.type}</p>
                  </div>
                </div>
                <button
                  onClick={handleRemoveFile}
                  className="px-4 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                >
                  <Trash2 className="w-4 h-4 inline mr-1" />
                  Hapus File
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="w-12 h-12 text-gray-300 mx-auto" />
                <div>
                  <p className="text-gray-500">Seret & drop file di sini</p>
                  <p className="text-sm text-gray-400">atau klik untuk memilih file</p>
                </div>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="fileInput"
                  accept=".jpg,.jpeg,.png,.pdf"
                />
                <label
                  htmlFor="fileInput"
                  className="inline-block px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition cursor-pointer"
                >
                  Pilih File
                </label>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Maksimal ukuran file: {MAX_FILE_SIZE / 1024 / 1024}MB (PDF, JPG, PNG)
          </p>
        </div>

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Mengupload...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-teal-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={loading || !file || !selectedPegawai || !selectedKategori}
          className="w-full py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Uploading...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Dokumen
            </span>
          )}
        </button>
      </div>

      <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
        <p className="text-sm text-teal-800">
          💡 File yang sudah diupload akan tersimpan di Supabase Storage dan bisa diakses melalui link publik.
          Status dokumen akan otomatis menjadi <strong>"Menunggu"</strong> sampai diverifikasi.
        </p>
      </div>
    </div>
  );
}