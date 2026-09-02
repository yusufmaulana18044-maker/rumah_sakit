// src/components/SearchBar.jsx
import React, { useState, useRef, useEffect } from 'react';

const SearchBar = ({ searchTerm, setSearchTerm, filteredData = [], onResultClick }) => {
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef(null);

  // Logika biar dropdown nutup kalau klik di luar area search
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <div className="relative w-full max-w-md" ref={wrapperRef}>
      <div className="relative">
        {/* Ikon Search */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Input Field */}
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl leading-5 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 sm:text-sm transition-all duration-200 shadow-sm"
          placeholder="Cari nama pegawai atau NIP..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
        />
      </div>

      {/* -- DROPDOWN HASIL PENCARIAN (Modal Melayang) -- */}
      {isFocused && searchTerm.length > 0 && (
        <div className="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-100 max-h-60 overflow-y-auto">
          {filteredData && filteredData.length > 0 ? (
            <ul className="py-1">
              {filteredData.map((emp) => (
                <li 
                  key={emp.id} 
                  onClick={() => {
                    if(onResultClick) onResultClick(emp);
                    setIsFocused(false);
                    setSearchTerm("");
                  }}
                  className="px-4 py-3 flex items-center justify-between hover:bg-teal-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                >
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{emp.full_name}</p>
                    <p className="text-xs text-gray-400">NIP: {emp.nip || '-'}</p>
                  </div>
                  <span className="text-xs bg-gray-100 text-teal-700 px-2 py-0.5 rounded-full font-medium">
                    {emp.work_unit}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-4 text-center text-sm text-gray-500">
              Pegawai tidak ditemukan.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;