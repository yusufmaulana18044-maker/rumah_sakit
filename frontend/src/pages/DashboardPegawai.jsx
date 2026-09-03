// src/pages/DashboardPegawai.jsx
import { useState, useEffect } from "react";
import { 
  FileText, Loader2, User, Upload, CheckCircle, Clock, XCircle,
  Briefcase, Building2, Mail, Calendar, Award, TrendingUp,
  FolderOpen, Eye, X, Info, AlertCircle, ThumbsUp, ThumbsDown
} from "lucide-react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

// ✅ MAPPING KATEGORI
const KATEGORI_MAP = {
  1: 'SK Pangkat',
  2: 'SK Fungsional',
  3: 'Data Pribadi',
  4: 'Riwayat Pendidikan',
  5: 'Uraian Tugas',
  6: 'SPK RKK',
  7: 'Penilaian Kinerja',
  8: 'SPMT',
  9: 'Orientasi',
  10: 'KGB',
  11: 'Pengembangan Kompetensi',
  12: 'Riwayat Jabatan',
  13: 'Check Up',
  14: 'Lain-lain'
};

// ✅ STATUS DETAIL (yang muncul pas diklik)
const STATUS_DETAIL = {
  verified: {
    icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    label: 'Terverifikasi',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    desc: 'Dokumen ini sudah diverifikasi dan dinyatakan valid.',
    action: '✅ Dokumen diterima'
  },
  pending: {
    icon: <Clock className="w-5 h-5 text-amber-500" />,
    label: 'Pending',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    desc: 'Dokumen ini sedang menunggu proses verifikasi.',
    action: '⏳ Menunggu verifikasi'
  },
  rejected: {
    icon: <XCircle className="w-5 h-5 text-rose-500" />,
    label: 'Ditolak',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    desc: 'Dokumen ini ditolak karena ada kesalahan atau kekurangan.',
    action: '❌ Perlu upload ulang'
  }
};

