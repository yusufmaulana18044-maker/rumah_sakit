<<<<<<< HEAD
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, UploadCloud, FileText, CheckCircle2 } from "lucide-react";
import { supabase } from "../supabase";

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
=======
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../supabase';
import { 
  Upload, 
  X, 
  File, 
  FileImage, 
  FileText, 
  CheckCircle,
  AlertCircle,
  Loader2,
  Trash2
} from 'lucide-react';

// ✅ KONFIGURASI BATASAN
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = {
  'SK Pangkat': ['image/jpeg', 'image/png', 'application/pdf'],
  'SK Fungsional': ['image/jpeg', 'image/png', 'application/pdf'],
  'Data Pribadi': ['image/jpeg', 'image/png', 'application/pdf'],
  'Riwayat Pendidikan': ['image/jpeg', 'image/png', 'application/pdf'],
  'Ijazah': ['image/jpeg', 'image/png', 'application/pdf'],
  'SPK RKK': ['image/jpeg', 'image/png', 'application/pdf'],
  'default': ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
>>>>>>> 263e32c (feat: SICAKEP v2.0 - Integrasi Supabase & fitur lengkap)
};

// ✅ MAPPING KATEGORI
const KATEGORI_LIST = [
  { id: 1, name: 'SK Pangkat', folder: 'sk_pangkat' },
  { id: 2, name: 'SK Fungsional', folder: 'sk_fungsional' },
  { id: 3, name: 'Data Pribadi', folder: 'data_pribadi' },
  { id: 4, name: 'Riwayat Pendidikan', folder: 'riwayat_pendidikan' },
  { id: 5, name: 'Uraian Tugas', folder: 'uraian_tugas' },
  { id: 6, name: 'SPK RKK', folder: 'spk_rkk' },
  { id: 7, name: 'Penilaian Kinerja', folder: 'penilaian_kinerja' },
  { id: 8, name: 'SPMT', folder: 'spmt' },
  { id: 9, name: 'Orientasi', folder: 'orientasi' },
  { id: 10, name: 'KGB', folder: 'kgb' },
  { id: 11, name: 'Pengembangan Kompetensi', folder: 'pengembangan_kompetensi' },
  { id: 12, name: 'Riwayat Jabatan', folder: 'riwayat_jabatan' },
  { id: 13, name: 'Check Up', folder: 'check_up' },
  { id: 14, name: 'Lain-lain', folder: 'lain_lain' }
];

