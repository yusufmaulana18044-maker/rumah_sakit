import React from "react";

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 font-bold text-xl text-indigo-600">Rumah Sakit</div>
        <nav className="flex-1 px-4">
          <ul className="space-y-2">
            <li className="p-2 rounded hover:bg-indigo-100 cursor-pointer">Dashboard</li>
            <li className="p-2 rounded hover:bg-indigo-100 cursor-pointer">Pasien</li>
            <li className="p-2 rounded hover:bg-indigo-100 cursor-pointer">Dokter</li>
            <li className="p-2 rounded hover:bg-indigo-100 cursor-pointer">Janji</li>
            <li className="p-2 rounded hover:bg-indigo-100 cursor-pointer">Laporan</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="text-gray-600">Hai, Admin</div>
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;