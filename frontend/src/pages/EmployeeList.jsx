import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Eye, Edit, Trash2, FileText } from "lucide-react";
import dummyEmployees from "../data/dummyEmployees";

export default function EmployeeList() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState(dummyEmployees);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");

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

  const getStatusBadge = (status) => {
    switch(status) {
      case "aktif":
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Aktif</span>;
      case "cuti":
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">Cuti</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">📋 Data Pegawai</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola data pegawai RSUD Dr. Hardjono</p>
        </div>
        <button
          onClick={() => navigate("/employees/new")}
          className="bg-gradient-to-r from-teal-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-teal-700 hover:to-blue-700 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah Pegawai
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
      <div className="bg-white rounded-xl shadow overflow-hidden">
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
            <tbody className="divide-y divide-gray-200">
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
                    <button
                      onClick={() => navigate(`/employees/${emp.id}/documents`)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                    >
                      <FileText className="w-4 h-4" />
                      <span className="text-sm">{emp.documents?.length || 0} file</span>
                    </button>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(emp.status)}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/employees/${emp.id}`)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition"
                        title="Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => navigate(`/employees/${emp.id}/edit`)}
                        className="p-1 text-teal-600 hover:bg-teal-50 rounded transition"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
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
        
        {filteredEmployees.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Tidak ada data pegawai yang ditemukan
          </div>
        )}
      </div>
    </div>
  );
}