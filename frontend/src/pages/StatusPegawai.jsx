import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { 
  Search, 
  RefreshCw, 
  UserCheck, 
  UserX, 
  Clock,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Users
} from 'lucide-react';

export default function StatusPegawai() {
  const [pegawai, setPegawai] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('semua');
  const [updating, setUpdating] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchPegawai();
  }, []);

  const fetchPegawai = async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error } = await supabase
        .from('pegawai')
        .select('*')
        .order('full_name', { ascending: true });

      if (error) throw error;
      setPegawai(data || []);
    } catch (error) {
      console.error('Error fetching pegawai:', error);
      setError('Gagal memuat data pegawai');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setUpdating(id);
    setError('');
    setSuccess('');
    
    try {
      const { error } = await supabase
        .from('pegawai')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setPegawai(pegawai.map(p => 
        p.id === id ? { ...p, status: newStatus } : p
      ));

      setSuccess(`Status pegawai berhasil diubah menjadi ${newStatus}`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Gagal mengubah status pegawai');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'aktif':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Aktif</span>;
      case 'cuti':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700 flex items-center gap-1"><Clock className="w-3 h-3" /> Cuti</span>;
      case 'nonaktif':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700 flex items-center gap-1"><XCircle className="w-3 h-3" /> Nonaktif</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  const filteredPegawai = pegawai.filter(p => {
    const matchSearch = 
      p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.nip?.includes(search);
    const matchStatus = filterStatus === 'semua' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: pegawai.length,
    aktif: pegawai.filter(p => p.status === 'aktif').length,
    cuti: pegawai.filter(p => p.status === 'cuti').length,
    nonaktif: pegawai.filter(p => p.status === 'nonaktif').length
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
        <p className="text-gray-500">Memuat data pegawai...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🔄 Manajemen Status Pegawai</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola status pegawai (Aktif / Cuti / Nonaktif)</p>
        </div>
        <button
          onClick={fetchPegawai}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-lg shadow-sm p-3 border-l-4 border-teal-600">
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-3 border-l-4 border-green-600">
          <p className="text-xs text-gray-500">Aktif</p>
          <p className="text-xl font-bold text-green-600">{stats.aktif}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-3 border-l-4 border-yellow-600">
          <p className="text-xs text-gray-500">Cuti</p>
          <p className="text-xl font-bold text-yellow-600">{stats.cuti}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-3 border-l-4 border-red-600">
          <p className="text-xs text-gray-500">Nonaktif</p>
          <p className="text-xl font-bold text-red-600">{stats.nonaktif}</p>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-600 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          {success}
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari NIP atau Nama Pegawai..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-teal-400 focus:outline-none"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:border-teal-400 focus:outline-none"
        >
          <option value="semua">📂 Semua Status</option>
          <option value="aktif">✅ Aktif</option>
          <option value="cuti">⏳ Cuti</option>
          <option value="nonaktif">❌ Nonaktif</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredPegawai.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p>Tidak ada data pegawai</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pegawai</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIP</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status Saat Ini</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ubah Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPegawai.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800">{p.full_name}</div>
                      <div className="text-xs text-gray-400">{p.position}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-sm text-gray-600">{p.nip}</td>
                    <td className="px-4 py-3">{getStatusBadge(p.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStatusChange(p.id, 'aktif')}
                          disabled={updating === p.id || p.status === 'aktif'}
                          className={`px-2 py-1 text-xs rounded-lg transition flex items-center gap-1 ${
                            p.status === 'aktif'
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {updating === p.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <UserCheck className="w-3 h-3" />}
                          Aktif
                        </button>
                        <button
                          onClick={() => handleStatusChange(p.id, 'cuti')}
                          disabled={updating === p.id || p.status === 'cuti'}
                          className={`px-2 py-1 text-xs rounded-lg transition flex items-center gap-1 ${
                            p.status === 'cuti'
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          }`}
                        >
                          {updating === p.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Clock className="w-3 h-3" />}
                          Cuti
                        </button>
                        <button
                          onClick={() => handleStatusChange(p.id, 'nonaktif')}
                          disabled={updating === p.id || p.status === 'nonaktif'}
                          className={`px-2 py-1 text-xs rounded-lg transition flex items-center gap-1 ${
                            p.status === 'nonaktif'
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          {updating === p.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <UserX className="w-3 h-3" />}
                          Nonaktif
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
        Menampilkan {filteredPegawai.length} dari {pegawai.length} pegawai
      </div>
    </div>
  );
}