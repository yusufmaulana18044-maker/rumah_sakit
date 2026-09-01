// src/pages/dashboard.jsx
import { useState, useEffect } from "react";
import { 
  Users, FileText, UserCheck, UserX, Clock, Building, Briefcase, 
  Upload, Plus, FileUp, TrendingUp, TrendingDown, Loader2
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, PieChart, Pie, Cell, 
  LineChart, Line, ResponsiveContainer, AreaChart, Area,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ComposedChart
} from 'recharts';
import { supabase } from "../supabase";
import SearchBar from "../components/SearchBar";
import { useLanguage } from "../context/LanguageContext";

// ✅ TAMBAHAN: KOMPONEN QUICKSTATS
function QuickStats({ stats }) {
  const items = [
    { label: 'Total Pegawai', value: stats.totalEmployees, icon: Users, color: 'bg-teal-500' },
    { label: 'Dokumen Terupload', value: stats.totalDocuments, icon: FileText, color: 'bg-blue-500' },
    { label: 'Berkas Lengkap', value: stats.completeEmployees, icon: UserCheck, color: 'bg-green-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((item, idx) => (
        <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{item.value}</p>
            </div>
            <div className={`${item.color} p-3 rounded-lg`}>
              <item.icon className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

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
  const { t, language } = useLanguage(); // ✅ Tambahkan ini

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
  });
  const [pegawai, setPegawai] = useState([]);
  const [dokumen, setDokumen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChart, setSelectedChart] = useState('status');

  // Ambil data dari Supabase
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // FETCH PEGAWAI
      const { data: pegawaiData, error: pegawaiError } = await supabase
        .from("pegawai")
        .select("*")
        .order("created_at", { ascending: false });

      if (pegawaiError) throw pegawaiError;

      // FETCH DOKUMEN
      const { data: dokumenData, error: dokumenError } = await supabase
        .from("dokumen")
        .select("*");

      if (dokumenError) throw dokumenError;

      setPegawai(pegawaiData || []);
      setDokumen(dokumenData || []);

      // HITUNG STATISTIK
      const total = pegawaiData?.length || 0;
      const active = pegawaiData?.filter(p => p.status?.toLowerCase() === "aktif").length || 0;
      const inactive = pegawaiData?.filter(p => p.status?.toLowerCase() === "cuti").length || 0;
      const totalDocs = dokumenData?.length || 0;

      // DISTRIBUSI PER UNIT
      const unitCount = {};
      pegawaiData?.forEach(emp => {
        if (emp.unit_kerja) {
          unitCount[emp.unit_kerja] = (unitCount[emp.unit_kerja] || 0) + 1;
        }
      });

      // 5 PEGAWAI TERBARU
      const recent = pegawaiData?.slice(0, 5) || [];

      // KELENGKAPAN (asumsi: pegawai lengkap kalau punya minimal 3 dokumen)
      const complete = pegawaiData?.filter(p => {
        const docCount = dokumenData?.filter(d => d.pegawai_id === p.id).length || 0;
        return docCount >= 3;
      }).length || 0;

      setStats({
        totalEmployees: total,
        totalDocuments: totalDocs,
        activeEmployees: active,
        inactiveEmployees: inactive,
        recentEmployees: recent,
        documentByType: {},
        unitDistribution: unitCount,
        completeEmployees: complete,
        incompleteEmployees: total - complete,
      });

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // SEARCH
  const filteredEmployees = pegawai.filter((emp) => {
    return (
      emp.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.nip && emp.nip.includes(searchTerm)) ||
      emp.jabatan?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleResultClick = (employee) => {
    window.location.href = `/employees/${employee.id}`;
  };

  // HITUNG KATEGORI
  const getCategoryCount = (categoryId) => {
    return dokumen.filter(d => d.kategori_id === categoryId).length;
  };

  // Data untuk diagram
  const statusData = [
    { name: t.active, value: stats.activeEmployees, fill: '#10B981' },
    { name: t.inactive, value: stats.inactiveEmployees, fill: '#F59E0B' },
  ];

  const unitData = Object.entries(stats.unitDistribution).map(([unit, count]) => ({
    unit: unit.length > 15 ? unit.substring(0, 12) + '...' : unit,
    count: count,
    fullName: unit
  })).sort((a, b) => b.count - a.count);

  const kategoriData = KATEGORI.map(kat => {
    const count = getCategoryCount(kat.id);
    return {
      kategori: kat.nama.length > 15 ? kat.nama.substring(0, 12) + '...' : kat.nama,
      fullName: kat.nama,
      terisi: count,
      kosong: stats.totalEmployees - count,
      total: stats.totalEmployees,
      persentase: stats.totalEmployees ? Math.round((count / stats.totalEmployees) * 100) : 0
    };
  }).sort((a, b) => b.persentase - a.persentase);

  // Data tren (simulasi 6 bulan terakhir)
  const months = language === 'id' 
    ? ['Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep']
    : ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  
  const trendData = [
    { bulan: months[0], pegawai: 112, dokumen: 245 },
    { bulan: months[1], pegawai: 115, dokumen: 267 },
    { bulan: months[2], pegawai: 118, dokumen: 289 },
    { bulan: months[3], pegawai: 120, dokumen: 312 },
    { bulan: months[4], pegawai: stats.totalEmployees - 5, dokumen: 334 },
    { bulan: months[5], pegawai: stats.totalEmployees, dokumen: stats.totalDocuments },
  ];

  // Data untuk radar chart
  const radarData = KATEGORI.slice(0, 8).map(kat => {
    const count = getCategoryCount(kat.id);
    return {
      kategori: kat.nama.length > 10 ? kat.nama.substring(0, 8) + '...' : kat.nama,
      persentase: stats.totalEmployees ? Math.round((count / stats.totalEmployees) * 100) : 0,
      fullName: kat.nama
    };
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
        <p className="text-gray-500 text-sm">{language === 'id' ? 'Memuat dashboard...' : 'Loading dashboard...'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* HEADER DENGAN SEARCH BAR */}
      <div className="bg-gradient-to-r from-teal-700 to-teal-800 rounded-xl p-6 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-lg">
        <div>
          <h1 className="text-2xl font-bold">{t.welcome} {localStorage.getItem("username") || "Admin"}!</h1>
          <p className="text-teal-100 mt-1">{t.welcomeDesc}</p>
        </div>
        
        <div className="w-full md:w-auto">
          <SearchBar 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm}
            filteredData={filteredEmployees} 
            onResultClick={handleResultClick}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border-l-4 border-teal-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t.totalEmployees}</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.totalEmployees}</p>
              <p className="text-xs text-teal-600 dark:text-teal-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +12% {t.fromLastMonth}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg shadow-teal-200">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t.completeDocuments}</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.completeEmployees}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{stats.totalEmployees ? Math.round(stats.completeEmployees / stats.totalEmployees * 100) : 0}% {t.fromLastMonth}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-200">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border-l-4 border-amber-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t.incompleteDocuments}</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.incompleteEmployees}</p>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">{t.avgMissing}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center shadow-lg shadow-amber-200">
              <UserX className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t.totalDocuments}</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.totalDocuments}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{t.documentStats}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* ✅ QUICK STATS (Kartu Ringkasan Cepat) */}
      <QuickStats stats={stats} />

      {/* Chart Selector */}
      <div className="flex flex-wrap gap-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
        <button
          onClick={() => setSelectedChart('status')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            selectedChart === 'status' 
              ? 'bg-teal-600 text-white shadow-md shadow-teal-200' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {t.chartStatus}
        </button>
        <button
          onClick={() => setSelectedChart('unit')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            selectedChart === 'unit' 
              ? 'bg-teal-600 text-white shadow-md shadow-teal-200' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {t.chartUnit}
        </button>
        <button
          onClick={() => setSelectedChart('trend')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            selectedChart === 'trend' 
              ? 'bg-teal-600 text-white shadow-md shadow-teal-200' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {t.chartTrend}
        </button>
        <button
          onClick={() => setSelectedChart('radar')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            selectedChart === 'radar' 
              ? 'bg-teal-600 text-white shadow-md shadow-teal-200' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {t.chartRadar}
        </button>
      </div>

      {/* Chart Display */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        {/* Chart 1: Status Pegawai */}
        {selectedChart === 'status' && (
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4 text-lg flex items-center gap-2">
              <span className="w-1 h-6 bg-teal-600 rounded-full"></span>
              {t.chartStatus}
              <span className="text-sm font-normal text-gray-400 dark:text-gray-500 ml-2">Total {stats.totalEmployees} {t.employee}</span>
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
                  formatter={(value) => [`${value} ${t.employee}`, '']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Chart 2: Unit Kerja */}
        {selectedChart === 'unit' && (
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4 text-lg flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
              {t.chartUnit}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={unitData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 'dataMax + 2']} />
                <YAxis type="category" dataKey="unit" fontSize={12} width={80} />
                <Tooltip 
                  formatter={(value) => [`${value} ${t.employee}`, '']}
                  labelFormatter={(label) => {
                    const item = unitData.find(d => d.unit === label);
                    return item ? item.fullName : label;
                  }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={20}>
                  {unitData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Chart 3: Tren Data */}
        {selectedChart === 'trend' && (
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4 text-lg flex items-center gap-2">
              <span className="w-1 h-6 bg-purple-600 rounded-full"></span>
              {t.chartTrend}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="bulan" />
                <YAxis yAxisId="left" domain={[0, 'dataMax + 20']} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 'dataMax + 50']} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Legend />
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="pegawai" 
                  fill="url(#pegawaiGradient)" 
                  stroke="#0D9488" 
                  strokeWidth={2}
                  name={t.totalEmployees}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="dokumen" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 5 }}
                  name={t.totalDocuments}
                />
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

        {/* Chart 4: Radar Chart */}
        {selectedChart === 'radar' && (
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4 text-lg flex items-center gap-2">
              <span className="w-1 h-6 bg-orange-600 rounded-full"></span>
              {t.chartRadar}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#E5E7EB" />
                <PolarAngleAxis dataKey="kategori" fontSize={11} />
                <PolarRadiusAxis domain={[0, 100]} fontSize={11} />
                <Radar
                  name={t.categoryCompleteness}
                  dataKey="persentase"
                  stroke="#0D9488"
                  fill="#0D9488"
                  fillOpacity={0.6}
                />
                <Tooltip 
                  formatter={(value) => [`${value}% ${t.employee}`, '']}
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
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="px-6 py-4 border-b bg-gradient-to-r from-gray-50 to-teal-50 dark:from-gray-800 dark:to-teal-900/20">
          <h2 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            {t.categoryCompleteness}
            <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">{t.clickToOpen}</span>
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {KATEGORI.map((kat) => {
              const count = getCategoryCount(kat.id);
              const pct = stats.totalEmployees ? Math.round((count / stats.totalEmployees) * 100) : 0;
              const isComplete = pct >= 80;
              const isPartial = pct >= 50 && pct < 80;
              const isLow = pct < 50;
              
              let borderColor = 'border-gray-200 dark:border-gray-600';
              let bgColor = 'bg-gray-50 dark:bg-gray-700/50 hover:bg-teal-50 dark:hover:bg-teal-900/20';
              if (isComplete) {
                borderColor = 'border-emerald-400 dark:border-emerald-600';
                bgColor = 'bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30';
              } else if (isPartial) {
                borderColor = 'border-amber-400 dark:border-amber-600';
                bgColor = 'bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30';
              } else {
                borderColor = 'border-rose-400 dark:border-rose-600';
                bgColor = 'bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/30';
              }
              
              return (
                <button
                  key={kat.id}
                  className={`${bgColor} border ${borderColor} rounded-lg p-4 text-left transition-all duration-200 hover:shadow-md hover:-translate-y-1`}
                  onClick={() => window.location.href = `/kategori/${kat.id}`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                      isComplete ? 'bg-emerald-200 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' :
                      isPartial ? 'bg-amber-200 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300' :
                      'bg-rose-200 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300'
                    }`}>
                      {String(kat.id).padStart(2, "0")}
                    </span>
                    <span className="text-sm font-medium text-gray-800 dark:text-white line-clamp-1">{kat.nama}</span>
                  </div>
                  <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        isComplete ? 'bg-emerald-500' :
                        isPartial ? 'bg-amber-500' :
                        'bg-rose-500'
                      }`} 
                      style={{ width: `${Math.min(pct, 100)}%` }} 
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 flex items-center justify-between">
                    <span>{count} / {stats.totalEmployees} {t.employee}</span>
                    <span className={`font-medium ${
                      isComplete ? 'text-emerald-600 dark:text-emerald-400' :
                      isPartial ? 'text-amber-600 dark:text-amber-400' :
                      'text-rose-600 dark:text-rose-400'
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
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="px-6 py-4 border-b bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20">
            <h2 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              {t.recentEmployees}
              <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">{t.last5}</span>
            </h2>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {stats.recentEmployees.length > 0 ? (
              stats.recentEmployees.map((emp) => (
                <div key={emp.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">{emp.nama}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{emp.jabatan} • {emp.unit_kerja}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    emp.status === "aktif" ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300"
                  }`}>
                    {emp.status === "aktif" ? t.active : t.inactive}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">{t.noData}</div>
            )}
          </div>
        </div>

        {/* Unit Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="px-6 py-4 border-b bg-gradient-to-r from-gray-50 to-purple-50 dark:from-gray-800 dark:to-purple-900/20">
            <h2 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              {t.unitDistribution}
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(stats.unitDistribution).length > 0 ? (
                Object.entries(stats.unitDistribution).sort((a, b) => b[1] - a[1]).map(([unit, count]) => (
                  <div key={unit} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center hover:shadow transition">
                    <Briefcase className="w-5 h-5 mx-auto text-teal-600 dark:text-teal-400 mb-1" />
                    <p className="font-semibold text-gray-800 dark:text-white text-sm truncate">{unit}</p>
                    <p className="text-xl font-bold text-teal-600 dark:text-teal-400">{count}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{t.employee}</p>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center text-gray-500 dark:text-gray-400">{t.noUnit}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Upload Dokumen */}
      <div className="mt-4">
        <div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-teal-400 dark:hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/10 transition-colors p-8 flex flex-col items-center justify-center text-center cursor-pointer"
          onClick={() => window.location.href = "/kategori/1/upload"}
        >
          <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-teal-200 dark:shadow-teal-900/30 animate-pulse">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{t.uploadTitle}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t.uploadDesc}</p>
          <button className="mt-4 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-6 py-2 rounded-lg font-medium transition-all shadow-md shadow-teal-200 dark:shadow-teal-900/30 flex items-center gap-2">
            <Plus className="w-4 h-4" /> {t.uploadButton}
          </button>
        </div>
      </div>

    </div>
  );
}