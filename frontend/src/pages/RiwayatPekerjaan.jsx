import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Building2,
  Calendar,
  Loader2,
  Clock
} from 'lucide-react';
import { supabase } from '../supabase';

export default function RiwayatPekerjaan() {
  const navigate = useNavigate();
  const [riwayat, setRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRiwayat();
  }, []);

  const fetchRiwayat = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('🔍 Fetching riwayat pekerjaan...');
      
      const { data, error } = await supabase
        .from('riwayat_pekerjaan')
        .select(`
          *,
          pegawai:pegawai_id (
            id,
            full_name,
            nip
          )
        `)
        .order('tahun_mulai', { ascending: false });

      if (error) throw error;

      console.log('📊 Data riwayat pekerjaan:', data);
      
      const formattedData = data.map(item => ({
        id: item.id,
        pegawai_id: item.pegawai_id,
        pegawai: item.pegawai?.full_name || 'Tidak diketahui',
        nip: item.pegawai?.nip || '-',
        jabatan: item.jabatan || '-',
        instansi: item.instansi || '-',
        tahun_mulai: item.tahun_mulai || '-',
        tahun_selesai: item.tahun_selesai || 'Sekarang',
        status: item.status || 'Aktif',
        created_at: item.created_at || new Date()
      }));

      setRiwayat(formattedData);
    } catch (error) {
      console.error('🔥 Error fetching riwayat pekerjaan:', error);
      setError('Gagal memuat data riwayat pekerjaan: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, nama) => {
    if (!window.confirm(`Yakin ingin menghapus riwayat pekerjaan "${nama}"?`)) return;
    
    try {
      const { error } = await supabase
        .from('riwayat_pekerjaan')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      fetchRiwayat();
    } catch (error) {
      console.error('Error deleting riwayat:', error);
      alert('Gagal menghapus riwayat pekerjaan');
    }
  };

  const filteredRiwayat = riwayat.filter(item => {
    const searchLower = search.toLowerCase();
    return (
      item.pegawai?.toLowerCase().includes(searchLower) ||
      item.jabatan?.toLowerCase().includes(searchLower) ||
      item.instansi?.toLowerCase().includes(searchLower) ||
      item.nip?.includes(search)
    );
  });

  const getStatusBadge = (status) => {
    if (status === 'Aktif') {
      return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">✅ Aktif</span>;
    } else if (status === 'Pensiun') {
      return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">⏳ Pensiun</span>;
    } else if (status === 'Pindah') {
      return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">🔄 Pindah</span>;
    }
    return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">{status}</span>;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
        <p className="text-gray-500">Memuat data riwayat pekerjaan...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">💼 Riwayat Pekerjaan</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola riwayat pekerjaan pegawai</p>
        </div>
        <button
          onClick={() => navigate('/riwayat-pekerjaan/new')}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah Riwayat
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-lg shadow-sm p-3 border-l-4 border-teal-600">
          <p className="text-xs text-gray-500">Total Riwayat</p>
          <p className="text-xl font-bold text-gray-800">{riwayat.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-3 border-l-4 border-green-600">
          <p className="text-xs text-gray-500">Aktif</p>
          <p className="text-xl font-bold text-green-600">
            {riwayat.filter(r => r.status === 'Aktif').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-3 border-l-4 border-gray-600">
          <p className="text-xs text-gray-500">Pensiun/Pindah</p>
          <p className="text-xl font-bold text-gray-600">
            {riwayat.filter(r => r.status === 'Pensiun' || r.status === 'Pindah').length}
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          {error}
        </div>
      )}

      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Cari pegawai, jabatan, atau instansi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-teal-400 focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredRiwayat.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Briefcase className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p>Belum ada riwayat pekerjaan</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pegawai</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jabatan</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Instansi</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tahun Mulai</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tahun Selesai</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRiwayat.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800 text-sm">{item.pegawai}</div>
                      <div className="text-xs text-gray-400 font-mono">{item.nip}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.jabatan}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.instansi}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.tahun_mulai}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.tahun_selesai}</td>
                    <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="p-1 text-blue-600 hover:bg-blue-50 rounded transition">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-teal-600 hover:bg-teal-50 rounded transition">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id, item.pegawai)}
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

      <div className="text-xs text-gray-400 text-center">
        Menampilkan {filteredRiwayat.length} dari {riwayat.length} riwayat pekerjaan
      </div>
    </div>
  );
}