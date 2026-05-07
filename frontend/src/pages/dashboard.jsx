import { useState, useEffect } from "react";
import { Users, FileText, UserCheck, UserX, Clock, TrendingUp, Building, Briefcase, Upload } from "lucide-react";
import dummyEmployees from "../data/dummyEmployees";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDocuments: 0,
    activeEmployees: 0,
    inactiveEmployees: 0,
    recentEmployees: [],
    documentByType: {},
    unitDistribution: {}
  });

  useEffect(() => {
    const total = dummyEmployees.length;
    const active = dummyEmployees.filter(emp => emp.status === "aktif").length;
    const inactive = dummyEmployees.filter(emp => emp.status === "cuti").length;
    
    let totalDocs = 0;
    const docTypeCount = {};
    const unitCount = {};
    
    dummyEmployees.forEach(emp => {
      unitCount[emp.work_unit] = (unitCount[emp.work_unit] || 0) + 1;
      
      if (emp.documents && emp.documents.length > 0) {
        totalDocs += emp.documents.length;
        emp.documents.forEach(doc => {
          docTypeCount[doc.type] = (docTypeCount[doc.type] || 0) + 1;
        });
      }
    });
    
    const recent = [...dummyEmployees].reverse().slice(0, 5);
    
    setStats({
      totalEmployees: total,
      totalDocuments: totalDocs,
      activeEmployees: active,
      inactiveEmployees: inactive,
      recentEmployees: recent,
      documentByType: docTypeCount,
      unitDistribution: unitCount
    });
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold">Selamat Datang, {localStorage.getItem("username") || "Admin"}!</h1>
        <p className="text-teal-100 mt-1">Kelola data pegawai dan dokumen penting RSUD Dr. Hardjono</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-teal-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Pegawai</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalEmployees}</p>
            </div>
            <Users className="w-10 h-10 text-teal-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Dokumen</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalDocuments}</p>
            </div>
            <FileText className="w-10 h-10 text-blue-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pegawai Aktif</p>
              <p className="text-3xl font-bold text-gray-800">{stats.activeEmployees}</p>
            </div>
            <UserCheck className="w-10 h-10 text-green-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pegawai Cuti</p>
              <p className="text-3xl font-bold text-gray-800">{stats.inactiveEmployees}</p>
            </div>
            <UserX className="w-10 h-10 text-yellow-500 opacity-70" />
          </div>
        </div>
      </div>

      {/* Two Columns Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Employees */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600" />
              Pegawai Terbaru
            </h2>
          </div>
          <div className="divide-y">
            {stats.recentEmployees.map((emp) => (
              <div key={emp.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                <div>
                  <p className="font-medium text-gray-800">{emp.full_name}</p>
                  <p className="text-sm text-gray-500">{emp.position} • {emp.work_unit}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  emp.status === "aktif" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                }`}>
                  {emp.status === "aktif" ? "Aktif" : "Cuti"}
                </span>
              </div>
            ))}
            {stats.recentEmployees.length === 0 && (
              <div className="p-6 text-center text-gray-500">Belum ada data pegawai</div>
            )}
          </div>
        </div>

        {/* Document Distribution */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-600" />
              Distribusi Dokumen
            </h2>
          </div>
          <div className="p-6">
            {Object.keys(stats.documentByType).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(stats.documentByType).map(([type, count]) => (
                  <div key={type} className="flex items-center gap-3">
                    <div className="w-28 text-sm text-gray-600">{type}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-teal-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(count / stats.totalDocuments) * 100}%` }}
                      />
                    </div>
                    <div className="text-sm font-semibold text-gray-700 w-8">{count}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                <p>Belum ada dokumen yang diupload</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Unit Distribution */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <Building className="w-4 h-4 text-teal-600" />
            Distribusi Pegawai per Unit Kerja
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(stats.unitDistribution).map(([unit, count]) => (
              <div key={unit} className="bg-gray-50 rounded-lg p-4 text-center hover:shadow-md transition">
                <Briefcase className="w-6 h-6 mx-auto text-teal-600 mb-2" />
                <p className="font-semibold text-gray-800 text-sm">{unit}</p>
                <p className="text-2xl font-bold text-teal-600">{count}</p>
                <p className="text-xs text-gray-500">pegawai</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <Upload className="w-4 h-4 text-teal-600" />
            Aksi Cepat
          </h2>
        </div>
        <div className="p-6 flex flex-wrap gap-4">
          <a 
            href="/employees/new" 
            className="px-5 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            Tambah Pegawai Baru
          </a>
          <a 
            href="/employees" 
            className="px-5 py-2 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 transition flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Kelola Data Pegawai
          </a>
        </div>
      </div>
    </div>
  );
}