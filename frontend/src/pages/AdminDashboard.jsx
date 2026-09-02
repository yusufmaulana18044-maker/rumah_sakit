import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  UserPlus, 
  LayoutDashboard, 
  FileText, 
  LogOut, 
  ChevronRight,
  GraduationCap,
  Stethoscope,
  HeartPulse,
  UserCog
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPegawai: 0,
    aktif: 0,
    cuti: 0,
    dokumen: 0
  });
  const [profileData, setProfileData] = useState({
    fullName: '',
    avatar: '👤'
  });

  useEffect(() => {
    const user = localStorage.getItem('username');
    setUsername(user || 'Admin');
    fetchStats();
    fetchProfile();
    setLoading(false);
  }, []);

  const fetchStats = async () => {
    try {
      const { data: pegawaiData, error: pegawaiError } = await supabase
        .from('pegawai')
        .select('status');
      
      if (!pegawaiError && pegawaiData) {
        const total = pegawaiData.length;
        
        const aktif = pegawaiData.filter(p => 
          p.status?.toLowerCase() === 'aktif'
        ).length;
        
        const cuti = pegawaiData.filter(p => 
          p.status?.toLowerCase() === 'cuti'
        ).length;
        
        const { data: dokumenData, error: dokumenError } = await supabase
          .from('dokumen')
          .select('id');
        
        const totalDokumen = !dokumenError && dokumenData ? dokumenData.length : 0;
        
        setStats({ 
          totalPegawai: total, 
          aktif, 
          cuti, 
          dokumen: totalDokumen 
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchProfile = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user.id) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, avatar")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfileData({
          fullName: data.full_name || username,
          avatar: data.avatar || "👤"
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const renderAvatar = (avatarValue) => {
    if (typeof avatarValue === "string" && avatarValue.startsWith("data:image/")) {
      return (
        <img
          src={avatarValue}
          alt="Foto profil"
          className="w-full h-full object-cover rounded-full"
        />
      );
    }
    return <span className="text-lg">{avatarValue || "👤"}</span>;
  };

  const menuItems = [
    { 
      id: 'pegawai', 
      title: '📋 Data Pegawai', 
      desc: 'Lihat dan kelola data semua pegawai',
      path: '/employees',
      icon: Users,
      color: 'from-teal-500 to-teal-700'
    },
    { 
      id: 'tambah', 
      title: '➕ Tambah Pegawai', 
      desc: 'Tambah data pegawai baru',
      path: '/employees/new',
      icon: UserPlus,
      color: 'from-emerald-400 to-teal-600'
    },
    { 
      id: 'dashboard', 
      title: '📊 Dashboard', 
      desc: 'Lihat statistik dan ringkasan',
      path: '/dashboard',
      icon: LayoutDashboard,
      color: 'from-blue-500 to-blue-700'
    },
    { 
      id: 'dokumen', 
      title: '📁 Kelola Dokumen', 
      desc: 'Upload dan kelola dokumen pegawai',
      path: '/dokumen',
      icon: FileText,
      color: 'from-cyan-500 to-teal-600'
    },
    { 
      id: 'riwayat_pendidikan', 
      title: '🎓 Riwayat Pendidikan', 
      desc: 'Kelola riwayat pendidikan pegawai',
      path: '/riwayat-pendidikan',
      icon: GraduationCap,
      color: 'from-blue-400 to-teal-500'
    },
    { 
      id: 'status', 
      title: '🔄 Manajemen Status', 
      desc: 'Kelola status pegawai (Aktif/Cuti/Nonaktif)',
      path: '/status-pegawai',
      icon: UserCog,
      color: 'from-teal-500 to-blue-600'
    }
  ];

  const handleMenuClick = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-50 to-blue-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-blue-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <HeartPulse className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    SICAKEP
                  </h1>
                  <p className="text-teal-100 text-sm">
                    Sistem Informasi Catat Kepegawaian
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
                <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                  {renderAvatar(profileData.avatar)}
                </div>
                <span className="text-white font-medium text-sm">{username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/10"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-teal-100/50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                👋 Selamat Datang, <span className="text-teal-600">{username}</span>!
              </h2>
              <p className="text-gray-500 mt-1 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-teal-500" />
                Kelola data pegawai dan dokumen penting RSUD Dr. Harjono S. Ponorogo
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-4 py-2 bg-gradient-to-r from-teal-100 to-blue-100 text-teal-700 rounded-full text-sm font-semibold flex items-center gap-2">
                <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
                Admin
              </span>
              <span className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm hidden sm:inline">
                {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-teal-600 hover:shadow-md transition hover:border-teal-700">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Pegawai</p>
            <p className="text-2xl font-bold text-teal-700">{stats.totalPegawai}</p>
            <p className="text-xs text-gray-400 mt-1">Seluruh pegawai</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-emerald-500 hover:shadow-md transition hover:border-emerald-600">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Aktif</p>
            <p className="text-2xl font-bold text-emerald-600">{stats.aktif}</p>
            <p className="text-xs text-gray-400 mt-1">Pegawai aktif</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-amber-500 hover:shadow-md transition hover:border-amber-600">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Cuti</p>
            <p className="text-2xl font-bold text-amber-600">{stats.cuti}</p>
            <p className="text-xs text-gray-400 mt-1">Sedang cuti</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-blue-500 hover:shadow-md transition hover:border-blue-600">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Dokumen</p>
            <p className="text-2xl font-bold text-blue-600">{stats.dokumen}</p>
            <p className="text-xs text-gray-400 mt-1">Total dokumen</p>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => handleMenuClick(item.path)}
                className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer hover:-translate-y-1 border border-teal-50/50"
              >
                <div className={`bg-gradient-to-r ${item.color} p-4 flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-white font-semibold text-sm">{item.title}</h3>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
                <div className="p-5">
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-teal-600 font-medium">Klik untuk buka</span>
                    <span className="text-xs text-gray-300">→</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-teal-100/50">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-teal-500 rounded-full"></span>
            ⚡ Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button 
              onClick={() => navigate('/employees/new')}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all hover:-translate-y-0.5 text-sm font-medium"
            >
              <UserPlus className="w-4 h-4" />
              Tambah Pegawai
            </button>
            <button 
              onClick={() => navigate('/employees')}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl hover:shadow-lg transition-all hover:-translate-y-0.5 text-sm font-medium"
            >
              <Users className="w-4 h-4" />
              Lihat Semua
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg transition-all hover:-translate-y-0.5 text-sm font-medium"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>
            <button 
              onClick={() => navigate('/status-pegawai')}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all hover:-translate-y-0.5 text-sm font-medium"
            >
              <UserCog className="w-4 h-4" />
              Kelola Status
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-xs flex items-center justify-center gap-2">
            <HeartPulse className="w-3 h-3 text-teal-400" />
            © {new Date().getFullYear()} RSUD Dr. HARJONO S. PONOROGO | SICAKEP v1.0
            <HeartPulse className="w-3 h-3 text-teal-400" />
          </p>
          <p className="text-gray-300 text-xs mt-1">
            Sistem Informasi Catatan Kepegawaian
          </p>
        </div>
      </div>
    </div>
  );
}