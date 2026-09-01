// src/pages/UploadDokumen.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from '../supabase';
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
} from 'lucide-react';

// KONFIGURASI
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// MAPPING KATEGORI (14 kategori)
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

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

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
  const [pegawaiLoading, setPegawaiLoading] = useState(true);

  // ✅ AMBIL DATA PEGAWAI
  useEffect(() => {
    fetchPegawai();
    if (id) {
      setSelectedPegawai(id);
    }
  }, [id]);

  const fetchPegawai = async () => {
    setPegawaiLoading(true);
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
    } finally {
      setPegawaiLoading(false);
    }
  };

  // ✅ VALIDASI DAN SET FILE
  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return;

    setError('');
    setSuccess('');

    // CEK UKURAN FILE
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError(`Ukuran file terlalu besar! Maksimal ${MAX_FILE_SIZE / 1024 / 1024}MB`);
      return;
    }

    // CEK FORMAT FILE
    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setError(`Format file tidak didukung! Gunakan: ${ALLOWED_TYPES.join(', ')}`);
      return;
    }

    setFile(selectedFile);
    
    // BUAT PREVIEW UNTUK GAMBAR
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
    setSuccess('');
  };

  // ✅ GET FILE ICON
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

  // ✅ FORMAT UKURAN FILE
  const getFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // ✅ UPLOAD DOKUMEN
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

      // UPLOAD KE SUPABASE STORAGE
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      setUploadProgress(60);

      if (uploadError) throw uploadError;

      // GET PUBLIC URL
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      setUploadProgress(80);

      // SIMPAN KE TABEL DOKUMEN
      const { error: docError } = await supabase
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
        });

      if (docError) throw docError;

      setUploadProgress(100);
      setSuccess('✅ Dokumen berhasil diupload!');
      
      // Reset form setelah 2 detik
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

  if (pegawaiLoading) {
    return (
      <div className="p-6 text-center">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin mx-auto" />
        <p className="text-gray-500 mt-2">Loading data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Tombol Kembali */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali
      </button>

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">📤 Upload Dokumen</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Upload dokumen pegawai ke sistem SICAKEP</p>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 space-y-6">
        {/* Error & Success */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4 text-green-700 dark:text-green-400 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{success}</span>
          </div>
        )}

        {/* Pilih Pegawai */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Pilih Pegawai <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedPegawai}
            onChange={(e) => setSelectedPegawai(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-teal-400 focus:outline-none bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          >
            <option value="">-- Pilih Pegawai --</option>
            {pegawai.map((p) => (
              <option key={p.id} value={p.id}>
                {p.full_name} - {p.nip}
              </option>
            ))}
          </select>
        </div>

        {/* Pilih Kategori */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Kategori Dokumen <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedKategori}
            onChange={(e) => setSelectedKategori(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-teal-400 focus:outline-none bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          >
            <option value="">-- Pilih Kategori --</option>
            {KATEGORI_LIST.map((k) => (
              <option key={k.id} value={k.id}>
                {String(k.id).padStart(2, "0")} - {k.name}
              </option>
            ))}
          </select>
        </div>

        {/* Nomor Surat */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nomor Surat <span className="text-gray-400 text-xs">(opsional)</span>
          </label>
          <input
            type="text"
            value={nomorSurat}
            onChange={(e) => setNomorSurat(e.target.value)}
            placeholder="Contoh: 800/123/SK/2024"
            className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-teal-400 focus:outline-none bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          />
        </div>

        {/* Drop Zone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Upload File <span className="text-red-500">*</span>
          </label>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              isDragging
                ? 'border-teal-400 bg-teal-50 dark:bg-teal-900/20'
                : file
                ? 'border-green-400 bg-green-50 dark:bg-green-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-teal-400 dark:hover:border-teal-500 bg-gray-50 dark:bg-gray-700/50'
            }`}
          >
            {file ? (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  {filePreview ? (
                    <img
                      src={filePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                    />
                  ) : (
                    <div className="w-16 h-16 flex items-center justify-center">
                      {getFileIcon()}
                    </div>
                  )}
                  <div className="text-left">
                    <p className="font-medium text-gray-800 dark:text-white">{file.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{getFileSize(file.size)}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{file.type}</p>
                  </div>
                </div>
                <button
                  onClick={handleRemoveFile}
                  className="px-4 py-2 text-sm bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition"
                >
                  <Trash2 className="w-4 h-4 inline mr-1" />
                  Hapus File
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="w-12 h-12 text-gray-300 dark:text-gray-500 mx-auto" />
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Seret & drop file di sini</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">atau klik untuk memilih file</p>
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
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            Maksimal ukuran file: {MAX_FILE_SIZE / 1024 / 1024}MB | Format: JPG, PNG, PDF
          </p>
        </div>

        {/* Progress Bar */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Mengupload...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-teal-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Submit Button */}
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

      {/* Info */}
      <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-4 border border-teal-200 dark:border-teal-800">
        <p className="text-sm text-teal-800 dark:text-teal-400">
          💡 File yang sudah diupload akan tersimpan di Supabase Storage dan bisa diakses melalui link publik.
          Status dokumen akan otomatis menjadi <strong>"Menunggu"</strong> sampai diverifikasi.
        </p>
      </div>
    </div>
  );
}