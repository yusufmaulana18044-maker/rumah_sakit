// components/ExportButton.jsx
import { useState } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download, FileSpreadsheet, FileText, Loader2 } from 'lucide-react';

export default function ExportButton({ 
  data, 
  filename = 'laporan', 
  columns = [],
  title = 'Laporan',
  showExcel = true,
  showPDF = true,
  className = ''
}) {
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // ============================================
  // 1. EXPORT KE EXCEL
  // ============================================
  const exportToExcel = () => {
    setLoading(true);
    try {
      // Format data untuk Excel
      const excelData = data.map(row => {
        const obj = {};
        columns.forEach(col => {
          // Ambil value dari row berdasarkan key
          let value = row[col.key] || '-';
          // Jika ada render kustom
          if (col.render) {
            value = col.render(row);
          }
          obj[col.label] = value;
        });
        return obj;
      });

      // Buat worksheet
      const ws = XLSX.utils.json_to_sheet(excelData);
      
      // Atur lebar kolom
      const colWidths = columns.map(col => ({
        wch: Math.max(col.label.length * 2, 12)
      }));
      ws['!cols'] = colWidths;

      // Buat workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      // Download
      XLSX.writeFile(wb, `${filename}.xlsx`);
      
      setLoading(false);
      setShowMenu(false);
    } catch (error) {
      console.error('Export Excel error:', error);
      alert('Gagal export Excel: ' + error.message);
      setLoading(false);
    }
  };

  // ============================================
  // 2. EXPORT KE PDF
  // ============================================
  const exportToPDF = () => {
    setLoading(true);
    try {
      const doc = new jsPDF('landscape', 'mm', 'a4');
      
      // Header
      doc.setFontSize(18);
      doc.text(title, 14, 22);
      doc.setFontSize(10);
      doc.text(`Dicetak: ${new Date().toLocaleDateString('id-ID')}`, 14, 30);
      
      // Buat tabel
      const tableData = data.map(row => {
        return columns.map(col => {
          let value = row[col.key] || '-';
          if (col.render) {
            value = col.render(row);
          }
          return String(value);
        });
      });

      const tableHeaders = columns.map(col => col.label);

      autoTable(doc, {
        head: [tableHeaders],
        body: tableData,
        startY: 38,
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [13, 148, 136], // warna teal
          textColor: [255, 255, 255],
          fontSize: 9,
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240],
        },
        didDrawPage: function(data) {
          // Footer
          doc.setFontSize(8);
          doc.text(
            `Halaman ${data.pageNumber} - SICAKEP v2.0`,
            doc.internal.pageSize.getWidth() / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
          );
        },
      });

      // Download PDF
      doc.save(`${filename}.pdf`);
      
      setLoading(false);
      setShowMenu(false);
    } catch (error) {
      console.error('Export PDF error:', error);
      alert('Gagal export PDF: ' + error.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <button className={`flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-lg ${className}`} disabled>
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading...
      </button>
    );
  }

  // Jika hanya 1 pilihan export
  if (!showExcel && showPDF) {
    return (
      <button
        onClick={exportToPDF}
        className={`flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition ${className}`}
      >
        <FileText className="w-4 h-4" />
        Export PDF
      </button>
    );
  }

  if (showExcel && !showPDF) {
    return (
      <button
        onClick={exportToExcel}
        className={`flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition ${className}`}
      >
        <FileSpreadsheet className="w-4 h-4" />
        Export Excel
      </button>
    );
  }

  // Menu dropdown untuk 2 pilihan
  return (
    <div className="relative inline-block">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={`flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition ${className}`}
      >
        <Download className="w-4 h-4" />
        Export
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 overflow-hidden">
          <button
            onClick={exportToExcel}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 dark:hover:bg-green-900/20 transition text-left text-sm text-gray-700 dark:text-gray-300"
          >
            <FileSpreadsheet className="w-4 h-4 text-green-600" />
            <span>Export ke Excel</span>
          </button>
          <button
            onClick={exportToPDF}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition text-left text-sm text-gray-700 dark:text-gray-300 border-t border-gray-100 dark:border-gray-700"
          >
            <FileText className="w-4 h-4 text-red-600" />
            <span>Export ke PDF</span>
          </button>
        </div>
      )}
    </div>
  );
}