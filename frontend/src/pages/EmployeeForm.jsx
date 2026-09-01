import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, User } from "lucide-react";
import { supabase } from "../supabase";

<<<<<<< HEAD
// Data untuk dropdown
const workUnits = [
  "Instalasi Rawat Inap",
  "Instalasi Rawat Jalan",
  "Instalasi Gawat Darurat",
  "Instalasi Rekam Medis",
  "Instalasi IT",
  "Instalasi Laboratorium",
  "Instalasi Farmasi",
  "Instalasi Radiologi",
  "Instalasi Gizi",
  "Instalasi CSSD",
  "Instalasi Kebidanan",
  "Instalasi Anak",
  "Instalasi Penyakit Dalam",
  "Instalasi Bedah"
];

const positions = [
  "Dokter Spesialis",
  "Dokter Umum",
  "Perawat",
  "Bidan",
  "Analis",
  "Administrator",
  "Teknisi",
  "Farmasi",
  "Gizi",
  "Radiografer",
  "Fisioterapis",
  "Psikolog",
  "Apoteker",
  "Asisten Apoteker",
  "Staff Administrasi"
];
=======
const workUnits = ["Rawat Inap", "Rawat Jalan", "IGD", "ICU", "Radiologi", "Laboratorium", "Administrasi", "IT"];
const positions = ["Dokter Spesialis", "Dokter Umum", "Perawat", "Asisten Perawat", "Apoteker", "Analis", "IT", "Administrasi"];
>>>>>>> 263e32c (feat: SICAKEP v2.0 - Integrasi Supabase & fitur lengkap)

export default function EmployeeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nip: "",
    full_name: "",
    birthplace: "",
    birth_date: "",
    address: "",
    phone: "",
    email: "",
    position: "",
    work_unit: "",
    status: "aktif"
  });

  const [loading, setLoading] = useState(false);

  // Ambil data pegawai jika edit
  useEffect(() => {
    if (isEdit) {
<<<<<<< HEAD
      const fetchEmployee = async () => {
        try {
          const { data, error } = await supabase
            .from("pegawai")
            .select("*")
            .eq("id", id)
            .single();

          if (error) throw error;

          if (data) {
            setFormData({
              nip: data.nip || "",
              full_name: data.full_name || "",
              birthplace: data.birthplace || "",
              birth_date: data.birth_date || "",
              gender: data.gender || "L",
              address: data.address || "",
              phone: data.phone || "",
              email: data.email || "",
              position: data.position || "",
              work_unit: data.work_unit || "",
              join_date: data.join_date || "",
              status: data.status || "aktif"
            });
          }
        } catch (error) {
          console.error("Error fetching employee:", error);
          alert("Gagal mengambil data pegawai");
        }
      };

=======
>>>>>>> 263e32c (feat: SICAKEP v2.0 - Integrasi Supabase & fitur lengkap)
      fetchEmployee();
    }
  }, [isEdit, id]);

  const fetchEmployee = async () => {
    try {
      const { data, error } = await supabase
        .from("pegawai")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          nip: data.nip || "",
          full_name: data.full_name || "",
          birthplace: data.birthplace || "",
          birth_date: data.birth_date || "",
          address: data.address || "",
          phone: data.phone || "",
          email: data.email || "",
          position: data.position || "",
          work_unit: data.work_unit || "",
          status: data.status || "aktif"
        });
      }
    } catch (error) {
      console.error("Error fetching employee:", error);
      alert("Gagal memuat data pegawai");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
<<<<<<< HEAD
        // UPDATE pegawai
=======
>>>>>>> 263e32c (feat: SICAKEP v2.0 - Integrasi Supabase & fitur lengkap)
        const { error } = await supabase
          .from("pegawai")
          .update(formData)
          .eq("id", id);

        if (error) throw error;
        alert("✅ Data pegawai berhasil diupdate!");
<<<<<<< HEAD

      } else {
        // INSERT pegawai baru
=======
      } else {
>>>>>>> 263e32c (feat: SICAKEP v2.0 - Integrasi Supabase & fitur lengkap)
        const { error } = await supabase
          .from("pegawai")
          .insert([formData]);

        if (error) throw error;
        alert("✅ Pegawai baru berhasil ditambahkan!");
      }

      navigate("/employees");
<<<<<<< HEAD

=======
>>>>>>> 263e32c (feat: SICAKEP v2.0 - Integrasi Supabase & fitur lengkap)
    } catch (error) {
      console.error("Error saving employee:", error);
      alert("❌ Gagal menyimpan data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate("/employees")}
        className="flex items-center gap-2 text-gray-600 hover:text-teal-600 mb-4 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali
      </button>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="bg-gradient-to-r from-teal-600 to-blue-600 px-6 py-4">
          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-white" />
            <h1 className="text-xl font-bold text-white">
              {isEdit ? "Edit Data Pegawai" : "Tambah Pegawai Baru"}
            </h1>
          </div>
          <p className="text-teal-100 text-sm mt-1">
            {isEdit ? "Perbarui informasi pegawai" : "Isi formulir untuk menambahkan pegawai baru"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* NIP */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                NIP <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nip"
                value={formData.nip}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-teal-400 focus:outline-none"
                placeholder="Contoh: 198001012001001"
              />
            </div>

            {/* Nama Lengkap */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-teal-400 focus:outline-none"
                placeholder="Contoh: dr. Ahmad Wijaya"
              />
            </div>

            {/* Tempat Lahir */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tempat Lahir
              </label>
              <input
                type="text"
                name="birthplace"
                value={formData.birthplace}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-teal-400 focus:outline-none"
                placeholder="Contoh: Ponorogo"
              />
            </div>

            {/* Tanggal Lahir */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Lahir
              </label>
              <input
                type="date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-teal-400 focus:outline-none"
              />
            </div>

            {/* No. Telepon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                No. Telepon
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-teal-400 focus:outline-none"
                placeholder="Contoh: 081234567890"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-teal-400 focus:outline-none"
                placeholder="Contoh: nama@rsudharjono.com"
              />
            </div>

            {/* Jabatan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jabatan <span className="text-red-500">*</span>
              </label>
              <select
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-teal-400 focus:outline-none"
              >
                <option value="">-- Pilih Jabatan --</option>
                {positions.map((pos) => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            </div>

            {/* Unit Kerja */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit Kerja <span className="text-red-500">*</span>
              </label>
              <select
                name="work_unit"
                value={formData.work_unit}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-teal-400 focus:outline-none"
              >
                <option value="">-- Pilih Unit --</option>
                {workUnits.map((unit) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>

            {/* Alamat */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alamat
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="2"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-teal-400 focus:outline-none"
                placeholder="Alamat lengkap pegawai"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-teal-400 focus:outline-none"
              >
                <option value="aktif">Aktif</option>
                <option value="cuti">Cuti</option>
                <option value="nonaktif">Nonaktif</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-8 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate("/employees")}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:from-teal-700 hover:to-blue-700 transition flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
<<<<<<< HEAD
              {loading ? "Menyimpan..." : (isEdit ? "Simpan Perubahan" : "Simpan Pegawai")}
=======
              {loading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Simpan Pegawai"}
>>>>>>> 263e32c (feat: SICAKEP v2.0 - Integrasi Supabase & fitur lengkap)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}