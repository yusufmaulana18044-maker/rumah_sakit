import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  BookOpen,
  Loader2,
  Calendar,
  School,
  Award
} from 'lucide-react';
import { supabase } from '../supabase';

export default function RiwayatPendidikan() {
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
      console.log('🔍 Fetching riwayat pendidikan...');
      
      const { data, error } = await supabase
        .from('riwayat_pendidikan')
        .select(`
          *,
          pegawai:pegawai_id (
            id,
            full_name,
            nip
          )
        `)
        .order('tahun_lulus', { ascending: false });

      if (error) throw error;

      console.log('📊 Data riwayat pendidikan:', data);
      
      const formattedData = data.map(item => ({
        id: item.id,
        pegawai_id: item.pegawai_id,
        pegawai: item.pegawai?.full_name || 'Tidak diketahui',
        nip: item.pegawai?.nip || '-',
        jenjang: item.jenjang || 'S1',
        institusi: item.institusi || '-',
        jurusan: item.jurusan || '-',
        tahun_masuk: item.tahun_masuk || '-',
        tahun_lulus: item.tahun_lulus || '-',
        ipk: item.ipk || '-',
        status: item.status || 'Lulus',
        created_at: item.created_at || new Date()
      }));

      setRiwayat(formattedData);
    } catch (error) {
      console.error('🔥 Error fetching riwayat pendidikan:', error);
      setError('Gagal memuat data riwayat pendidikan: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, nama) => {
    if (!window.confirm(`Yakin ingin menghapus riwayat pendidikan "${nama}"?`)) return;
    
    try {
      const { error } = await supabase
        .from('riwayat_pendidikan')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      fetchRiwayat();
    } catch (error) {
      console.error('Error deleting riwayat:', error);
      alert('Gagal menghapus riwayat pendidikan');
    }
  };

  const filteredRiwayat = riwayat.filter(item => {
    const searchLower = search.toLowerCase();
    return (
      item.pegawai?.toLowerCase().includes(searchLower) ||
      item.institusi?.toLowerCase().includes(searchLower) ||
      item.jurusan?.toLowerCase().includes(searchLower) ||
      item.nip?.includes(search)
    );
  });

  const getJenjangBadge = (jenjang) => {
    const colors = {
      'SD': 'bg-blue-100 text-blue-700',
      'SMP': 'bg-green-100 text-green-700',
      'SMA': 'bg-yellow-100 text-yellow-700',
      'D3': 'bg-purple-100 text-purple-700',
      'D4': 'bg-indigo-100 text-indigo-700',
      'S1': 'bg-teal-100 text-teal-700',
      'S2': 'bg-cyan-100 text-cyan-700',
      'S3': 'bg-rose-100 text-rose-700',
    };
    return colors[jenjang] || 'bg-gray-100 text-gray-700';
  };

  const getStatusBadge = (status) => {
    if (status === 'Lulus') {
      return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">✅ Lulus</span>;
    } else if (status === 'Sedang Berlangsung') {
      return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">⏳ Sedang Berlangsung</span>;
    }
    return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">{status}</span>;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
        <p className="text-gray-500">Memuat data riwayat pendidikan...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🎓 Riwayat Pendidikan</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola riwayat pendidikan pegawai</p>
        </div>
        <button
          onClick={() => navigate('/riwayat-pendidikan/new')}
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
          <p className="text-xs text-gray-500">Lulus</p>
          <p className="text-xl font-bold text-green-600">
            {riwayat.filter(r => r.status === 'Lulus').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-3 border-l-4 border-yellow-600">
          <p className="text-xs text-gray-500">Sedang Berlangsung</p>
          <p className="text-xl font-bold text-yellow-600">
            {riwayat.filter(r => r.status === 'Sedang Berlangsung').length}
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
          placeholder="Cari pegawai, institusi, atau jurusan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-teal-400 focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredRiwayat.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <GraduationCap className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p>Belum ada riwayat pendidikan</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pegawai</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jenjang</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Institusi</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jurusan</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tahun Lulus</th>
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
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${getJenjangBadge(item.jenjang)}`}>
                        {item.jenjang}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.institusi}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.jurusan}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.tahun_lulus}</td>
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
        Menampilkan {filteredRiwayat.length} dari {riwayat.length} riwayat pendidikan
      </div>
    </div>
  );
}