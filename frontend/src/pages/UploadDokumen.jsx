import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, UploadCloud, FileText, CheckCircle2 } from "lucide-react";
import dummyEmployees, { KATEGORI } from "../data/dummyEmployees";

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

export default function UploadDokumen() {
  const { id } = useParams();
  const navigate = useNavigate();

  const initialCategory = Number(id) || 1;
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(dummyEmployees[0]?.id ?? "");
  const [nomorSurat, setNomorSurat] = useState("");
  const [tanggalUpload, setTanggalUpload] = useState(new Date().toISOString().slice(0, 10));
  const [fileName, setFileName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [fileError, setFileError] = useState("");

  useEffect(() => {
    if (id) {
      setSelectedCategory(Number(id));
    }
  }, [id]);

  const category = KATEGORI.find((item) => item.id === selectedCategory) || KATEGORI[0];

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setFileError("");

    if (file) {
      // VALIDASI: HANYA PDF
      if (file.type !== 'application/pdf') {
        setFileError("❌ Hanya file PDF yang diizinkan!");
        event.target.value = "";
        setFileName("");
        return;
      }

      // VALIDASI: MAKSIMAL 10MB
      if (file.size > 10 * 1024 * 1024) {
        setFileError("❌ Ukuran file maksimal 10MB!");
        event.target.value = "";
        setFileName("");
        return;
      }

      setFileName(file.name);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!selectedEmployeeId) {
      alert("Pilih pegawai terlebih dahulu.");
      return;
    }

    if (!fileName) {
      alert("Pilih file dokumen yang akan diunggah.");
      return;
    }

    const employeeIndex = dummyEmployees.findIndex((emp) => emp.id === Number(selectedEmployeeId));

    if (employeeIndex === -1) {
      alert("Pegawai tidak ditemukan.");
      return;
    }

    const newDoc = {
      id: Date.now(),
      name: fileName,
      type: category.nama,
      category: selectedCategory,
      number: nomorSurat || "—",
      uploaded_at: formatDate(tanggalUpload),
      status: "tunggu",
    };

    const employee = dummyEmployees[employeeIndex];
    const existingDocs = Array.isArray(employee.documents) ? employee.documents : [];
    employee.documents = [...existingDocs, newDoc];

    setIsSubmitted(true);
    setTimeout(() => {
      navigate(`/kategori/${selectedCategory}`);
    }, 900);
  };

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => navigate(`/kategori/${selectedCategory}`)}
        className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke kategori
      </button>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
            <UploadCloud className="w-6 h-6 text-teal-700" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">Unggah Dokumen</p>
            <h1 className="text-2xl font-bold text-gray-800">{category.nama}</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategori Dokumen</label>
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(Number(event.target.value))}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-800 focus:border-teal-500 focus:outline-none"
              >
                {KATEGORI.map((item) => (
                  <option key={item.id} value={item.id}>
                    {String(item.id).padStart(2, "0")} - {item.nama}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pegawai</label>
              <select
                value={selectedEmployeeId}
                onChange={(event) => setSelectedEmployeeId(event.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-800 focus:border-teal-500 focus:outline-none"
              >
                {dummyEmployees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.full_name} - {employee.nip}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Surat / Dokumen</label>
              <input
                type="text"
                value={nomorSurat}
                onChange={(event) => setNomorSurat(event.target.value)}
                placeholder="Contoh: 823/412/405.14/2026"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-800 placeholder:text-gray-400 focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Unggah</label>
              <input
                type="date"
                value={tanggalUpload}
                onChange={(event) => setTanggalUpload(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-800 focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div className={`rounded-xl border-2 border-dashed p-5 ${
            fileError ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-gray-50'
          }`}>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-3 text-center">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                fileError ? 'bg-red-100 text-red-700' : 'bg-teal-100 text-teal-700'
              }`}>
                <FileText className="w-7 h-7" />
              </div>
              <div>
                <p className="text-base font-semibold text-gray-800">Pilih file dokumen</p>
                <p className="text-sm text-gray-500">Format: PDF (Maksimal 10MB)</p>
              </div>
              <input 
                type="file" 
                className="hidden" 
                onChange={handleFileChange} 
                accept=".pdf"
              />
            </label>

            {fileName && !fileError && (
              <div className="mt-4 rounded-lg bg-white border border-teal-200 px-4 py-3 text-sm text-gray-700">
                <span className="font-medium text-teal-700">File terpilih:</span> {fileName}
              </div>
            )}

            {fileError && (
              <div className="mt-4 rounded-lg bg-red-100 border border-red-300 px-4 py-3 text-sm text-red-700">
                {fileError}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="text-sm text-gray-500">
              Dokumen akan ditambahkan ke kategori <span className="font-semibold text-gray-700">{category.nama}</span>
            </div>

            <button
              type="submit"
              className="bg-teal-700 hover:bg-teal-800 text-white px-5 py-2.5 rounded-lg font-medium transition flex items-center gap-2"
            >
              <UploadCloud className="w-4 h-4" />
              Simpan Dokumen
            </button>
          </div>
        </form>
      </div>

      {isSubmitted && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-800 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5" />
          Dokumen berhasil diunggah dan dikirim ke kategori ini.
        </div>
      )}
    </div>
  );
}