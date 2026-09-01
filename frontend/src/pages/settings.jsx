// src/pages/SettingsPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Settings, Bell, Lock, Eye, Sun, Moon, Monitor,
  Volume2, Save, X, User, Palette, Type, Globe,
  Shield, Smartphone, Wifi, RefreshCw, CheckCircle,
  AlertCircle, Clock, LogOut, Trash2, Download,
  Languages, Zap, Battery, Sparkles,
  Mail
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function SettingsPage() {
  const { language, changeLanguage, t } = useLanguage();
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
    enableSoundNotification: true,
    enableVibration: true,
    language: language,
    autoUpdate: true,
    batterySaver: false,
    darkModeSchedule: "manual",
    compactView: false,
    animations: true,
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [activeTab, setActiveTab] = useState("tampilan");

  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      theme: theme,
      fontSize: fontSize,
      colorScheme: colorScheme,
      language: language,
    }));
  }, [theme, fontSize, colorScheme, language]);

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

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
    setSettings(prev => ({ ...prev, language: lang }));
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
    setSuccessMessage(t.saved);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const tabs = [
    { id: "tampilan", label: t.tabTampilan, icon: Palette },
    { id: "notifikasi", label: t.tabNotifikasi, icon: Bell },
    { id: "keamanan", label: t.tabKeamanan, icon: Shield },
    { id: "suara", label: t.tabSuara, icon: Volume2 },
    { id: "lanjutan", label: t.tabLanjutan, icon: Zap },
  ];

  const ToggleSwitch = ({ label, value, onChange, description = "", icon: Icon = null }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="w-5 h-5 text-gray-400 dark:text-gray-500" />}
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</p>
          {description && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{description}</p>}
        </div>
      </div>
      <button
        onClick={onChange}
        className={`relative w-11 h-6 rounded-full transition-all duration-300 ${
          value 
            ? "bg-teal-500 dark:bg-teal-400 shadow-lg shadow-teal-200 dark:shadow-teal-900/30" 
            : "bg-gray-300 dark:bg-gray-600"
        } flex items-center flex-shrink-0`}
      >
        <div
          className={`w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${
            value ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );

  const SelectCard = ({ label, value, options, onChange, icon: Icon = null }) => (
    <div className="py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <div className="flex items-center gap-3 mb-2">
        {Icon && <Icon className="w-5 h-5 text-gray-400 dark:text-gray-500" />}
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</p>
      </div>
      <div className="grid grid-cols-3 gap-2 ml-8">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              value === opt.value
                ? "bg-teal-500 text-white shadow-md shadow-teal-200 dark:shadow-teal-900/30"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        <div className="relative flex items-center gap-4">
          <div className="bg-white/10 backdrop-blur p-3 rounded-2xl border border-white/10">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{t.settingsTitle}</h1>
            <p className="text-gray-300 dark:text-gray-400 mt-1 flex items-center gap-2">
              <span>{t.settingsSubtitle}</span>
              <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
              <span className="text-sm">{t.settingsVersion}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-5 py-3.5 text-green-700 dark:text-green-400 flex items-center gap-3 animate-fadeIn">
          <CheckCircle className="w-5 h-5" />
          {successMessage}
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 bg-white dark:bg-gray-800 rounded-xl p-2 shadow-sm border border-gray-100 dark:border-gray-700">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-teal-500 text-white shadow-md shadow-teal-200 dark:shadow-teal-900/30"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6">
          {/* TAB: TAMPILAN */}
          {activeTab === "tampilan" && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-5 h-5 text-teal-500" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{t.tampilanTitle}</h3>
              </div>

              <SelectCard
                label={t.themeLabel}
                value={settings.theme}
                options={[
                  { value: "light", label: t.themeLight },
                  { value: "dark", label: t.themeDark },
                  { value: "auto", label: t.themeAuto }
                ]}
                onChange={(val) => handleSelect("theme", val)}
                icon={Eye}
              />

              <SelectCard
                label={t.fontSizeLabel}
                value={settings.fontSize}
                options={[
                  { value: "small", label: t.fontSizeSmall },
                  { value: "medium", label: t.fontSizeMedium },
                  { value: "large", label: t.fontSizeLarge }
                ]}
                onChange={(val) => handleSelect("fontSize", val)}
                icon={Type}
              />

              <SelectCard
                label={t.colorSchemeLabel}
                value={settings.colorScheme}
                options={[
                  { value: "teal", label: t.colorTeal },
                  { value: "blue", label: t.colorBlue },
                  { value: "purple", label: t.colorPurple }
                ]}
                onChange={(val) => handleSelect("colorScheme", val)}
                icon={Sparkles}
              />

              <ToggleSwitch
                label={t.compactView}
                description={t.compactViewDesc}
                value={settings.compactView}
                onChange={() => handleToggle("compactView")}
                icon={Monitor}
              />

              <ToggleSwitch
                label={t.animations}
                description={t.animationsDesc}
                value={settings.animations}
                onChange={() => handleToggle("animations")}
                icon={Sparkles}
              />
            </div>
          )}

          {/* TAB: NOTIFIKASI */}
          {activeTab === "notifikasi" && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-teal-500" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{t.notifTitle}</h3>
              </div>

              <ToggleSwitch
                label={t.emailNotif}
                description={t.emailNotifDesc}
                value={settings.emailNotifications}
                onChange={() => handleToggle("emailNotifications")}
                icon={Mail}
              />

              <ToggleSwitch
                label={t.pushNotif}
                description={t.pushNotifDesc}
                value={settings.pushNotifications}
                onChange={() => handleToggle("pushNotifications")}
                icon={Globe}
              />

              <ToggleSwitch
                label={t.smsNotif}
                description={t.smsNotifDesc}
                value={settings.smsNotifications}
                onChange={() => handleToggle("smsNotifications")}
                icon={Smartphone}
              />

              <SelectCard
                label={t.frequencyLabel}
                value={settings.notificationFrequency}
                options={[
                  { value: "realtime", label: t.frequencyRealtime },
                  { value: "hourly", label: t.frequencyHourly },
                  { value: "daily", label: t.frequencyDaily },
                ]}
                onChange={(val) => handleSelect("notificationFrequency", val)}
                icon={Clock}
              />
            </div>
          )}

          {/* TAB: KEAMANAN */}
          {activeTab === "keamanan" && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-teal-500" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{t.securityTitle}</h3>
              </div>

              <ToggleSwitch
                label={t.twoFactor}
                description={t.twoFactorDesc}
                value={settings.twoFactorAuth}
                onChange={() => handleToggle("twoFactorAuth")}
                icon={Lock}
              />

              <SelectCard
                label={t.sessionTimeout}
                value={settings.sessionTimeout}
                options={[
                  { value: "15", label: t.session15 },
                  { value: "30", label: t.session30 },
                  { value: "60", label: t.session60 },
                  { value: "0", label: t.sessionNever }
                ]}
                onChange={(val) => handleSelect("sessionTimeout", val)}
                icon={Clock}
              />

              <ToggleSwitch
                label={t.autoLogout}
                description={t.autoLogoutDesc}
                value={settings.autoLogout}
                onChange={() => handleToggle("autoLogout")}
                icon={LogOut}
              />

              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button className="flex items-center gap-2 text-red-500 hover:text-red-600 transition text-sm font-medium">
                  <Trash2 className="w-4 h-4" />
                  {t.deleteData}
                </button>
              </div>
            </div>
          )}

          {/* TAB: SUARA */}
          {activeTab === "suara" && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 mb-4">
                <Volume2 className="w-5 h-5 text-teal-500" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{t.soundTitle}</h3>
              </div>

              <ToggleSwitch
                label={t.soundNotif}
                description={t.soundNotifDesc}
                value={settings.enableSoundNotification}
                onChange={() => handleToggle("enableSoundNotification")}
                icon={Volume2}
              />

              <ToggleSwitch
                label={t.vibration}
                description={t.vibrationDesc}
                value={settings.enableVibration}
                onChange={() => handleToggle("enableVibration")}
                icon={Battery}
              />
            </div>
          )}

          {/* TAB: LANJUTAN */}
          {activeTab === "lanjutan" && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-teal-500" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{t.advancedTitle}</h3>
              </div>

              <SelectCard
                label={t.languageLabel}
                value={language}
                options={[
                  { value: "id", label: t.languageId },
                  { value: "en", label: t.languageEn },
                ]}
                onChange={handleLanguageChange}
                icon={Languages}
              />

              <ToggleSwitch
                label={t.autoUpdate}
                description={t.autoUpdateDesc}
                value={settings.autoUpdate}
                onChange={() => handleToggle("autoUpdate")}
                icon={RefreshCw}
              />

              <ToggleSwitch
                label={t.batterySaver}
                description={t.batterySaverDesc}
                value={settings.batterySaver}
                onChange={() => handleToggle("batterySaver")}
                icon={Battery}
              />

              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button className="flex items-center gap-2 text-teal-600 hover:text-teal-700 transition text-sm font-medium">
                  <Download className="w-4 h-4" />
                  {t.exportSettings}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tombol Aksi */}
      {hasChanges && (
        <div className="flex gap-3 animate-fadeIn">
          <button
            onClick={handleSaveSettings}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-6 py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-teal-200 dark:shadow-teal-900/30"
          >
            <Save className="w-5 h-5" />
            {t.save}
          </button>
          <button
            onClick={() => {
              setSettings(prev => ({
                ...prev,
                theme: theme,
                fontSize: fontSize,
                colorScheme: colorScheme,
              }));
              setHasChanges(false);
            }}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3.5 rounded-xl font-semibold transition"
          >
            <X className="w-5 h-5" />
            {t.cancel}
          </button>
        </div>
      )}

      {/* Footer Info */}
      <div className="bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">{t.tipsTitle}</p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">{t.tipsDesc}</p>
        </div>
      </div>

      {/* CSS Animasi */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}