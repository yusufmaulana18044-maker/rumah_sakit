import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Building, Badge, Calendar, Edit2, Save, X, Camera } from "lucide-react";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "Nama Pengguna",
    email: "user@example.com",
    phone: "+62 812-3456-7890",
    department: "Bagian Administrasi",
    position: "Admin",
    joinDate: "2024-01-15",
    bio: "Selamat datang di profil saya",
    address: "Jl. Rumah Sakit No. 123",
    avatar: "👤"
  });

  const [editData, setEditData] = useState(profileData);
  const [avatar, setAvatar] = useState("👤");

  useEffect(() => {
    // Load data dari localStorage jika ada
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsed = JSON.parse(userData);
      setProfileData(prev => ({
        ...prev,
        fullName: parsed.username || "Nama Pengguna",
        email: parsed.email || "user@example.com",
        position: localStorage.getItem("role") || "User"
      }));
      setEditData(prev => ({
        ...prev,
        fullName: parsed.username || "Nama Pengguna",
        email: parsed.email || "user@example.com",
        position: localStorage.getItem("role") || "User"
      }));
    }
  }, []);

  const handleEditToggle = () => {
    if (isEditing) {
      setEditData(profileData);
    }
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = () => {
    setProfileData(editData);
    setIsEditing(false);
    alert("Profil berhasil diperbarui!");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const avatarOptions = ["👤", "👨‍⚕️", "👩‍⚕️", "👨‍💼", "👩‍💼", "🧑‍💻", "👨‍🔬", "👩‍🔬"];

  return (
    <Layout title="Profil Saya">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg shadow-lg p-8 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-5xl shadow-lg">
                  {profileData.avatar}
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-white text-teal-600 p-2 rounded-full shadow-lg hover:bg-gray-100 transition">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{profileData.fullName}</h1>
                <p className="text-teal-100 text-lg">{profileData.position}</p>
                <p className="text-teal-100 text-sm mt-1">Rumah Sakit Hardjono</p>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={handleEditToggle}
                className="flex items-center gap-2 bg-white text-teal-600 px-4 py-2 rounded-lg font-semibold hover:bg-teal-50 transition"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profil
              </button>
            )}
          </div>
        </div>

        {/* Avatar Selection (only show when editing) */}
        {isEditing && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Pilih Avatar</h3>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
              {avatarOptions.map((ava) => (
                <button
                  key={ava}
                  onClick={() => setEditData(prev => ({ ...prev, avatar: ava }))}
                  className={`w-16 h-16 text-3xl rounded-lg border-2 transition ${
                    editData.avatar === ava
                      ? "border-teal-500 bg-teal-50"
                      : "border-gray-200 hover:border-teal-300 bg-gray-50"
                  }`}
                >
                  {ava}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Informasi Pribadi */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5" />
              Informasi Pribadi
            </h2>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Nama Lengkap */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="fullName"
                    value={editData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none transition"
                  />
                ) : (
                  <p className="text-gray-800 px-4 py-2 bg-gray-50 rounded-lg">{profileData.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-teal-600" />
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none transition"
                  />
                ) : (
                  <p className="text-gray-800 px-4 py-2 bg-gray-50 rounded-lg">{profileData.email}</p>
                )}
              </div>

              {/* Telepon */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-teal-600" />
                  Nomor Telepon
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="phone"
                    value={editData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none transition"
                  />
                ) : (
                  <p className="text-gray-800 px-4 py-2 bg-gray-50 rounded-lg">{profileData.phone}</p>
                )}
              </div>

              {/* Alamat */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-teal-600" />
                  Alamat
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={editData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none transition"
                  />
                ) : (
                  <p className="text-gray-800 px-4 py-2 bg-gray-50 rounded-lg">{profileData.address}</p>
                )}
              </div>
            </div>

            {/* Bio / Deskripsi */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Bio / Deskripsi</label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={editData.bio}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none transition resize-none"
                  rows="3"
                />
              ) : (
                <p className="text-gray-800 px-4 py-2 bg-gray-50 rounded-lg">{profileData.bio}</p>
              )}
            </div>
          </div>
        </div>

        {/* Informasi Pekerjaan */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Building className="w-5 h-5" />
              Informasi Pekerjaan
            </h2>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Departemen */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Building className="w-4 h-4 text-blue-600" />
                  Departemen
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="department"
                    value={editData.department}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
                  />
                ) : (
                  <p className="text-gray-800 px-4 py-2 bg-gray-50 rounded-lg">{profileData.department}</p>
                )}
              </div>

              {/* Posisi */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Badge className="w-4 h-4 text-blue-600" />
                  Posisi
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="position"
                    value={editData.position}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
                    disabled
                  />
                ) : (
                  <p className="text-gray-800 px-4 py-2 bg-gray-50 rounded-lg">{profileData.position}</p>
                )}
              </div>

              {/* Tanggal Bergabung */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Tanggal Bergabung
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    name="joinDate"
                    value={editData.joinDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
                  />
                ) : (
                  <p className="text-gray-800 px-4 py-2 bg-gray-50 rounded-lg">
                    {new Date(profileData.joinDate).toLocaleDateString('id-ID')}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tombol Aksi */}
        {isEditing && (
          <div className="flex gap-3">
            <button
              onClick={handleSaveProfile}
              className="flex-1 flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg"
            >
              <Save className="w-5 h-5" />
              Simpan Perubahan
            </button>
            <button
              onClick={handleEditToggle}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-lg font-semibold transition"
            >
              <X className="w-5 h-5" />
              Batal
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}