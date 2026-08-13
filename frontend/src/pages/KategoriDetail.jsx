// src/pages/KategoriDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, FileText, Download, Trash2 } from "lucide-react";
import dummyEmployees, { KATEGORI } from "../data/dummyEmployees";

const STATUS = {
  ok: { lbl: "Terverifikasi", cls: "bg-green-100 text-green-700" },
  tunggu: { lbl: "Menunggu", cls: "bg-yellow-100 text-yellow-700" },
  revisi: { lbl: "Perlu revisi", cls: "bg-red-100 text-red-700" },
};

export default function KategoriDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [kategori, setKategori] = useState(null);
  const [stats, setStats] = useState({ total: 0, ok: 0, tunggu: 0, revisi: 0 });

  useEffect(() => {
    const kat = KATEGORI.find(k => k.id === parseInt(id));
    if (kat) {
      setKategori(kat);
      
      // 🔥 PERBAIKAN: Cari dokumen dengan category yang cocok
      const docs = [];
      dummyEmployees.forEach(emp => {
        if (emp.documents && emp.documents.length > 0) {
          emp.documents.forEach(doc => {
            // Pastikan category cocok dengan id
            if (doc.category === parseInt(id)) {
              docs.push({
                ...doc,
                employee: emp.full_name,
                nip: emp.nip,
                unit: emp.work_unit,
                status: doc.status || "ok" // default status jika tidak ada
              });
            }
          });
        }
      });
      
      console.log(`Kategori ${id} (${kat.nama}) ditemukan ${docs.length} dokumen`); // Debug
      
      setDocuments(docs);
      
      const okCount = docs.filter(d => d.status === "ok").length;
      const tungguCount = docs.filter(d => d.status === "tunggu").length;
      const revisiCount = docs.filter(d => d.status === "revisi").length;
      setStats({
        total: docs.length,
        ok: okCount,
        tunggu: tungguCount,
        revisi: revisiCount,
      });
    }
  }, [id]);

  const handleDownload = (doc) => {
    alert(`📥 Download file: ${doc.name}`);
  };

  const handleDeleteDoc = (docId, docName) => {
    if (window.confirm(`Yakin ingin menghapus dokumen "${docName}"?`)) {
      setDocuments(documents.filter(doc => doc.id !== docId));
      alert(`✅ Dokumen "${docName}" berhasil dihapus (simulasi)`);
    }
  };

  if (!kategori) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Kategori tidak ditemukan</p>
        <button onClick={() => navigate("/dashboard")} className="mt-4 text-teal-600 hover:underline">
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tombol Kembali */}
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Dashboard
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono bg-teal-100 text-teal-700 px-2 py-0.5 rounded">
                {String(kategori.id).padStart(2, "0")}
              </span>
              <h1 className="text-2xl font-bold text-gray-800">{kategori.nama}</h1>
            </div>
            <p className="text-gray-500 text-sm mt-1">
              {stats.total} dokumen dari {dummyEmployees.length} pegawai
            </p>
          </div>
          <button
            onClick={() => navigate(`/kategori/${kategori.id}/upload`)}
            className="bg-teal-700 text-white px-4 py-2 rounded-lg hover:bg-teal-800 transition flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Unggah dokumen
          </button>
        </div>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-teal-600">
          <p className="text-xs text-gray-500">Total Dokumen</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-600">
          <p className="text-xs text-gray-500">Terverifikasi</p>
          <p className="text-2xl font-bold text-green-700">{stats.ok}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-yellow-600">
          <p className="text-xs text-gray-500">Menunggu</p>
          <p className="text-2xl font-bold text-yellow-700">{stats.tunggu}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-red-600">
          <p className="text-xs text-gray-500">Perlu Revisi</p>
          <p className="text-2xl font-bold text-red-700">{stats.revisi}</p>
        </div>
      </div>

      {/* Tabel Dokumen */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {documents.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-lg font-medium">Belum ada dokumen</p>
            <p className="text-sm mt-1">Pada kategori <strong>{kategori.nama}</strong></p>
            <p className="text-sm">Gunakan tombol <strong>Unggah dokumen</strong> untuk menambahkan berkas pertama.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dokumen</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pegawai</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nomor Surat</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {documents.map((doc) => {
                  const status = STATUS[doc.status] || STATUS.ok;
                  return (
                    <tr key={doc.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-800">{doc.type}</div>
                        <div className="text-xs text-gray-400 truncate max-w-[200px]">{doc.name}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-800">{doc.employee}</div>
                        <div className="text-xs text-gray-400">{doc.unit}</div>
                      </td>
                      <td className="px-4 py-3 font-mono text-sm text-gray-600">{doc.number || "—"}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{doc.uploaded_at || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${status.cls}`}>
                          {status.lbl}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDownload(doc)}
                            className="p-1 text-teal-600 hover:bg-teal-50 rounded transition"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteDoc(doc.id, doc.name)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}