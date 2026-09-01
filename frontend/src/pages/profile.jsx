import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Building, Badge, Calendar, Edit2, Save, X, Camera } from "lucide-react";
import { supabase } from "../supabase";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

export default function Profile() {
  const { theme } = useTheme();
  const { t } = useLanguage(); // ✅ Ambil dari context
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

  // Ambil data dari Supabase
  useEffect(() => {
    const fetchProfile = async () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const username = localStorage.getItem("username") || "";
      
      if (!user.id) {
        setLoading(false);
        return;
      }

      setUserId(user.id);

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error) {
          const savedProfile = localStorage.getItem("profileData");
          if (savedProfile) {
            const parsedProfile = JSON.parse(savedProfile);
            setProfileData(prev => ({ ...prev, ...parsedProfile }));
            setEditData(prev => ({ ...prev, ...parsedProfile }));
          }
          setLoading(false);
          return;
        }

        if (data) {
          const profile = {
            fullName: data.full_name || username,
            email: data.email || user.email || "",
            phone: data.phone || "",
            department: data.department || "",
            position: data.role || "User",
            joinDate: data.join_date || "",
            bio: data.bio || "",
            address: data.address || "",
            avatar: data.avatar || "👤"
          };
          setProfileData(profile);
          setEditData(profile);
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
          join_date: editData.joinDate,
          bio: editData.bio,
          address: editData.address,
          avatar: editData.avatar
        })
        .eq("user_id", userId);

      if (error) throw error;

      setProfileData(editData);
      setIsEditing(false);
      
      localStorage.setItem("username", editData.fullName);
      localStorage.setItem("role", editData.position);
      localStorage.setItem("profileData", JSON.stringify(editData));

      alert("✅ Profil berhasil diperbarui!");

    } catch (error) {
      console.error("Save error:", error);
      localStorage.setItem("profileData", JSON.stringify(editData));
      setProfileData(editData);
      setIsEditing(false);
      alert("✅ Profil berhasil diperbarui (disimpan lokal)!");
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
      <div className="p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">{t.loadingProfile || "Loading profil..."}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* HEADER CARD */}
      <div className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 rounded-lg shadow-lg p-8 text-white">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-white dark:bg-gray-600 rounded-full flex items-center justify-center text-5xl shadow-lg overflow-hidden">
                {renderAvatar(isEditing ? editData.avatar : profileData.avatar)}
              </div>
              {isEditing && (
                <label
                  htmlFor="profile-image-upload"
                  className="absolute bottom-0 right-0 bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 p-2 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition cursor-pointer"
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
              <p className="text-gray-300 dark:text-gray-400 text-lg">{profileData.position}</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">{t.hospitalName || "Rumah Sakit Hardjono"}</p>
            </div>
          </div>
          {!isEditing && (
            <button
              onClick={handleEditToggle}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-semibold transition backdrop-blur-sm border border-white/20"
            >
              <Edit2 className="w-4 h-4" />
              {t.editProfile || "Edit Profil"}
            </button>
          )}
        </div>
      </div>

      {/* Avatar Selection */}
      {isEditing && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-5">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{t.selectPhoto || "Pilih Foto Profil"}</h3>
            <div className="flex flex-wrap items-center gap-3">
              <label
                htmlFor="profile-image-upload-2"
                className="inline-flex items-center gap-2 bg-teal-600 dark:bg-teal-700 hover:bg-teal-700 dark:hover:bg-teal-800 text-white px-4 py-2 rounded-lg font-medium cursor-pointer transition"
              >
                <Camera className="w-4 h-4" />
                {t.chooseFromGallery || "Pilih dari file / galeri"}
                <input
                  id="profile-image-upload-2"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </label>
              <span className="text-sm text-gray-500 dark:text-gray-400">{t.orChooseAvatar || "atau pilih avatar default"}</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">{t.chooseAvatar || "Pilih Avatar"}</h3>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
              {avatarOptions.map((ava) => (
                <button
                  key={ava}
                  onClick={() => setEditData(prev => ({ ...prev, avatar: ava }))}
                  className={`w-16 h-16 text-3xl rounded-lg border-2 transition ${
                    editData.avatar === ava
                      ? "border-teal-500 dark:border-teal-400 bg-teal-50 dark:bg-teal-900/30"
                      : "border-gray-200 dark:border-gray-600 hover:border-teal-300 dark:hover:border-teal-500 bg-gray-50 dark:bg-gray-700"
                  }`}
                >
                  {ava}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Informasi Pribadi */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 dark:from-teal-700 dark:to-teal-800 px-6 py-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5" />
            {t.personalInfo || "Informasi Pribadi"}
          </h2>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Nama Lengkap */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t.fullName || "Nama Lengkap"}</label>
              {isEditing ? (
                <input
                  type="text"
                  name="fullName"
                  value={editData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none transition bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                />
              ) : (
                <p className="text-gray-800 dark:text-gray-200 px-4 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">{profileData.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                {t.email || "Email"}
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none transition bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                />
              ) : (
                <p className="text-gray-800 dark:text-gray-200 px-4 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">{profileData.email}</p>
              )}
            </div>

            {/* Telepon */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                {t.phone || "Nomor Telepon"}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={editData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none transition bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                />
              ) : (
                <p className="text-gray-800 dark:text-gray-200 px-4 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">{profileData.phone}</p>
              )}
            </div>

            {/* Alamat */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                {t.address || "Alamat"}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={editData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none transition bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                />
              ) : (
                <p className="text-gray-800 dark:text-gray-200 px-4 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">{profileData.address}</p>
              )}
            </div>
          </div>

          {/* Bio / Deskripsi */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t.bio || "Bio / Deskripsi"}</label>
            {isEditing ? (
              <textarea
                name="bio"
                value={editData.bio}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none transition resize-none bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                rows="3"
              />
            ) : (
              <p className="text-gray-800 dark:text-gray-200 px-4 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">{profileData.bio}</p>
            )}
          </div>
        </div>
      </div>

      {/* Informasi Pekerjaan */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800 px-6 py-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Building className="w-5 h-5" />
            {t.workInfo || "Informasi Pekerjaan"}
          </h2>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Departemen */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                {t.department || "Departemen"}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="department"
                  value={editData.department}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                />
              ) : (
                <p className="text-gray-800 dark:text-gray-200 px-4 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">{profileData.department}</p>
              )}
            </div>

            {/* Posisi */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Badge className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                {t.position || "Posisi"}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="position"
                  value={editData.position}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  disabled
                />
              ) : (
                <p className="text-gray-800 dark:text-gray-200 px-4 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">{profileData.position}</p>
              )}
            </div>

            {/* Tanggal Bergabung */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                {t.joinDate || "Tanggal Bergabung"}
              </label>
              {isEditing ? (
                <input
                  type="date"
                  name="joinDate"
                  value={editData.joinDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                />
              ) : (
                <p className="text-gray-800 dark:text-gray-200 px-4 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  {profileData.joinDate ? new Date(profileData.joinDate).toLocaleDateString('id-ID') : "-"}
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
            className="flex-1 flex items-center justify-center gap-2 bg-teal-600 dark:bg-teal-700 hover:bg-teal-700 dark:hover:bg-teal-800 text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg"
          >
            <Save className="w-5 h-5" />
            {t.save || "Simpan Perubahan"}
          </button>
          <button
            onClick={handleEditToggle}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            <X className="w-5 h-5" />
            {t.cancel || "Batal"}
          </button>
        </div>
      )}
    </div>
  );
}