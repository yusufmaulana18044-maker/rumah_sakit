// src/config/dokumenConfig.js

export const KATEGORI_DOKUMEN = {
  '01': { 
    name: 'SK Pangkat (Mulai CPNS)', 
    allowedTypes: ['application/pdf'],
    allowedExtensions: ['.pdf'],
    icon: '📄'
  },
  '02': { 
    name: 'SK Fungsional', 
    allowedTypes: ['application/pdf'],
    allowedExtensions: ['.pdf'],
    icon: '📄'
  },
  '03': { 
    name: 'Data Pribadi', 
    allowedTypes: ['image/jpeg', 'image/png'],
    allowedExtensions: ['.jpg', '.jpeg', '.png'],
    icon: '🖼️'
  },
  '04': { 
    name: 'Riwayat Pendidikan', 
    allowedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    allowedExtensions: ['.pdf', '.jpg', '.jpeg', '.png'],
    icon: '🎓'
  },
  '05': { 
    name: 'Uraian Tugas', 
    allowedTypes: ['application/pdf'],
    allowedExtensions: ['.pdf'],
    icon: '📋'
  },
  '06': { 
    name: 'SPK RKK (Khusus Nakes)', 
    allowedTypes: ['application/pdf'],
    allowedExtensions: ['.pdf'],
    icon: '🏥'
  },
  '07': { 
    name: 'Penilaian Kinerja (SKP)', 
    allowedTypes: ['application/pdf'],
    allowedExtensions: ['.pdf'],
    icon: '⭐'
  },
  '08': { 
    name: 'SPMT', 
    allowedTypes: ['application/pdf'],
    allowedExtensions: ['.pdf'],
    icon: '📊'
  },
  '09': { 
    name: 'Orientasi', 
    allowedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    allowedExtensions: ['.pdf', '.jpg', '.jpeg', '.png'],
    icon: '🔄'
  },
  '10': { 
    name: 'KGB', 
    allowedTypes: ['application/pdf'],
    allowedExtensions: ['.pdf'],
    icon: '📈'
  },
  '11': { 
    name: 'Pengembangan Kompetensi', 
    allowedTypes: ['application/pdf'],
    allowedExtensions: ['.pdf'],
    icon: '📚'
  }
}

export const getAllowedTypes = (kode) => {
  return KATEGORI_DOKUMEN[kode]?.allowedTypes || []
}

export const getAllowedExtensions = (kode) => {
  return KATEGORI_DOKUMEN[kode]?.allowedExtensions || []
}

export const getKategoriName = (kode) => {
  return KATEGORI_DOKUMEN[kode]?.name || kode
}

export const getKategoriInfo = (kode) => {
  return KATEGORI_DOKUMEN[kode]
}