// src/context/LanguageContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// ============================================
// TRANSLATIONS
// ============================================
export const translations = {
  id: {
    // Dashboard
    welcome: "Selamat Datang,",
    welcomeDesc: "Kelola data pegawai dan dokumen penting RSUD Dr. Harjono S. Ponorogo",
    totalEmployees: "Total pegawai",
    activeEmployees: "Aktif",
    inactiveEmployees: "Cuti",
    totalDocuments: "Total Dokumen",
    completeDocuments: "Berkas lengkap",
    incompleteDocuments: "Belum lengkap",
    documentStats: "Terupload",
    fromLastMonth: "dari bulan lalu",
    avgMissing: "Rata-rata kurang 2 kategori",
    
    // Charts
    chartStatus: "📊 Status Pegawai",
    chartUnit: "🏢 Unit Kerja",
    chartTrend: "📈 Tren Data",
    chartRadar: "🎯 Kelengkapan Kategori",
    
    // Cards
    categoryCompleteness: "Kelengkapan per Kategori",
    clickToOpen: "klik kartu untuk membuka kategori",
    recentEmployees: "Pegawai Terbaru",
    last5: "5 terakhir",
    unitDistribution: "Distribusi Pegawai per Unit",
    employee: "pegawai",
    
    // Upload
    uploadTitle: "Unggah Dokumen Baru",
    uploadDesc: "Klik di sini untuk memilih kategori dan unggah dokumen pegawai",
    uploadButton: "Pilih Kategori",
    
    // Status
    active: "Aktif",
    inactive: "Cuti",
    
    // Tips
    noData: "Belum ada data pegawai",
    noUnit: "Belum ada data unit",

    // Profile
    loadingProfile: "Loading profil...",
    hospitalName: "Rumah Sakit Hardjono",
    editProfile: "Edit Profil",
    selectPhoto: "Pilih Foto Profil",
    chooseFromGallery: "Pilih dari file / galeri",
    orChooseAvatar: "atau pilih avatar default",
    chooseAvatar: "Pilih Avatar",
    personalInfo: "Informasi Pribadi",
    fullName: "Nama Lengkap",
    email: "Email",
    phone: "Nomor Telepon",
    address: "Alamat",
    bio: "Bio / Deskripsi",
    workInfo: "Informasi Pekerjaan",
    department: "Departemen",
    position: "Posisi",
    joinDate: "Tanggal Bergabung",
    save: "Simpan Perubahan",
    cancel: "Batal",

    // Settings - Header
    settingsTitle: "Pengaturan Aplikasi",
    settingsSubtitle: "Sesuaikan pengalaman Anda",
    settingsVersion: "SICAKEP v2.0",
    
    // Settings - Tabs
    tabTampilan: "Tampilan",
    tabNotifikasi: "Notifikasi",
    tabKeamanan: "Keamanan",
    tabSuara: "Suara",
    tabLanjutan: "Lanjutan",
    
    // Settings - Tampilan
    tampilanTitle: "Tampilan & Tema",
    tampilanDesc: "Sesuaikan tampilan aplikasi",
    themeLabel: "Tema",
    themeLight: "☀️ Terang",
    themeDark: "🌙 Gelap",
    themeAuto: "🔄 Otomatis",
    fontSizeLabel: "Ukuran Font",
    fontSizeSmall: "A Kecil",
    fontSizeMedium: "A Sedang",
    fontSizeLarge: "A Besar",
    colorSchemeLabel: "Skema Warna",
    colorTeal: "🟢 Teal",
    colorBlue: "🔵 Biru",
    colorPurple: "🟣 Ungu",
    compactView: "Tampilan Ringkas",
    compactViewDesc: "Kurangi padding dan spacing",
    animations: "Animasi Halus",
    animationsDesc: "Efek transisi dan animasi",
    
    // Settings - Notifikasi
    notifTitle: "Notifikasi",
    notifDesc: "Atur preferensi notifikasi Anda",
    emailNotif: "Notifikasi Email",
    emailNotifDesc: "Terima notifikasi melalui email",
    pushNotif: "Notifikasi Push",
    pushNotifDesc: "Notifikasi real-time di browser",
    smsNotif: "Notifikasi SMS",
    smsNotifDesc: "Dikirim ke nomor telepon terdaftar",
    frequencyLabel: "Frekuensi Notifikasi",
    frequencyRealtime: "🔴 Real-time",
    frequencyHourly: "🕐 Per Jam",
    frequencyDaily: "📅 Harian",
    
    // Settings - Keamanan
    securityTitle: "Keamanan Akun",
    securityDesc: "Atur keamanan akun Anda",
    twoFactor: "Autentikasi Dua Faktor (2FA)",
    twoFactorDesc: "Lapisan keamanan tambahan",
    sessionTimeout: "Session Timeout",
    session15: "15 menit",
    session30: "30 menit",
    session60: "60 menit",
    sessionNever: "∞ Tidak",
    autoLogout: "Auto Logout",
    autoLogoutDesc: "Keluar otomatis setelah tidak aktif",
    deleteData: "Hapus Semua Data",
    
    // Settings - Suara
    soundTitle: "Suara & Getaran",
    soundDesc: "Atur preferensi suara dan getaran",
    soundNotif: "Suara Notifikasi",
    soundNotifDesc: "Putar suara saat notifikasi masuk",
    vibration: "Getaran",
    vibrationDesc: "Aktifkan getaran pada perangkat",
    
    // Settings - Lanjutan
    advancedTitle: "Pengaturan Lanjutan",
    advancedDesc: "Pengaturan tambahan aplikasi",
    languageLabel: "Bahasa",
    languageId: "🇮🇩 Indonesia",
    languageEn: "🇬🇧 English",
    autoUpdate: "Update Otomatis",
    autoUpdateDesc: "Perbarui aplikasi secara otomatis",
    batterySaver: "Mode Hemat Baterai",
    batterySaverDesc: "Kurangi animasi untuk hemat daya",
    exportSettings: "Ekspor Pengaturan",
    
    // Settings - Actions
    saveSettings: "Simpan Perubahan",
    cancelSettings: "Batal",
    saved: "✅ Pengaturan berhasil disimpan!",
    
    // Settings - Tips
    tipsTitle: "💡 Tips Pengaturan",
    tipsDesc: "Perubahan tema dan warna akan langsung diterapkan ke seluruh halaman. Pengaturan lain akan aktif setelah disimpan.",
  },
  en: {
    // Dashboard
    welcome: "Welcome back,",
    welcomeDesc: "Manage employee data and important documents of RSUD Dr. Harjono S. Ponorogo",
    totalEmployees: "Total Employees",
    activeEmployees: "Active",
    inactiveEmployees: "Inactive",
    totalDocuments: "Total Documents",
    completeDocuments: "Complete Files",
    incompleteDocuments: "Incomplete",
    documentStats: "Uploaded",
    fromLastMonth: "from last month",
    avgMissing: "Average 2 categories missing",
    
    // Charts
    chartStatus: "📊 Employee Status",
    chartUnit: "🏢 Work Unit",
    chartTrend: "📈 Data Trend",
    chartRadar: "🎯 Category Completeness",
    
    // Cards
    categoryCompleteness: "Category Completeness",
    clickToOpen: "click card to open category",
    recentEmployees: "Recent Employees",
    last5: "last 5",
    unitDistribution: "Employee Distribution by Unit",
    employee: "employee",
    
    // Upload
    uploadTitle: "Upload New Document",
    uploadDesc: "Click here to select category and upload employee document",
    uploadButton: "Select Category",
    
    // Status
    active: "Active",
    inactive: "Inactive",
    
    // Tips
    noData: "No employee data available",
    noUnit: "No unit data available",

    // Profile
    loadingProfile: "Loading profile...",
    hospitalName: "Hardjono Hospital",
    editProfile: "Edit Profile",
    selectPhoto: "Select Profile Photo",
    chooseFromGallery: "Choose from file / gallery",
    orChooseAvatar: "or choose default avatar",
    chooseAvatar: "Choose Avatar",
    personalInfo: "Personal Information",
    fullName: "Full Name",
    email: "Email",
    phone: "Phone Number",
    address: "Address",
    bio: "Bio / Description",
    workInfo: "Work Information",
    department: "Department",
    position: "Position",
    joinDate: "Join Date",
    save: "Save Changes",
    cancel: "Cancel",

    // Settings - Header
    settingsTitle: "Application Settings",
    settingsSubtitle: "Customize your experience",
    settingsVersion: "SICAKEP v2.0",
    
    // Settings - Tabs
    tabTampilan: "🎨 Appearance",
    tabNotifikasi: "🔔 Notifications",
    tabKeamanan: "🔒 Security",
    tabSuara: "🔊 Sound",
    tabLanjutan: "⚡ Advanced",
    
    // Settings - Tampilan
    tampilanTitle: "Appearance & Theme",
    tampilanDesc: "Customize the app appearance",
    themeLabel: "Theme",
    themeLight: "☀️ Light",
    themeDark: "🌙 Dark",
    themeAuto: "🔄 Auto",
    fontSizeLabel: "Font Size",
    fontSizeSmall: "A Small",
    fontSizeMedium: "A Medium",
    fontSizeLarge: "A Large",
    colorSchemeLabel: "Color Scheme",
    colorTeal: "🟢 Teal",
    colorBlue: "🔵 Blue",
    colorPurple: "🟣 Purple",
    compactView: "Compact View",
    compactViewDesc: "Reduce padding and spacing",
    animations: "Smooth Animations",
    animationsDesc: "Transition and animation effects",
    
    // Settings - Notifikasi
    notifTitle: "Notifications",
    notifDesc: "Manage your notification preferences",
    emailNotif: "Email Notifications",
    emailNotifDesc: "Receive notifications via email",
    pushNotif: "Push Notifications",
    pushNotifDesc: "Real-time browser notifications",
    smsNotif: "SMS Notifications",
    smsNotifDesc: "Sent to registered phone number",
    frequencyLabel: "Notification Frequency",
    frequencyRealtime: "🔴 Realtime",
    frequencyHourly: "🕐 Hourly",
    frequencyDaily: "📅 Daily",
    
    // Settings - Keamanan
    securityTitle: "Account Security",
    securityDesc: "Manage your account security",
    twoFactor: "Two-Factor Authentication (2FA)",
    twoFactorDesc: "Additional security layer",
    sessionTimeout: "Session Timeout",
    session15: "15 minutes",
    session30: "30 minutes",
    session60: "60 minutes",
    sessionNever: "∞ Never",
    autoLogout: "Auto Logout",
    autoLogoutDesc: "Logout automatically when inactive",
    deleteData: "Delete All Data",
    
    // Settings - Suara
    soundTitle: "Sound & Vibration",
    soundDesc: "Manage sound and vibration preferences",
    soundNotif: "Notification Sound",
    soundNotifDesc: "Play sound when notification arrives",
    vibration: "Vibration",
    vibrationDesc: "Enable device vibration",
    
    // Settings - Lanjutan
    advancedTitle: "Advanced Settings",
    advancedDesc: "Additional application settings",
    languageLabel: "Language",
    languageId: "🇮🇩 Indonesian",
    languageEn: "🇬🇧 English",
    autoUpdate: "Auto Update",
    autoUpdateDesc: "Update application automatically",
    batterySaver: "Battery Saver Mode",
    batterySaverDesc: "Reduce animations to save battery",
    exportSettings: "Export Settings",
    
    // Settings - Actions
    saveSettings: "Save Changes",
    cancelSettings: "Cancel",
    saved: "✅ Settings saved successfully!",
    
    // Settings - Tips
    tipsTitle: "💡 Settings Tips",
    tipsDesc: "Theme and color changes will be applied to all pages immediately. Other settings will take effect after saving.",
  }
};

// ============================================
// LANGUAGE CONTEXT
// ============================================
const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('id');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'id';
    setLanguage(savedLang);
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = translations[language] || translations.id;

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};