// src/pages/dashboard.jsx
import { useState, useEffect } from "react";
import { 
  Users, FileText, UserCheck, UserX, Clock, Building, Briefcase, 
  Upload, Plus, FileUp, TrendingUp, TrendingDown, Activity,
  ArrowLeft
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, PieChart, Pie, Cell, 
  LineChart, Line, ResponsiveContainer, AreaChart, Area,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ComposedChart, Scatter
} from 'recharts';
import { supabase } from "../supabase";
import SearchBar from "../components/SearchBar";
import { useNavigate } from "react-router-dom";

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

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDocuments: 0,
    activeEmployees: 0,
    inactiveEmployees: 0,
    completeEmployees: 0,
    incompleteEmployees: 0,
    recentEmployees: [],
    documentByType: {},
    unitDistribution: {},
    kgbJatuhTempo: 0,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [pegawaiList, setPegawaiList] = useState([]);
  const [dokumenList, setDokumenList] = useState([]);
  const [selectedChart, setSelectedChart] = useState('status');

  // Ambil data dari Supabase
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 1. Ambil pegawai
        const { data: pegawai, error: pegawaiError } = await supabase
          .from("pegawai")
          .select("*");

        if (pegawaiError) throw pegawaiError;
        setPegawaiList(pegawai || []);

        const total = pegawai.length;
        const aktif = pegawai.filter(e => e.status === "aktif").length;
        const cuti = pegawai.filter(e => e.status === "cuti").length;

        // 2. Ambil dokumen
        const { data: dokumen, error: dokumenError } = await supabase
          .from("dokumen")
          .select("*");

        if (dokumenError) throw dokumenError;
        setDokumenList(dokumen || []);

        const totalDocs = dokumen.length;

        // 3. Unit distribution
        const unitCount = {};
        pegawai.forEach(emp => {
          unitCount[emp.work_unit] = (unitCount[emp.work_unit] || 0) + 1;
        });

        // 4. Document by type
        const docTypeCount = {};
        dokumen.forEach(doc => {
          docTypeCount[doc.type] = (docTypeCount[doc.type] || 0) + 1;
        });

        // ✅ 5. HITUNG BERKAS LENGKAP (pegawai dengan minimal 3 dokumen)
        const completeEmployees = pegawai.filter(p => {
          const docCount = dokumen.filter(d => d.employee_id === p.id).length;
          return docCount >= 3;
        }).length;

        const incompleteEmployees = total - completeEmployees;

        // ✅ 6. HITUNG KGB JATUH TEMPO (dari kolom kgb_berakhir)
        const today = new Date();
        const sixtyDaysFromNow = new Date();
        sixtyDaysFromNow.setDate(today.getDate() + 60);

        const todayStr = today.toISOString().split('T')[0];
        const sixtyDaysStr = sixtyDaysFromNow.toISOString().split('T')[0];

        const kgbJatuhTempo = pegawai.filter(p => {
          if (!p.kgb_berakhir) return false;
          const berakhir = p.kgb_berakhir;
          return berakhir >= todayStr && berakhir <= sixtyDaysStr;
        }).length;

        setStats({
          totalEmployees: total,
          totalDocuments: totalDocs,
          activeEmployees: aktif,
          inactiveEmployees: cuti,
          completeEmployees: completeEmployees,
          incompleteEmployees: incompleteEmployees,
          recentEmployees: pegawai.slice(0, 5),
          documentByType: docTypeCount,
          unitDistribution: unitCount,
          kgbJatuhTempo: kgbJatuhTempo,
        });

      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const filteredEmployees = pegawaiList.filter((emp) => {
    return (
      emp.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.nip && emp.nip.includes(searchTerm))
    );
  });

  const handleResultClick = (employee) => {
    window.location.href = `/employees/${employee.id}`;
  };

  // Data untuk diagram
  const statusData = [
    { name: 'Aktif', value: stats.activeEmployees, fill: '#10B981' },
    { name: 'Cuti', value: stats.inactiveEmployees, fill: '#F59E0B' },
  ];

  const unitData = Object.entries(stats.unitDistribution).map(([unit, count]) => ({
    unit: unit.length > 15 ? unit.substring(0, 12) + '...' : unit,
    count: count,
    fullName: unit
  })).sort((a, b) => b.count - a.count);

  const kategoriData = KATEGORI.map(kat => {
    const count = pegawaiList.filter(emp => 
      dokumenList.some(doc => doc.category === kat.id && doc.employee_id === emp.id)
    ).length;
    return {
      kategori: kat.nama.length > 15 ? kat.nama.substring(0, 12) + '...' : kat.nama,
      fullName: kat.nama,
      terisi: count,
      kosong: stats.totalEmployees - count,
      total: stats.totalEmployees,
      persentase: Math.round((count / stats.totalEmployees) * 100)
    };
  }).sort((a, b) => b.persentase - a.persentase);

  const trendData = [
    { bulan: 'Apr', pegawai: 112, dokumen: 245 },
    { bulan: 'Mei', pegawai: 115, dokumen: 267 },
    { bulan: 'Jun', pegawai: 118, dokumen: 289 },
    { bulan: 'Jul', pegawai: 120, dokumen: 312 },
    { bulan: 'Agu', pegawai: stats.totalEmployees - 5, dokumen: 334 },
    { bulan: 'Sep', pegawai: stats.totalEmployees, dokumen: stats.totalDocuments },
  ];

  const radarData = KATEGORI.slice(0, 8).map(kat => {
    const count = pegawaiList.filter(emp => 
      dokumenList.some(doc => doc.category === kat.id && doc.employee_id === emp.id)
    ).length;
    return {
      kategori: kat.nama.length > 10 ? kat.nama.substring(0, 8) + '...' : kat.nama,
      persentase: Math.round((count / stats.totalEmployees) * 100),
      fullName: kat.nama
    };
  });

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="bg-gradient-to-r from-teal-700 to-teal-800 rounded-xl p-6 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-lg">
        <div>
          <h1 className="text-2xl font-bold">Selamat Datang, {localStorage.getItem("username") || "Admin"}!</h1>
          <p className="text-teal-100 mt-1">Kelola data pegawai dan dokumen penting RSUD Dr. Harjono S. Ponorogo</p>
        </div>
        
        <div className="flex items-center gap-3 flex-wrap">
          <div className="w-full md:w-auto">
            <SearchBar 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm}
              filteredData={filteredEmployees} 
              onResultClick={handleResultClick}
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-white to-teal-50 rounded-xl shadow-sm p-5 border border-teal-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total pegawai</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalEmployees}</p>
              <p className="text-xs text-teal-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +12% dari bulan lalu
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg shadow-teal-200">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-emerald-50 rounded-xl shadow-sm p-5 border border-emerald-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Berkas lengkap</p>
              <p className="text-3xl font-bold text-gray-800">{stats.completeEmployees}</p>
              <p className="text-xs text-emerald-600 mt-1">{stats.totalEmployees > 0 ? Math.round(stats.completeEmployees / stats.totalEmployees * 100) : 0}% dari total pegawai</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-200">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-amber-50 rounded-xl shadow-sm p-5 border border-amber-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Belum lengkap</p>
              <p className="text-3xl font-bold text-gray-800">{stats.incompleteEmployees}</p>
              <p className="text-xs text-amber-600 mt-1">Rata-rata kurang 2 kategori</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center shadow-lg shadow-amber-200">
              <UserX className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-rose-50 rounded-xl shadow-sm p-5 border border-rose-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">KGB jatuh tempo</p>
              <p className="text-3xl font-bold text-gray-800">{stats.kgbJatuhTempo}</p>
              <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                <TrendingDown className="w-3 h-3" />
                Dalam 60 hari ke depan
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg flex items-center justify-center shadow-lg shadow-rose-200">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Chart Selector */}
      <div className="flex flex-wrap gap-2 bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <button
          onClick={() => setSelectedChart('status')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            selectedChart === 'status' 
              ? 'bg-teal-600 text-white shadow-md shadow-teal-200' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          📊 Status Pegawai
        </button>
        <button
          onClick={() => setSelectedChart('unit')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            selectedChart === 'unit' 
              ? 'bg-teal-600 text-white shadow-md shadow-teal-200' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          🏢 Unit Kerja
        </button>
        <button
          onClick={() => setSelectedChart('trend')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            selectedChart === 'trend' 
              ? 'bg-teal-600 text-white shadow-md shadow-teal-200' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          📈 Tren Data
        </button>
        <button
          onClick={() => setSelectedChart('radar')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            selectedChart === 'radar' 
              ? 'bg-teal-600 text-white shadow-md shadow-teal-200' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          🎯 Kelengkapan Kategori
        </button>
      </div>

      {/* Chart Display */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        {selectedChart === 'status' && (
          <div>
            <h3 className="font-semibold text-gray-800 mb-4 text-lg flex items-center gap-2">
              <span className="w-1 h-6 bg-teal-600 rounded-full"></span>
              Distribusi Status Pegawai
              <span className="text-sm font-normal text-gray-400 ml-2">Total {stats.totalEmployees} pegawai</span>
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                  label={({ name, percent }) => `${name}\n${(percent * 100).toFixed(0)}%`}
                  labelLine={true}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} stroke="#fff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} pegawai`, 'Jumlah']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {selectedChart === 'unit' && (
          <div>
            <h3 className="font-semibold text-gray-800 mb-4 text-lg flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
              Distribusi Pegawai per Unit Kerja
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={unitData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 'dataMax + 2']} />
                <YAxis type="category" dataKey="unit" fontSize={12} width={80} />
                <Tooltip 
                  formatter={(value) => [`${value} pegawai`, 'Jumlah']}
                  labelFormatter={(label) => {
                    const item = unitData.find(d => d.unit === label);
                    return item ? item.fullName : label;
                  }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="count" fill="url(#unitGradient)" radius={[0, 8, 8, 0]} barSize={20}>
                  {unitData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
                <defs>
                  <linearGradient id="unitGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#0D9488" />
                    <stop offset="100%" stopColor="#14B8A6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {selectedChart === 'trend' && (
          <div>
            <h3 className="font-semibold text-gray-800 mb-4 text-lg flex items-center gap-2">
              <span className="w-1 h-6 bg-purple-600 rounded-full"></span>
              Tren Pertumbuhan Pegawai & Dokumen
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="bulan" />
                <YAxis yAxisId="left" domain={[0, 'dataMax + 20']} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 'dataMax + 50']} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Legend />
                <Area yAxisId="left" type="monotone" dataKey="pegawai" fill="url(#pegawaiGradient)" stroke="#0D9488" strokeWidth={2} name="Pegawai" />
                <Line yAxisId="right" type="monotone" dataKey="dokumen" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 5 }} name="Dokumen" />
                <defs>
                  <linearGradient id="pegawaiGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D9488" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0D9488" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}

        {selectedChart === 'radar' && (
          <div>
            <h3 className="font-semibold text-gray-800 mb-4 text-lg flex items-center gap-2">
              <span className="w-1 h-6 bg-orange-600 rounded-full"></span>
              Kelengkapan per Kategori (Top 8)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#E5E7EB" />
                <PolarAngleAxis dataKey="kategori" fontSize={11} />
                <PolarRadiusAxis domain={[0, 100]} fontSize={11} />
                <Radar name="Kelengkapan" dataKey="persentase" stroke="#0D9488" fill="#0D9488" fillOpacity={0.6} />
                <Tooltip 
                  formatter={(value) => [`${value}% terisi`, 'Kelengkapan']}
                  labelFormatter={(label) => {
                    const item = radarData.find(d => d.kategori === label);
                    return item ? item.fullName : label;
                  }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Kategori Kelengkapan */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b bg-gradient-to-r from-gray-50 to-teal-50">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-600" />
            Kelengkapan per Kategori
            <span className="text-xs text-gray-400 ml-2">klik kartu untuk membuka kategori</span>
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {KATEGORI.map((kat) => {
              const count = pegawaiList.filter(emp => 
                dokumenList.some(doc => doc.category === kat.id && doc.employee_id === emp.id)
              ).length;
              const pct = stats.totalEmployees > 0 ? Math.round((count / stats.totalEmployees) * 100) : 0;
              const isComplete = pct >= 80;
              const isPartial = pct >= 50 && pct < 80;
              const isLow = pct < 50;
              
              let borderColor = 'border-gray-200';
              let bgColor = 'bg-gray-50 hover:bg-teal-50';
              if (isComplete) {
                borderColor = 'border-emerald-400';
                bgColor = 'bg-emerald-50 hover:bg-emerald-100';
              } else if (isPartial) {
                borderColor = 'border-amber-400';
                bgColor = 'bg-amber-50 hover:bg-amber-100';
              } else {
                borderColor = 'border-rose-400';
                bgColor = 'bg-rose-50 hover:bg-rose-100';
              }
              
              return (
                <button
                  key={kat.id}
                  className={`${bgColor} border ${borderColor} rounded-lg p-4 text-left transition-all duration-200 hover:shadow-md hover:-translate-y-1`}
                  onClick={() => window.location.href = `/kategori/${kat.id}`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                      isComplete ? 'bg-emerald-200 text-emerald-700' :
                      isPartial ? 'bg-amber-200 text-amber-700' :
                      'bg-rose-200 text-rose-700'
                    }`}>
                      {String(kat.id).padStart(2, "0")}
                    </span>
                    <span className="text-sm font-medium text-gray-800 line-clamp-1">{kat.nama}</span>
                  </div>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        isComplete ? 'bg-emerald-500' :
                        isPartial ? 'bg-amber-500' :
                        'bg-rose-500'
                      }`} 
                      style={{ width: `${pct}%` }} 
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5 flex items-center justify-between">
                    <span>{count} / {stats.totalEmployees} pegawai</span>
                    <span className={`font-medium ${
                      isComplete ? 'text-emerald-600' :
                      isPartial ? 'text-amber-600' :
                      'text-rose-600'
                    }`}>
                      {pct}%
                    </span>
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Two Columns Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Employees */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="px-6 py-4 border-b bg-gradient-to-r from-gray-50 to-blue-50">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Pegawai Terbaru
              <span className="text-xs text-gray-400 ml-2">5 terakhir</span>
            </h2>
          </div>
          <div className="divide-y">
            {stats.recentEmployees.map((emp, index) => (
              <div key={emp.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium ${
                    index === 0 ? 'bg-teal-500' :
                    index === 1 ? 'bg-blue-500' :
                    index === 2 ? 'bg-purple-500' :
                    'bg-gray-500'
                  }`}>
                    {emp.full_name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{emp.full_name}</p>
                    <p className="text-sm text-gray-500">{emp.position} • {emp.work_unit}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs rounded-full ${
                  emp.status === "aktif" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                }`}>
                  {emp.status === "aktif" ? "🟢 Aktif" : "🟡 Cuti"}
                </span>
              </div>
            ))}
            {stats.recentEmployees.length === 0 && (
              <div className="p-6 text-center text-gray-500">Belum ada data pegawai</div>
            )}
          </div>
        </div>

        {/* Unit Distribution */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="px-6 py-4 border-b bg-gradient-to-r from-gray-50 to-purple-50">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <Building className="w-5 h-5 text-purple-600" />
              Distribusi Pegawai per Unit
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(stats.unitDistribution).sort((a, b) => b[1] - a[1]).map(([unit, count], index) => (
                <div key={unit} className={`bg-gradient-to-br from-white to-${COLORS[index % COLORS.length].replace('#', '')}50 rounded-lg p-3 text-center hover:shadow-md transition-all duration-200 hover:-translate-y-1 border border-${COLORS[index % COLORS.length].replace('#', '')}100`}>
                  <Briefcase className={`w-5 h-5 mx-auto text-${COLORS[index % COLORS.length].replace('#', '')} mb-1`} />
                  <p className="font-semibold text-gray-800 text-sm truncate" title={unit}>{unit}</p>
                  <p className="text-2xl font-bold text-gray-800">{count}</p>
                  <p className="text-xs text-gray-400">pegawai</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Upload Dokumen */}
      <div className="mt-4">
        <div
          className="bg-gradient-to-br from-white to-teal-50 rounded-xl shadow-sm border-2 border-dashed border-teal-300 hover:border-teal-500 hover:bg-teal-50/50 transition-all duration-300 p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-lg"
          onClick={() => window.location.href = "/kategori/1/upload"}
        >
          <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-teal-200 animate-pulse">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Unggah Dokumen Baru</h3>
          <p className="text-sm text-gray-500 mt-1">Klik di sini untuk memilih kategori dan unggah dokumen pegawai</p>
          <button className="mt-4 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-6 py-2 rounded-lg font-medium transition-all shadow-md shadow-teal-200 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Pilih Kategori
          </button>
        </div>
      </div>

    </div>
  );
}