// src/pages/dashboard.jsx
import { useState, useEffect } from "react";
import { Users, FileText, UserCheck, UserX, Clock, Building, Briefcase } from "lucide-react";
import dummyEmployees from "../data/dummyEmployees";

const KATEGORI = [
  { id: 1, nama: "SK Pangkat (Mulai CPNS)" },
  { id: 2, nama: "SK Fungsional" },
  { id: 3, nama: "Data Pribadi" },
  { id: 4, nama: "Riwayat Pendidikan" },
  { id: 5, nama: "Uraian Tugas" },
  { id: 6, nama: "SPK RKK (Khusus Nakes)" },
  { id: 7, nama: "Penilaian Kinerja (SKP)" },
  { id: 8, nama: "SPMT" },
  { id: 9, nama: "Orientasi" },
  { id: 10, nama: "KGB" },
  { id: 11, nama: "Pengembangan Kompetensi" },
  { id: 12, nama: "Riwayat Jabatan" },
  { id: 13, nama: "Check Up" },
  { id: 14, nama: "Lain-lain" },
];

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDocuments: 0,
    activeEmployees: 0,
    inactiveEmployees: 0,
    recentEmployees: [],
    documentByType: {},
    unitDistribution: {},
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
      unitDistribution: unitCount,
      completeEmployees: Math.floor(total * 0.72),
      incompleteEmployees: Math.floor(total * 0.28),
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-teal-700 to-teal-800 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold">Selamat Datang, {localStorage.getItem("username") || "Admin"}!</h1>
        <p className="text-teal-100 mt-1">Kelola data pegawai dan dokumen penting RSUD Dr. Harjono S. Ponorogo</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-teal-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total pegawai</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalEmployees}</p>
              <p className="text-xs text-gray-400 mt-1">PNS · PPPK · BLUD</p>
            </div>
            <Users className="w-10 h-10 text-teal-600 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Berkas lengkap</p>
              <p className="text-3xl font-bold text-gray-800">{stats.completeEmployees}</p>
              <p className="text-xs text-gray-400 mt-1">{Math.round(stats.completeEmployees / stats.totalEmployees * 100)}% dari total pegawai</p>
            </div>
            <UserCheck className="w-10 h-10 text-green-600 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-amber-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Belum lengkap</p>
              <p className="text-3xl font-bold text-gray-800">{stats.incompleteEmployees}</p>
              <p className="text-xs text-gray-400 mt-1">Rata-rata kurang 2 kategori</p>
            </div>
            <UserX className="w-10 h-10 text-amber-600 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-red-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">KGB jatuh tempo</p>
              <p className="text-3xl font-bold text-gray-800">18</p>
              <p className="text-xs text-gray-400 mt-1">Dalam 60 hari ke depan</p>
            </div>
            <Clock className="w-10 h-10 text-red-600 opacity-70" />
          </div>
        </div>
      </div>

      {/* Kategori Kelengkapan */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-600" />
            Kelengkapan per kategori
            <span className="text-xs text-gray-400 ml-2">klik kartu untuk membuka kategori</span>
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {KATEGORI.map((kat) => {
              const count = dummyEmployees.filter(emp => 
                emp.documents?.some(doc => doc.category === kat.id)
              ).length;
              const pct = Math.round((count / stats.totalEmployees) * 100);
              return (
                <button
                  key={kat.id}
                  className="bg-gray-50 hover:bg-teal-50 border border-gray-200 rounded-lg p-4 text-left transition hover:border-teal-400"
                  onClick={() => window.location.href = `/kategori/${kat.id}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono bg-teal-100 text-teal-700 px-2 py-0.5 rounded">
                      {String(kat.id).padStart(2, "0")}
                    </span>
                    <span className="text-sm font-medium text-gray-800">{kat.nama}</span>
                  </div>
                  <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-600 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{count} / {stats.totalEmployees} pegawai · {pct}%</p>
                </button>
              );
            })}
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

        {/* Unit Distribution */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <Building className="w-4 h-4 text-teal-600" />
              Distribusi Pegawai per Unit
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(stats.unitDistribution).map(([unit, count]) => (
                <div key={unit} className="bg-gray-50 rounded-lg p-3 text-center hover:shadow transition">
                  <Briefcase className="w-5 h-5 mx-auto text-teal-600 mb-1" />
                  <p className="font-semibold text-gray-800 text-sm truncate">{unit}</p>
                  <p className="text-xl font-bold text-teal-600">{count}</p>
                  <p className="text-xs text-gray-400">pegawai</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}