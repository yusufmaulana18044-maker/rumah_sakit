// components/QuickStats.jsx
import { TrendingUp, TrendingDown, Users, FileText, CheckCircle } from 'lucide-react';

export default function QuickStats({ stats }) {
  const items = [
    { label: 'Total Pegawai', value: stats.totalEmployees, icon: Users, color: 'bg-teal-500' },
    { label: 'Dokumen Terupload', value: stats.totalDocuments, icon: FileText, color: 'bg-blue-500' },
    { label: 'Berkas Lengkap', value: stats.completeEmployees, icon: CheckCircle, color: 'bg-green-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((item, idx) => (
        <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{item.value}</p>
            </div>
            <div className={`${item.color} p-3 rounded-lg`}>
              <item.icon className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}