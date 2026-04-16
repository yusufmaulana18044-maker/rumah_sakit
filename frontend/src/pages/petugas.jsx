import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import Layout from "../components/layout";

export default function Petugas() {
  const [petugas, setPetugas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPetugas, setEditingPetugas] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    nama: "",
    email: "",
    password: "",
    role: "petugas"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    getPetugas();
  }, []);

  const getPetugas = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("role", "petugas")
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
    } else {
      setPetugas(data || []);
    }
  };

  const resetForm = () => {
    setFormData({
      username: "",
      nama: "",
      email: "",
      password: "",
      role: "petugas"
    });
    setEditingPetugas(null);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (!formData.username || !formData.nama || !formData.email) {
      setError("Username, nama, dan email harus diisi");
      setIsLoading(false);
      return;
    }

    if (!editingPetugas && !formData.password) {
      setError("Password harus diisi untuk petugas baru");
      setIsLoading(false);
      return;
    }

    try {
      if (editingPetugas) {
        // Update
        const updateData = {
          username: formData.username,
          nama: formData.nama,
          email: formData.email,
          role: formData.role
        };

        if (formData.password) {
          updateData.password = formData.password;
        }

        const { error } = await supabase
          .from("users")
          .update(updateData)
          .eq("id", editingPetugas.id);

        if (error) throw error;
        setSuccess("Petugas berhasil diupdate");
      } else {
        // Create
        const { error } = await supabase
          .from("users")
          .insert([formData]);

        if (error) throw error;
        setSuccess("Petugas berhasil ditambahkan");
      }

      getPetugas();
      setShowForm(false);
      resetForm();
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  };

  const handleEdit = (petugas) => {
    setEditingPetugas(petugas);
    setFormData({
      username: petugas.username,
      nama: petugas.nama,
      email: petugas.email,
      password: "",
      role: petugas.role
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus petugas ini?")) return;

    const { error } = await supabase
      .from("users")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Gagal menghapus petugas");
      console.log(error);
    } else {
      alert("Petugas berhasil dihapus");
      getPetugas();
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Petugas</h1>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
          >
            Tambah Petugas
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded shadow max-w-md w-full p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-lg font-semibold text-gray-800">
                  {editingPetugas ? "Edit Petugas" : "Tambah Petugas"}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-300 rounded text-red-700 text-sm">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="p-3 bg-green-50 border border-green-300 rounded text-green-700 text-sm">
                    {success}
                  </div>
                )}

                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan username"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) => setFormData({...formData, nama: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan email"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Password {editingPetugas ? "(Kosongkan jika tidak ingin mengubah)" : ""}
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan password"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition disabled:opacity-50"
                  >
                    {isLoading ? "Menyimpan..." : (editingPetugas ? "Update" : "Tambah")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded shadow overflow-hidden">
          {petugas.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>Belum ada petugas</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal Dibuat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {petugas.map((p, index) => (
                    <tr key={p.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {p.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {p.nama}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {p.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(p.created_at).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(p)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}