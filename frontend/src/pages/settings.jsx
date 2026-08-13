// src/pages/SettingsPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Settings, Bell, Lock, Eye, Sun, Moon, Monitor,
  Volume2, Save, X
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function SettingsPage() {
  const {
    theme,
    fontSize,
    colorScheme,
    applyTheme,
    applyFontSize,
    applyColorScheme,
    updateAllSettings
  } = useTheme();

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    notificationFrequency: "realtime",
    twoFactorAuth: false,
    sessionTimeout: "30",
    autoLogout: true,
    theme: theme,
    fontSize: fontSize,
    colorScheme: colorScheme,
    profileVisibility: "public",
    showActivityStatus: true,
    allowDataSharing: false,
    enableSoundNotification: true,
    enableVibration: true,
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      theme: theme,
      fontSize: fontSize,
      colorScheme: colorScheme,
    }));
  }, [theme, fontSize, colorScheme]);

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

    if (key === "theme") {
      applyTheme(value);
    }
    if (key === "fontSize") {
      applyFontSize(value);
    }
    if (key === "colorScheme") {
      applyColorScheme(value);
    }

    setHasChanges(true);
  };

  const handleSaveSettings = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings));

    updateAllSettings({
      theme: settings.theme,
      fontSize: settings.fontSize,
      colorScheme: settings.colorScheme,
    });

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
        className={`w-12 h-6 rounded-full transition-colors ${value ? "bg-teal-600" : "bg-gray-300"
          } flex items-center`}
      >
        <div
          className={`w-5 h-5 rounded-full bg-white transition-transform ${value ? "translate-x-6" : "translate-x-0.5"
            }`}
        />
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header - Dengan style yang bikin teks keliatan di semua tema */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg shadow-lg p-8">
        <div className="flex items-center gap-4">
          <div className="bg-white bg-opacity-20 p-3 rounded-lg">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">
              Pengaturan Aplikasi
            </h1>
            <p className="text-white/90 mt-1">
              Kelola preferensi dan pengaturan Anda
            </p>
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
              <button
                onClick={() => handleSelect("theme", "light")}
                className={`p-3 rounded-lg border-2 transition flex items-center justify-center gap-2 ${settings.theme === "light"
                    ? "border-teal-600 bg-teal-50"
                    : "border-gray-300 hover:border-teal-300"
                  }`}
              >
                <Sun className="w-4 h-4" />
                <span className="capitalize text-sm font-medium">Terang</span>
              </button>
              <button
                onClick={() => handleSelect("theme", "dark")}
                className={`p-3 rounded-lg border-2 transition flex items-center justify-center gap-2 ${settings.theme === "dark"
                    ? "border-teal-600 bg-teal-50"
                    : "border-gray-300 hover:border-teal-300"
                  }`}
              >
                <Moon className="w-4 h-4" />
                <span className="capitalize text-sm font-medium">Gelap</span>
              </button>
              <button
                onClick={() => handleSelect("theme", "auto")}
                className={`p-3 rounded-lg border-2 transition flex items-center justify-center gap-2 ${settings.theme === "auto"
                    ? "border-teal-600 bg-teal-50"
                    : "border-gray-300 hover:border-teal-300"
                  }`}
              >
                <Monitor className="w-4 h-4" />
                <span className="capitalize text-sm font-medium">Otomatis</span>
              </button>
            </div>
          </div>

          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Ukuran Font</label>
            <div className="grid grid-cols-3 gap-3">
              {["small", "medium", "large"].map(size => (
                <button
                  key={size}
                  onClick={() => handleSelect("fontSize", size)}
                  className={`p-3 rounded-lg border-2 transition text-center ${settings.fontSize === size
                      ? "border-teal-600 bg-teal-50"
                      : "border-gray-300 hover:border-teal-300"
                    }`}
                >
                  <span className={`font-medium ${size === "small" ? "text-xs" : size === "medium" ? "text-sm" : "text-base"
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
                  className={`p-3 rounded-lg border-2 transition flex items-center justify-center ${settings.colorScheme === color
                      ? "border-gray-800"
                      : "border-gray-300 hover:border-gray-500"
                    }`}
                >
                  <div className={`w-8 h-8 rounded-full ${color === "teal" ? "bg-teal-500" :
                      color === "blue" ? "bg-blue-500" :
                        "bg-purple-500"
                    }`} />
                </button>
              ))}
            </div>
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
          <strong>💡 Tips:</strong> Pengaturan tema akan langsung diterapkan ke seluruh halaman aplikasi.
        </p>
      </div>
    </div>
  );
}