export default function DashboardPegawai() {
  const navigate = useNavigate();
  const [pegawai, setPegawai] = useState(null);
  const [dokumen, setDokumen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState({
    totalDokumen: 0,
    verified: 0,
    pending: 0,
    rejected: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const email = localStorage.getItem('email');
      if (!email) {
        console.error('Email tidak ditemukan');
        setLoading(false);
        return;
      }

      const { data: pegawaiData, error: pegawaiError } = await supabase
        .from("pegawai")
        .select("*")
        .eq("email", email)
        .single();

      if (pegawaiError) {
        console.error('Error fetching pegawai:', pegawaiError);
        setLoading(false);
        return;
      }

      if (!pegawaiData) {
        console.error('Pegawai tidak ditemukan');
        setLoading(false);
        return;
      }

      setPegawai(pegawaiData);

      const { data: dokumenData, error: dokumenError } = await supabase
        .from("dokumen")
        .select("*")
        .eq("employee_id", pegawaiData.id);

      if (dokumenError) throw dokumenError;
      setDokumen(dokumenData || []);

      const total = dokumenData?.length || 0;
      const verified = dokumenData?.filter(d => d.status === 'verified').length || 0;
      const pending = dokumenData?.filter(d => d.status === 'pending').length || 0;
      const rejected = dokumenData?.filter(d => d.status === 'rejected').length || 0;

      setStats({ totalDokumen: total, verified, pending, rejected });

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FUNGSI BUKA MODAL DETAIL
  const handleDocClick = (doc) => {
    setSelectedDoc(doc);
    setShowModal(true);
  };

  // ✅ RENDER STATUS BADGE (BISA DIKLIK)
  const renderStatusBadge = (status) => {
    const config = {
      verified: { icon: <CheckCircle className="w-3.5 h-3.5" />, label: 'Terverifikasi', class: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' },
      pending: { icon: <Clock className="w-3.5 h-3.5" />, label: 'Pending', class: 'bg-amber-50 text-amber-700 hover:bg-amber-100' },
      rejected: { icon: <XCircle className="w-3.5 h-3.5" />, label: 'Ditolak', class: 'bg-rose-50 text-rose-700 hover:bg-rose-100' }
    };
    const c = config[status] || config.pending;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition ${c.class}`}>
        {c.icon} {c.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
        <p className="text-gray-500 text-sm">Memuat data...</p>
      </div>
    );
  }

  if (!pegawai) {
    return (
      <div className="p-8 text-center">
        <User className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">Data Pegawai Tidak Ditemukan</h2>
        <p className="text-gray-400 mt-2">Pastikan Anda sudah login dengan akun pegawai yang terdaftar.</p>
        <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">Kembali ke Login</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-blue-700 rounded-2xl shadow-lg overflow-hidden">
        <div className="px-8 py-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold text-white ring-4 ring-white/30">
              {pegawai.full_name?.charAt(0) || '?'}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-white">{pegawai.full_name}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-teal-100">
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-sm">
                  <Briefcase className="w-4 h-4" /> {pegawai.position || '-'}
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-sm">
                  <Building2 className="w-4 h-4" /> {pegawai.work_unit || '-'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-teal-200">
                <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {pegawai.email || '-'}</span>
                <span className="flex items-center gap-1.5"><Award className="w-4 h-4" /> NIP: {pegawai.nip || '-'}</span>
                <span className={`px-3 py-0.5 rounded-full text-xs font-medium ${pegawai.status === "aktif" ? "bg-emerald-500/30 text-emerald-100" : "bg-amber-500/30 text-amber-100"}`}>
                  {pegawai.status === "aktif" ? "● Aktif" : "○ Cuti"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards - BISA DIKLIK */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-teal-600 hover:shadow-md transition cursor-pointer" onClick={() => setShowModal(true)}>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total Dokumen</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalDokumen}</p>
          <p className="text-xs text-gray-400 mt-1">Milik Anda</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-emerald-500 hover:shadow-md transition cursor-pointer" onClick={() => {
          const docs = dokumen.filter(d => d.status === 'verified');
          if (docs.length > 0) { setSelectedDoc(docs[0]); setShowModal(true); }
        }}>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Terverifikasi</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.verified}</p>
          <p className="text-xs text-gray-400 mt-1">Dokumen valid</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-amber-500 hover:shadow-md transition cursor-pointer" onClick={() => {
          const docs = dokumen.filter(d => d.status === 'pending');
          if (docs.length > 0) { setSelectedDoc(docs[0]); setShowModal(true); }
        }}>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Pending</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{stats.pending}</p>
          <p className="text-xs text-gray-400 mt-1">Menunggu verifikasi</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-rose-500 hover:shadow-md transition cursor-pointer" onClick={() => {
          const docs = dokumen.filter(d => d.status === 'rejected');
          if (docs.length > 0) { setSelectedDoc(docs[0]); setShowModal(true); }
        }}>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Ditolak</p>
          <p className="text-2xl font-bold text-rose-600 mt-1">{stats.rejected}</p>
          <p className="text-xs text-gray-400 mt-1">Perlu revisi</p>
        </div>
      </div>

      {/* Dokumen */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b bg-gray-50/80 flex justify-between items-center">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-600" />
            Dokumen Anda
            <span className="text-xs text-gray-400 font-normal ml-2">({dokumen.length} file)</span>
          </h2>
          <button onClick={() => navigate('/dokumen/upload')} className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition text-sm flex items-center gap-2 shadow-sm">
            <Upload className="w-4 h-4" /> Upload
          </button>
        </div>
        <div className="p-6">
          {dokumen.length === 0 ? (
            <div className="text-center py-8">
              <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Belum ada dokumen</p>
              <p className="text-xs text-gray-400 mt-1">Upload dokumen pertama Anda</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Dokumen</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {dokumen.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50/60 transition cursor-pointer" onClick={() => handleDocClick(doc)}>
                      <td className="px-4 py-3 font-medium text-gray-700">{doc.name}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 bg-teal-50 text-teal-700 rounded-full text-xs font-medium">
                          {KATEGORI_MAP[doc.category] || doc.category}
                        </span>
                      </td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => handleDocClick(doc)} className="cursor-pointer">
                          {renderStatusBadge(doc.status)}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(doc.uploaded_at).toLocaleDateString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button onClick={() => navigate('/dokumen/upload')} className="group bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:border-teal-300 hover:shadow-md transition text-center">
          <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-teal-100 transition">
            <Upload className="w-6 h-6 text-teal-600" />
          </div>
          <p className="font-medium text-gray-800">Upload Dokumen</p>
          <p className="text-xs text-gray-400">Tambahkan dokumen Anda</p>
        </button>
        <button onClick={() => navigate(`/employees/${pegawai.id}`)} className="group bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:border-blue-300 hover:shadow-md transition text-center">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-100 transition">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <p className="font-medium text-gray-800">Lihat Profil</p>
          <p className="text-xs text-gray-400">Data diri Anda</p>
        </button>
        <button onClick={() => navigate('/dokumen')} className="group bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:border-purple-300 hover:shadow-md transition text-center">
          <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-100 transition">
            <FileText className="w-6 h-6 text-purple-600" />
          </div>
          <p className="font-medium text-gray-800">Semua Dokumen</p>
          <p className="text-xs text-gray-400">Lihat semua dokumen Anda</p>
        </button>
      </div>

      {/* ✅ MODAL DETAIL DOKUMEN */}
      {showModal && selectedDoc && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-teal-600" />
                <h3 className="text-xl font-bold text-gray-800">Detail Dokumen</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Nama Dokumen */}
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Nama Dokumen</p>
                <p className="text-lg font-semibold text-gray-800">{selectedDoc.name}</p>
              </div>

              {/* Kategori */}
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Kategori</p>
                <p className="text-gray-700">{KATEGORI_MAP[selectedDoc.category] || selectedDoc.category}</p>
              </div>

              {/* Status */}
              <div className={`p-4 rounded-xl border ${STATUS_DETAIL[selectedDoc.status]?.border || 'border-gray-200'} ${STATUS_DETAIL[selectedDoc.status]?.bg || 'bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  {STATUS_DETAIL[selectedDoc.status]?.icon || <FileText className="w-5 h-5" />}
                  <div>
                    <p className={`font-semibold ${STATUS_DETAIL[selectedDoc.status]?.color || 'text-gray-700'}`}>
                      {STATUS_DETAIL[selectedDoc.status]?.label || selectedDoc.status}
                    </p>
                    <p className="text-sm text-gray-500">{STATUS_DETAIL[selectedDoc.status]?.desc || ''}</p>
                  </div>
                </div>
              </div>

              {/* Tanggal Upload */}
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Tanggal Upload</p>
                <p className="text-gray-700">{new Date(selectedDoc.uploaded_at).toLocaleDateString('id-ID')}</p>
              </div>

              {/* Nomor Surat */}
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Nomor Surat</p>
                <p className="text-gray-700">{selectedDoc.number || '-'}</p>
              </div>

              {/* Catatan/Revisi (kalau ada) */}
              {selectedDoc.status === 'rejected' && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-rose-700">
                    <AlertCircle className="w-5 h-5" />
                    <p className="font-medium">Catatan Revisi</p>
                  </div>
                  <p className="text-sm text-rose-600 mt-1">
                    Dokumen ini perlu diperbaiki. Silakan upload ulang dengan data yang benar.
                  </p>
                </div>
              )}

              {selectedDoc.status === 'verified' && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <ThumbsUp className="w-5 h-5" />
                    <p className="font-medium">Dokumen Valid</p>
                  </div>
                  <p className="text-sm text-emerald-600 mt-1">
                    Dokumen ini telah diverifikasi dan dinyatakan lengkap.
                  </p>
                </div>
              )}

              {selectedDoc.status === 'pending' && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-amber-700">
                    <Clock className="w-5 h-5" />
                    <p className="font-medium">Menunggu Verifikasi</p>
                  </div>
                  <p className="text-sm text-amber-600 mt-1">
                    Dokumen ini sedang dalam proses verifikasi oleh admin.
                  </p>
                </div>
              )}

              {/* Tombol Aksi */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => window.open(selectedDoc.file_url, '_blank')}
                  className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" /> Lihat File
                </button>
                {selectedDoc.status === 'rejected' && (
                  <button
                    onClick={() => navigate('/dokumen/upload')}
                    className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" /> Upload Ulang
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}