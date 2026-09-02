// src/pages/Profile.jsx
import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Building, Badge, Calendar, Edit2, Save, X, Camera } from "lucide-react";
import { supabase } from "../supabase";
import Breadcrumb from "../components/Breadcrumb";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    joinDate: "",
    bio: "",
    address: "",
    avatar: "👤"
  });

  const [editData, setEditData] = useState(profileData);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      // Ambil user dari Supabase Auth
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      setUserId(user.id);

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)  // ✅ PAKAI user_id (sesuai tabel)
          .single();

        if (error && error.code !== 'PGRST116') throw error;

        if (data) {
          const profile = {
            fullName: data.full_name || "",
            email: data.email || user.email || "",
            phone: data.phone || "",
            department: data.department || "",
            position: data.role || "Pegawai",
            joinDate: data.join_date || "",
            bio: data.bio || "",
            address: data.address || "",
            avatar: data.avatar || "👤"
          };
          setProfileData(profile);
          setEditData(profile);
        } else {
          // Fallback jika data tidak ada
          const fallbackProfile = {
            fullName: user.user_metadata?.full_name || "",
            email: user.email || "",
            phone: "",
            department: "",
            position: user.user_metadata?.role || "Pegawai",
            joinDate: "",
            bio: "",
            address: "",
            avatar: "👤"
          };
          setProfileData(fallbackProfile);
          setEditData(fallbackProfile);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEditToggle = () => {
    if (isEditing) {
      setEditData(profileData);
    }
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = async () => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: editData.fullName,
          email: editData.email,
          phone: editData.phone,
          department: editData.department,
          role: editData.position,
          join_date: editData.joinDate === "" ? null : editData.joinDate,
          bio: editData.bio,
          address: editData.address,
          avatar: editData.avatar
        })
        .eq("user_id", userId);  // ✅ PAKAI user_id (sesuai tabel)

      if (error) throw error;

      setProfileData(editData);
      setIsEditing(false);
      alert("✅ Profil berhasil diperbarui!");

    } catch (error) {
      console.error("Save error:", error);
      alert("❌ Gagal menyimpan profil: " + error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Pilih file gambar yang valid.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const maxSize = 512;
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);

        const imageData = canvas.toDataURL("image/jpeg", 0.85);
        setEditData(prev => ({ ...prev, avatar: imageData }));
      };
      image.src = reader.result;
    };
    reader.onerror = () => alert("Foto tidak dapat dibaca. Silakan pilih foto lain.");
    reader.readAsDataURL(file);
    event.target.value = "";
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
    return <span>{avatarValue || "👤"}</span>;
  };

  const avatarOptions = ["👤", "👨‍⚕️", "👩‍⚕️", "👨‍💼", "👩‍💼", "🧑‍💻", "👨‍🔬", "👩‍🔬"];

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 p-4">
        <div className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 rounded-2xl shadow-xl p-8 h-32 animate-pulse"></div>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-4 h-14 animate-pulse"></div>
          <div className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i}>
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
            <div>
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      <Breadcrumb />
      
      {/* HEADER CARD */}
      <div className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative flex items-start justify-between">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-white/10 backdrop-blur border border-white/10 rounded-full flex items-center justify-center text-5xl shadow-lg overflow-hidden">
                {renderAvatar(isEditing ? editData.avatar : profileData.avatar)}
              </div>
              {isEditing && (
                <label
                  htmlFor="profile-image-upload"
                  className="absolute bottom-0 right-0 bg-white text-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-100 transition cursor-pointer"
                  title="Pilih foto profil"
                >
                  <Camera className="w-4 h-4" />
                  <input
                    id="profile-image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </label>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{profileData.fullName}</h1>
              <p className="text-gray-300 text-lg">{profileData.position}</p>
              <p className="text-gray-400 text-sm mt-1">Rumah Sakit Hardjono</p>
            </div>
          </div>
          
          {!isEditing && (
            <button
              onClick={handleEditToggle}
              className="flex items-center gap-2 bg-white text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profil
            </button>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="bg-white rounded-lg shadow p-6 space-y-5">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Pilih Foto Profil</h3>
            <div className="flex flex-wrap items-center gap-3">
              <label
                htmlFor="profile-image-upload-2"
                className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium cursor-pointer transition"
              >
                <Camera className="w-4 h-4" />
                Pilih dari file / galeri
                <input
                  id="profile-image-upload-2"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </label>
              <span className="text-sm text-gray-500">atau pilih avatar default</span>
            </div>
          </div>

          <div>
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
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5" />
            Informasi Pribadi
          </h2>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
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

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
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

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
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

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
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

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2">Bio / Deskripsi</label>
            {isEditing ? (
              <textarea
                name="bio"
                value={editData.bio}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none transition resize-none"
                rows="3"
                placeholder="Tuliskan deskripsi singkat tentang Anda..."
              />
            ) : (
              <p className="text-gray-800 px-4 py-2 bg-gray-50 rounded-lg">{profileData.bio || "Belum ada deskripsi"}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Building className="w-5 h-5" />
            Informasi Pekerjaan
          </h2>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
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
                <p className="text-gray-800 px-4 py-2 bg-gray-50 rounded-lg">{profileData.department || "-"}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
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

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
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
                  {profileData.joinDate ? new Date(profileData.joinDate).toLocaleDateString('id-ID') : "-"}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="flex flex-col sm:flex-row gap-3">
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
  );
}