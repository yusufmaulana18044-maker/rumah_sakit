const dummyEmployees = [
  {
    id: 1,
    nip: "198001012001001",
    full_name: "dr. Ahmad Wijaya, Sp.PD",
    birthplace: "Ponorogo",
    birth_date: "1980-01-01",
    gender: "L",
    address: "Jl. Merdeka No. 10, Ponorogo",
    phone: "081234567890",
    email: "ahmad.wijaya@rsudharjono.com",
    position: "Kepala IGD",
    work_unit: "IGD",
    join_date: "2001-01-15",
    status: "aktif",
    documents: [
      { id: 1, type: "Ijazah", name: "ijazah_s1.pdf", uploaded_at: "2024-01-10" },
      { id: 2, type: "KTP", name: "ktp_ahmad.jpg", uploaded_at: "2024-01-10" }
    ]
  },
  {
    id: 2,
    nip: "198502102002002",
    full_name: "Siti Nurjanah, S.Kep",
    birthplace: "Madiun",
    birth_date: "1985-02-10",
    gender: "P",
    address: "Jl. Diponegoro No. 25, Madiun",
    phone: "081234567891",
    email: "siti.nurjanah@rsudharjono.com",
    position: "Perawat Senior",
    work_unit: "Rawat Inap",
    join_date: "2002-03-20",
    status: "aktif",
    documents: [
      { id: 3, type: "Ijazah", name: "ijazah_d3.pdf", uploaded_at: "2024-01-10" }
    ]
  },
  {
    id: 3,
    nip: "199003152003003",
    full_name: "Budi Santoso, A.Md",
    birthplace: "Ponorogo",
    birth_date: "1990-03-15",
    gender: "L",
    address: "Jl. Sukarno Hatta No. 5, Ponorogo",
    phone: "081234567892",
    email: "budi.santoso@rsudharjono.com",
    position: "Administrasi",
    work_unit: "Pendaftaran",
    join_date: "2003-07-01",
    status: "cuti",
    documents: []
  }
];

const documentTypes = [
  "Ijazah", "SKCK", "KTP", "NPWP", "Sertifikat", "STR", "Surat Nikah", "KK", "SK Pengangkatan", "Lainnya"
];

const workUnits = [
  "IGD", "Rawat Inap", "Rawat Jalan", "Farmasi", "Laboratorium", "Radiologi", "Pendaftaran", "Administrasi", "IT", "Kebersihan", "Keamanan"
];

const positions = [
  "Kepala IGD", "Kepala Ruangan", "Dokter Spesialis", "Dokter Umum", "Perawat Senior", "Perawat", "Apoteker", "Administrasi", "IT Support", "Kebersihan", "Satpam"
];

export default dummyEmployees;
export { documentTypes, workUnits, positions };