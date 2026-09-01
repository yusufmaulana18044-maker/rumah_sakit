import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Search, 
  Download, 
  Trash2, 
  Eye,
  FolderOpen,
  Upload,
  Loader2,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { supabase } from '../supabase';

// Mapping category integer ke nama kategori
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

const STATUS_MAP = {
  'verified': 'Terverifikasi',
  'pending': 'Pending',
  'rejected': 'Ditolak'
};

export default function Dokumen() {
  const navigate = useNavigate();
  const [dokumen, setDokumen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterKategori, setFilterKategori] = useState('semua');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDokumen();
  }, []);

  const fetchDokumen = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('🔍 Fetching dokumen from Supabase...');
      
      const { data, error } = await supabase
        .from('dokumen')
        .select(`
          *,
          pegawai:employee_id (
            id,
            full_name,
            nip
          )
        `)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;

      console.log('📊 Data dokumen:', data);
      
      const formattedData = data.map(doc => ({
        id: doc.id,
        nama: doc.name || 'Dokumen',
        kategori: KATEGORI_MAP[doc.category] || 'Lain-lain',
        category: doc.category,
        pegawai: doc.pegawai?.full_name || 'Tidak diketahui',
        nip: doc.pegawai?.nip || '-',
        tanggal: doc.uploaded_at || new Date(),
        status: STATUS_MAP[doc.status] || doc.status || 'Pending',
        file_url: doc.file_url || '#',
        file_path: doc.file_path || '',
        type: doc.type || 'pdf'
      }));

      setDokumen(formattedData);
    } catch (error) {
      console.error('🔥 Error fetching dokumen:', error);
      setError('Gagal memuat data dokumen: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, nama) => {
    if (!window.confirm(`Yakin ingin menghapus dokumen "${nama}"?`)) return;
    
    try {
      const { error } = await supabase
        .from('dokumen')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      fetchDokumen();
    } catch (error) {
      console.error('Error deleting dokumen:', error);
      alert('Gagal menghapus dokumen');
    }
  };

  const filteredDokumen = dokumen.filter(doc => {
    const matchSearch = 
      doc.nama?.toLowerCase().includes(search.toLowerCase()) ||
      doc.pegawai?.toLowerCase().includes(search.toLowerCase()) ||
      doc.nip?.includes(search);
    const matchKategori = filterKategori === 'semua' || doc.kategori === filterKategori;
    return matchSearch && matchKategori;
  });

  const getKategoriBadge = (kategori) => {
    const colors = {
      'SK Pangkat': 'bg-blue-100 text-blue-700',
      'SK Fungsional': 'bg-purple-100 text-purple-700',
      'Data Pribadi': 'bg-green-100 text-green-700',
      'Riwayat Pendidikan': 'bg-yellow-100 text-yellow-700',
      'Uraian Tugas': 'bg-orange-100 text-orange-700',
      'SPK RKK': 'bg-red-100 text-red-700',
      'Penilaian Kinerja': 'bg-indigo-100 text-indigo-700',
      'SPMT': 'bg-pink-100 text-pink-700',
      'Orientasi': 'bg-cyan-100 text-cyan-700',
      'KGB': 'bg-amber-100 text-amber-700',
    };
    return colors[kategori] || 'bg-gray-100 text-gray-700';
  };

  const getStatusBadge = (status) => {
    if (status === 'Terverifikasi') {
      return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Terverifikasi</span>;
    } else if (status === 'Pending') {
      return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700 flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>;
    } else if (status === 'Ditolak') {
      return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700 flex items-center gap-1"><XCircle className="w-3 h-3" /> Ditolak</span>;
    }
    return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">{status}</span>;
  };

  const getKategoriList = () => {
    const kategoriSet = new Set(dokumen.map(d => d.kategori));
    return ['semua', ...kategoriSet];
  };

  const getFileIcon = (type) => {
    if (type === 'pdf') return '📄';
    if (type === 'jpg' || type === 'jpeg' || type === 'png') return '🖼️';
    if (type === 'doc' || type === 'docx') return '📝';
    if (type === 'xls' || type === 'xlsx') return '📊';
    return '📁';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
        <p className="text-gray-500">Memuat data dokumen...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">📁 Kelola Dokumen</h1>
          <p className="text-gray-500 text-sm mt-1">Upload dan kelola dokumen pegawai</p>
        </div>
        <button
          onClick={() => navigate('/dokumen/upload')}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload Dokumen
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-lg shadow-sm p-3 border-l-4 border-teal-600">
          <p className="text-xs text-gray-500">Total Dokumen</p>
          <p className="text-xl font-bold text-gray-800">{dokumen.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-3 border-l-4 border-green-600">
          <p className="text-xs text-gray-500">Terverifikasi</p>
          <p className="text-xl font-bold text-green-600">
            {dokumen.filter(d => d.status === 'Terverifikasi').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-3 border-l-4 border-yellow-600">
          <p className="text-xs text-gray-500">Pending</p>
          <p className="text-xl font-bold text-yellow-600">
            {dokumen.filter(d => d.status === 'Pending').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-3 border-l-4 border-blue-600">
          <p className="text-xs text-gray-500">Kategori</p>
          <p className="text-xl font-bold text-blue-600">
            {new Set(dokumen.map(d => d.kategori)).size}
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          {error}
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari dokumen, pegawai, atau NIP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-teal-400 focus:outline-none"
          />
        </div>
        <select
          value={filterKategori}
          onChange={(e) => setFilterKategori(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:border-teal-400 focus:outline-none"
        >
          {getKategoriList().map(k => (
            <option key={k} value={k}>
              {k === 'semua' ? '📂 Semua Kategori' : k}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredDokumen.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FolderOpen className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p>Belum ada dokumen</p>
            <p className="text-sm mt-1">Upload dokumen pertama Anda</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dokumen</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pegawai</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIP</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredDokumen.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getFileIcon(doc.type)}</span>
                        <span className="font-medium text-gray-800 text-sm">{doc.nama}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{doc.pegawai}</td>
                    <td className="px-4 py-3 font-mono text-sm text-gray-500">{doc.nip}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${getKategoriBadge(doc.kategori)}`}>
                        {doc.kategori}
                      </span>
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(doc.status)}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(doc.tanggal).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {doc.file_url && doc.file_url !== '#' && (
                          <a 
                            href={doc.file_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                        )}
                        <button className="p-1 text-teal-600 hover:bg-teal-50 rounded transition">
                          <Download className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(doc.id, doc.nama)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="text-xs text-gray-400 text-center">
        Menampilkan {filteredDokumen.length} dari {dokumen.length} dokumen
      </div>
    </div>
  );
  // Di Dokumen.jsx, tambahkan state:
const [previewFile, setPreviewFile] = useState(null);
const [showPreview, setShowPreview] = useState(false);

// Fungsi untuk preview:
const handlePreview = (fileUrl) => {
  setPreviewFile(fileUrl);
  setShowPreview(true);
};

// Tambahkan modal preview di bagian bawah:
{showPreview && previewFile && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Preview Dokumen</h3>
        <button onClick={() => setShowPreview(false)} className="p-1 hover:bg-gray-100 rounded">
          <X className="w-5 h-5" />
        </button>
      </div>
      {previewFile.match(/\.(jpg|jpeg|png|gif)$/i) ? (
        <img src={previewFile} alt="Preview" className="w-full rounded-lg" />
      ) : previewFile.match(/\.pdf$/i) ? (
        <iframe src={previewFile} className="w-full h-[500px] rounded-lg" />
      ) : (
        <div className="text-center py-10 text-gray-500">
          <File className="w-16 h-16 mx-auto text-gray-300" />
          <p>File tidak bisa dipreview</p>
          <a href={previewFile} target="_blank" className="text-teal-600 hover:underline">
            Download File
          </a>
        </div>
      )}
    </div>
  </div>
)}

// Di tombol preview:
<button 
  onClick={() => handlePreview(doc.file_url)}
  className="p-1 text-blue-600 hover:bg-blue-50 rounded transition"
>
  <Eye className="w-4 h-4" />
</button>
}