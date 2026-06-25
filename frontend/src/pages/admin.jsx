import { useState, useEffect } from "react";
import { Users, FileText, UserCheck, UserX, Plus, Eye, Edit, Trash2, Search } from "lucide-react";
import dummyEmployees from "../data/dummyEmployees";

export default function Admin() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");

  useEffect(() => {
    // Ambil data dari dummyEmployees
    setEmployees(dummyEmployees);
  }, []);

  const handleDelete = (id, name) => {
    if (window.confirm(`Yakin ingin menghapus pegawai "${name}"?`)) {
      setEmployees(employees.filter(emp => emp.id !== id));
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.full_name.toLowerCase().includes(search.toLowerCase()) ||
                          emp.nip.includes(search) ||
                          emp.position.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "semua" || emp.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: employees.length,
    aktif: employees.filter(e => e.status === "aktif").length,
    cuti: employees.filter(e => e.status === "cuti").length,
    dokumen: employees.reduce((sum, e) => sum + (e.documents?.length || 0), 0)
  };

  const getStatusBadge = (status) => {
    if (status === "aktif") {
      return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Aktif</span>;
    }
    return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">Cuti</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">📋 Data Pegawai</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola data pegawai RSUD Dr. Hardjono</p>
        </div>
        <a
          href="/employees/new"
          className="bg-gradient-to-r from-teal-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-teal-700 hover:to-blue-700 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah Pegawai
        </a>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-teal-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Pegawai</p>
              <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <Users className="w-10 h-10 text-teal-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Dokumen</p>
              <p className="text-3xl font-bold text-gray-800">{stats.dokumen}</p>
            </div>
            <FileText className="w-10 h-10 text-blue-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pegawai Aktif</p>
              <p className="text-3xl font-bold text-gray-800">{stats.aktif}</p>
            </div>
            <UserCheck className="w-10 h-10 text-green-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pegawai Cuti</p>
              <p className="text-3xl font-bold text-gray-800">{stats.cuti}</p>
            </div>
            <UserX className="w-10 h-10 text-yellow-500 opacity-70" />
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari NIP, Nama, atau Jabatan..."
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
          <option value="semua">Semua Status</option>
          <option value="aktif">Aktif</option>
          <option value="cuti">Cuti</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredEmployees.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p>Tidak ada data pegawai</p>
            <a href="/employees/new" className="text-teal-600 hover:underline mt-2 inline-block">
              + Tambah pegawai baru
            </a>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIP</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jabatan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dokumen</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-600">{emp.nip}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800">{emp.full_name}</div>
                      <div className="text-xs text-gray-400">{emp.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{emp.position}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{emp.work_unit}</td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-teal-600">
                        {emp.documents?.length || 0} file
                      </span>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(emp.status)}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <a
                          href={`/employees/${emp.id}`}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded transition"
                          title="Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                        <a
                          href={`/employees/${emp.id}/edit`}
                          className="p-1 text-teal-600 hover:bg-teal-50 rounded transition"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleDelete(emp.id, emp.full_name)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                          title="Hapus"
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
    </div>
  );
}