<<<<<<< HEAD
  const initialCategory = Number(id) || 1;
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [pegawaiList, setPegawaiList] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [nomorSurat, setNomorSurat] = useState("");
  const [tanggalUpload, setTanggalUpload] = useState(new Date().toISOString().slice(0, 10));
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
<<<<<<< HEAD
  const [kategoriList, setKategoriList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ambil data kategori & pegawai dari Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Ambil kategori
        const { data: katData, error: katError } = await supabase
          .from("kategori_dokumen")
          .select("*")
          .order("id", { ascending: true });

        if (katError) throw katError;
        setKategoriList(katData || []);

        // 2. Ambil pegawai
        const { data: empData, error: empError } = await supabase
          .from("pegawai")
          .select("id, full_name, nip")
          .order("full_name", { ascending: true });

        if (empError) throw empError;
        setPegawaiList(empData || []);
        if (empData && empData.length > 0) {
          setSelectedEmployeeId(empData[0].id);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Gagal mengambil data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
=======
  const [fileError, setFileError] = useState("");
>>>>>>> 280cfd6ad0c3277b26a2895209b81185c46b7dfd
=======
export default function UploadDokumen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [pegawai, setPegawai] = useState([]);
  const [selectedPegawai, setSelectedPegawai] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
>>>>>>> 263e32c (feat: SICAKEP v2.0 - Integrasi Supabase & fitur lengkap)

  useEffect(() => {
    fetchPegawai();
    if (id) {
      setSelectedPegawai(id);
    }
  }, [id]);

<<<<<<< HEAD
  const category = kategoriList.find((item) => item.id === selectedCategory) || kategoriList[0] || { id: 1, nama: "Kategori" };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setFileError("");

    if (file) {
<<<<<<< HEAD
      // Validasi ukuran (3 MB)
      if (file.size > 3 * 1024 * 1024) {
        alert("❌ Ukuran file maksimal 3 MB!");
        event.target.value = "";
        return;
      }

      // Validasi format
      const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
      if (!allowedTypes.includes(file.type)) {
        alert("❌ Format file harus PDF, PNG, atau JPG!");
        event.target.value = "";
        return;
      }

      setSelectedFile(file);
=======
      // VALIDASI: HANYA PDF
      if (file.type !== 'application/pdf') {
        setFileError("❌ Hanya file PDF yang diizinkan!");
        event.target.value = "";
        setFileName("");
        return;
      }

      // VALIDASI: MAKSIMAL 10MB
      if (file.size > 10 * 1024 * 1024) {
        setFileError("❌ Ukuran file maksimal 10MB!");
        event.target.value = "";
        setFileName("");
        return;
      }

      setFileName(file.name);
>>>>>>> 280cfd6ad0c3277b26a2895209b81185c46b7dfd
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
=======
  const fetchPegawai = async () => {
    const { data, error } = await supabase
      .from('pegawai')
      .select('id, full_name, nip')
      .order('full_name', { ascending: true });
    
    if (!error) {
      setPegawai(data);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };
>>>>>>> 263e32c (feat: SICAKEP v2.0 - Integrasi Supabase & fitur lengkap)

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

  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return;

    setError('');
    setSuccess('');

    // ✅ CEK UKURAN FILE
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError(`Ukuran file terlalu besar! Maksimal ${MAX_FILE_SIZE / 1024 / 1024}MB`);
      return;
    }

<<<<<<< HEAD
    if (!selectedFile) {
      alert("Pilih file dokumen yang akan diunggah.");
      return;
    }

    try {
      setLoading(true);

      // 1. Upload ke Storage
      const filePath = `pegawai/${selectedEmployeeId}/${Date.now()}_${selectedFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // 2. Dapatkan URL publik
      const { data: urlData } = supabase.storage
        .from("documents")
        .getPublicUrl(filePath);

      // 3. Simpan ke database
      const { error: dbError } = await supabase
        .from("dokumen")
        .insert([{
          employee_id: selectedEmployeeId,
          name: selectedFile.name,
          type: category.nama,
          number: nomorSurat || "-",
          file_path: filePath,
          file_url: urlData.publicUrl,
          status: "tunggu"
        }]);

      if (dbError) throw dbError;

      setIsSubmitted(true);
      setTimeout(() => {
        navigate(`/kategori/${selectedCategory}`);
      }, 900);

    } catch (error) {
      console.error("Upload error:", error);
      alert("❌ Gagal upload dokumen: " + error.message);
    } finally {
      setLoading(false);
    }
=======
    // ✅ CEK FORMAT FILE
    const kategori = KATEGORI_LIST.find(k => k.id === parseInt(selectedKategori));
    const allowedTypes = kategori ? ALLOWED_TYPES[kategori.name] : ALLOWED_TYPES['default'];
    
    if (!allowedTypes.includes(selectedFile.type)) {
      setError(`Format file tidak didukung! Gunakan: ${allowedTypes.join(', ')}`);
      return;
    }

    setFile(selectedFile);
    
    // ✅ BUAT PREVIEW
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

  const handleUpload = async () => {
    if (!selectedPegawai || !selectedKategori || !file) {
      setError('Pilih pegawai, kategori, dan file terlebih dahulu');
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
      const filePath = `${kategoriObj.folder}/${fileName}`;

      // ✅ UPLOAD KE SUPABASE STORAGE
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      setUploadProgress(50);

      if (uploadError) throw uploadError;

      // ✅ GET PUBLIC URL
      const { data: urlData } = supabase.storage
        .from('dokumen-pegawai')
        .getPublicUrl(filePath);

      setUploadProgress(75);

      // ✅ SIMPAN KE TABEL DOKUMEN
      const { data: docData, error: docError } = await supabase
        .from('dokumen')
        .insert({
          employee_id: selectedPegawai,
          name: file.name,
          type: file.type,
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
      
      // Reset form setelah 2 detik
      setTimeout(() => {
        setFile(null);
        setFilePreview(null);
        setSelectedKategori('');
        setUploadProgress(0);
        navigate('/dokumen');
      }, 2000);

    } catch (error) {
      console.error('Upload error:', error);
      setError(`Gagal upload: ${error.message}`);
    } finally {
      setLoading(false);
    }
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
>>>>>>> 263e32c (feat: SICAKEP v2.0 - Integrasi Supabase & fitur lengkap)
  };

  if (loading && pegawaiList.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800">📤 Upload Dokumen</h1>
        <p className="text-gray-500 text-sm mt-1">Upload dokumen pegawai ke sistem</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 space-y-6">
        {/* Error & Success */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 flex items-center gap-3">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm">{success}</span>
          </div>
        )}

        {/* Pilih Pegawai */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pilih Pegawai
          </label>
          <select
            value={selectedPegawai}
            onChange={(e) => setSelectedPegawai(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-teal-400 focus:outline-none"
          >
            <option value="">-- Pilih Pegawai --</option>
            {pegawai.map((p) => (
              <option key={p.id} value={p.id}>
                {p.full_name} - {p.nip}
              </option>
            ))}
          </select>
        </div>

<<<<<<< HEAD
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Kategori Dokumen */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategori Dokumen</label>
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(Number(event.target.value))}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-800 focus:border-teal-500 focus:outline-none"
              >
                {kategoriList.map((item) => (
                  <option key={item.id} value={item.id}>
                    {String(item.id).padStart(2, "0")} - {item.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* Pegawai */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pegawai</label>
              <select
                value={selectedEmployeeId}
                onChange={(event) => setSelectedEmployeeId(event.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-800 focus:border-teal-500 focus:outline-none"
              >
                {pegawaiList.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.full_name} - {employee.nip}
                  </option>
                ))}
              </select>
            </div>

            {/* Nomor Surat */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Surat / Dokumen</label>
              <input
                type="text"
                value={nomorSurat}
                onChange={(event) => setNomorSurat(event.target.value)}
                placeholder="Contoh: 823/412/405.14/2026"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-800 placeholder:text-gray-400 focus:border-teal-500 focus:outline-none"
              />
            </div>

            {/* Tanggal Unggah */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Unggah</label>
              <input
                type="date"
                value={tanggalUpload}
                onChange={(event) => setTanggalUpload(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-800 focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

<<<<<<< HEAD
          {/* Pilih File */}
          <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-5">
=======
          <div className={`rounded-xl border-2 border-dashed p-5 ${
            fileError ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-gray-50'
          }`}>
>>>>>>> 280cfd6ad0c3277b26a2895209b81185c46b7dfd
            <label className="flex cursor-pointer flex-col items-center justify-center gap-3 text-center">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                fileError ? 'bg-red-100 text-red-700' : 'bg-teal-100 text-teal-700'
              }`}>
                <FileText className="w-7 h-7" />
              </div>
              <div>
                <p className="text-base font-semibold text-gray-800">Pilih file dokumen</p>
<<<<<<< HEAD
                <p className="text-sm text-gray-500">PDF, PNG, JPG (Maks 3 MB)</p>
=======
                <p className="text-sm text-gray-500">Format: PDF (Maksimal 10MB)</p>
>>>>>>> 280cfd6ad0c3277b26a2895209b81185c46b7dfd
              </div>
              <input 
                type="file" 
                className="hidden" 
                onChange={handleFileChange} 
<<<<<<< HEAD
                accept=".pdf,.png,.jpg,.jpeg" 
              />
            </label>

            {selectedFile && (
              <div className="mt-4 rounded-lg bg-white border border-teal-200 px-4 py-3 flex items-center gap-3">
                <FileText className="w-5 h-5 text-teal-600" />
                <div>
                  <p className="text-sm font-medium text-gray-800">{selectedFile.name}</p>
                  <p className="text-xs text-gray-400">
                    {Math.round(selectedFile.size / 1024)} KB • {selectedFile.type}
                  </p>
                </div>
=======
                accept=".pdf"
              />
            </label>

            {fileName && !fileError && (
              <div className="mt-4 rounded-lg bg-white border border-teal-200 px-4 py-3 text-sm text-gray-700">
                <span className="font-medium text-teal-700">File terpilih:</span> {fileName}
>>>>>>> 280cfd6ad0c3277b26a2895209b81185c46b7dfd
              </div>
            )}

            {fileError && (
              <div className="mt-4 rounded-lg bg-red-100 border border-red-300 px-4 py-3 text-sm text-red-700">
                {fileError}
=======
        {/* Pilih Kategori */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kategori Dokumen
          </label>
          <select
            value={selectedKategori}
            onChange={(e) => setSelectedKategori(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-teal-400 focus:outline-none"
          >
            <option value="">-- Pilih Kategori --</option>
            {KATEGORI_LIST.map((k) => (
              <option key={k.id} value={k.id}>
                {k.name}
              </option>
            ))}
          </select>
          {selectedKategori && (
            <p className="text-xs text-gray-400 mt-1">
              Format yang didukung: {ALLOWED_TYPES[KATEGORI_LIST.find(k => k.id === parseInt(selectedKategori))?.name || 'default'].join(', ')}
            </p>
          )}
        </div>

        {/* Drop Zone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload File
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
                : 'border-gray-300 hover:border-teal-400'
            }`}
          >
            {file ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-4">
                  {filePreview ? (
                    <img
                      src={filePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                    />
                  ) : (
                    getFileIcon()
                  )}
                  <div className="text-left">
                    <p className="font-medium text-gray-800">{file.name}</p>
                    <p className="text-sm text-gray-500">{getFileSize(file.size)}</p>
                    <p className="text-sm text-gray-500">{file.type}</p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={handleRemoveFile}
                    className="px-4 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                  >
                    <Trash2 className="w-4 h-4 inline mr-1" />
                    Hapus File
                  </button>
                </div>
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
>>>>>>> 263e32c (feat: SICAKEP v2.0 - Integrasi Supabase & fitur lengkap)
              </div>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Maksimal ukuran file: {MAX_FILE_SIZE / 1024 / 1024}MB
          </p>
        </div>

        {/* Progress Bar */}
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
<<<<<<< HEAD

            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-800 hover:to-teal-900 text-white px-5 py-2.5 rounded-lg font-medium transition flex items-center gap-2 disabled:opacity-50"
            >
              <UploadCloud className="w-4 h-4" />
              {loading ? "Mengupload..." : "Simpan Dokumen"}
            </button>
=======
>>>>>>> 263e32c (feat: SICAKEP v2.0 - Integrasi Supabase & fitur lengkap)
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
      <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
        <p className="text-sm text-teal-800">
          💡 File yang sudah diupload akan tersimpan di Supabase Storage dan bisa diakses melalui link publik.
        </p>
      </div>
    </div>
  );
}