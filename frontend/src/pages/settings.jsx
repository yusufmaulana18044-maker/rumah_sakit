import { useState } from "react";
import { Settings, Bell, Lock, Eye, Sun, Moon, Monitor, Volume2, Save, X } from "lucide-react";
import Layout from "./layout";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // Notifikasi
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    notificationFrequency: "realtime",
    
    // Keamanan
    twoFactorAuth: false,
    sessionTimeout: "30",
    autoLogout: true,
    
    // Tampilan
    theme: "light",
    fontSize: "medium",
    colorScheme: "teal",
    
    // Privasi
    profileVisibility: "public",
    showActivityStatus: true,
    allowDataSharing: false,
    
    // Suara & Audio
    enableSoundNotification: true,
    enableVibration: true,
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    setHasChanges(true);
  };

  const handleSelect = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleSaveSettings = () => {
    localStorage.setItem("appSettings", JSON.stringify(settings));
    setHasChanges(false);
    setSuccessMessage("Pengaturan berhasil disimpan!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const SettingCard = ({ title, description, children, icon: Icon }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-teal-500">
      <div className="flex items-start gap-4">
        <div className="bg-teal-100 p-3 rounded-lg">
          <Icon className="w-6 h-6 text-teal-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
          <div className="mt-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );

  const ToggleSwitch = ({ label, value, onChange, description = "" }) => (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
      </div>
      <button
        onClick={onChange}
        className={`w-12 h-6 rounded-full transition-colors ${
          value ? "bg-teal-600" : "bg-gray-300"
        } flex items-center`}
      >
        <div
          className={`w-5 h-5 rounded-full bg-white transition-transform ${
            value ? "translate-x-6" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );

  return (
    <Layout title="Pengaturan">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg shadow-lg p-8 text-white">
          <div className="flex items-center gap-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <Settings className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Pengaturan Aplikasi</h1>
              <p className="text-teal-100 mt-1">Kelola preferensi dan pengaturan Anda</p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-300 text-green-700 px-6 py-4 rounded-lg flex items-center gap-2">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            {successMessage}
          </div>
        )}

        {/* Pengaturan Notifikasi */}
        <SettingCard
          icon={Bell}
          title="Notifikasi"
          description="Atur preferensi notifikasi Anda"
        >
          <div className="space-y-4">
            <ToggleSwitch
              label="Email Notifikasi"
              value={settings.emailNotifications}
              onChange={() => handleToggle("emailNotifications")}
              description="Terima notifikasi melalui email"
            />
            <div className="border-t pt-4">
              <ToggleSwitch
                label="Push Notifikasi"
                value={settings.pushNotifications}
                onChange={() => handleToggle("pushNotifications")}
                description="Terima pemberitahuan browser"
              />
            </div>
            <div className="border-t pt-4">
              <ToggleSwitch
                label="SMS Notifikasi"
                value={settings.smsNotifications}
                onChange={() => handleToggle("smsNotifications")}
                description="Terima notifikasi via SMS"
              />
            </div>
            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frekuensi Notifikasi
              </label>
              <select
                value={settings.notificationFrequency}
                onChange={(e) => handleSelect("notificationFrequency", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none"
              >
                <option value="realtime">Real-time</option>
                <option value="hourly">Setiap Jam</option>
                <option value="daily">Harian</option>
                <option value="weekly">Mingguan</option>
              </select>
            </div>
          </div>
        </SettingCard>

        {/* Pengaturan Keamanan */}
        <SettingCard
          icon={Lock}
          title="Keamanan & Privasi"
          description="Kelola keamanan akun Anda"
        >
          <div className="space-y-4">
            <ToggleSwitch
              label="Verifikasi Dua Faktor (2FA)"
              value={settings.twoFactorAuth}
              onChange={() => handleToggle("twoFactorAuth")}
              description="Tambah lapisan keamanan ekstra untuk akun Anda"
            />
            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timeout Sesi (menit)
              </label>
              <input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => handleSelect("sessionTimeout", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none"
                min="5"
                max="120"
              />
              <p className="text-xs text-gray-500 mt-2">Waktu tunggu sebelum logout otomatis</p>
            </div>
            <div className="border-t pt-4">
              <ToggleSwitch
                label="Auto Logout"
                value={settings.autoLogout}
                onChange={() => handleToggle("autoLogout")}
                description="Logout otomatis jika tidak ada aktivitas"
              />
            </div>
          </div>
        </SettingCard>

        {/* Pengaturan Tampilan */}
        <SettingCard
          icon={Eye}
          title="Tampilan & Tema"
          description="Sesuaikan tampilan aplikasi"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tema</label>
              <div className="grid grid-cols-3 gap-3">
                {["light", "dark", "auto"].map(theme => (
                  <button
                    key={theme}
                    onClick={() => handleSelect("theme", theme)}
                    className={`p-3 rounded-lg border-2 transition flex items-center justify-center gap-2 ${
                      settings.theme === theme
                        ? "border-teal-600 bg-teal-50"
                        : "border-gray-300 hover:border-teal-300"
                    }`}
                  >
                    {theme === "light" && <Sun className="w-4 h-4" />}
                    {theme === "dark" && <Moon className="w-4 h-4" />}
                    {theme === "auto" && <Monitor className="w-4 h-4" />}
                    <span className="capitalize text-sm font-medium">{theme === "auto" ? "Otomatis" : theme === "light" ? "Terang" : "Gelap"}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Ukuran Font</label>
              <div className="grid grid-cols-3 gap-3">
                {["small", "medium", "large"].map(size => (
                  <button
                    key={size}
                    onClick={() => handleSelect("fontSize", size)}
                    className={`p-3 rounded-lg border-2 transition text-center ${
                      settings.fontSize === size
                        ? "border-teal-600 bg-teal-50"
                        : "border-gray-300 hover:border-teal-300"
                    }`}
                  >
                    <span className={`font-medium ${
                      size === "small" ? "text-xs" : size === "medium" ? "text-sm" : "text-base"
                    }`}>
                      {size === "small" ? "Kecil" : size === "medium" ? "Sedang" : "Besar"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Skema Warna</label>
              <div className="grid grid-cols-3 gap-3">
                {["teal", "blue", "purple"].map(color => (
                  <button
                    key={color}
                    onClick={() => handleSelect("colorScheme", color)}
                    className={`p-3 rounded-lg border-2 transition flex items-center justify-center ${
                      settings.colorScheme === color
                        ? "border-gray-800"
                        : "border-gray-300 hover:border-gray-500"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full ${
                      color === "teal" ? "bg-teal-500" : color === "blue" ? "bg-blue-500" : "bg-purple-500"
                    }`} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </SettingCard>

        {/* Pengaturan Suara */}
        <SettingCard
          icon={Volume2}
          title="Suara & Audio"
          description="Atur pengaturan audio aplikasi"
        >
          <div className="space-y-4">
            <ToggleSwitch
              label="Notifikasi Suara"
              value={settings.enableSoundNotification}
              onChange={() => handleToggle("enableSoundNotification")}
              description="Bunyikan suara saat ada notifikasi"
            />
            <div className="border-t pt-4">
              <ToggleSwitch
                label="Getaran"
                value={settings.enableVibration}
                onChange={() => handleToggle("enableVibration")}
                description="Aktifkan getaran pada perangkat yang mendukung"
              />
            </div>
          </div>
        </SettingCard>

        {/* Pengaturan Privasi */}
        <SettingCard
          icon={Eye}
          title="Privasi"
          description="Kontrol privasi dan visibilitas profil Anda"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Visibilitas Profil</label>
              <select
                value={settings.profileVisibility}
                onChange={(e) => handleSelect("profileVisibility", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none"
              >
                <option value="public">Publik</option>
                <option value="private">Pribadi</option>
                <option value="friends">Teman Saja</option>
              </select>
            </div>
            <div className="border-t pt-4">
              <ToggleSwitch
                label="Tampilkan Status Aktivitas"
                value={settings.showActivityStatus}
                onChange={() => handleToggle("showActivityStatus")}
                description="Biarkan orang lain melihat kapan Anda online"
              />
            </div>
            <div className="border-t pt-4">
              <ToggleSwitch
                label="Izinkan Berbagi Data"
                value={settings.allowDataSharing}
                onChange={() => handleToggle("allowDataSharing")}
                description="Bantu kami meningkatkan aplikasi dengan berbagi data penggunaan anonim"
              />
            </div>
          </div>
        </SettingCard>

        {/* Tombol Aksi */}
        {hasChanges && (
          <div className="flex gap-3">
            <button
              onClick={handleSaveSettings}
              className="flex-1 flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg"
            >
              <Save className="w-5 h-5" />
              Simpan Perubahan
            </button>
            <button
              onClick={() => {
                window.location.reload();
              }}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-lg font-semibold transition"
            >
              <X className="w-5 h-5" />
              Batal
            </button>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>💡 Tips:</strong> Pengaturan Anda akan disimpan di perangkat ini. Perubahan akan diterapkan saat halaman dimuat ulang.
          </p>
        </div>
      </div>
    </Layout>
  );
}
