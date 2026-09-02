// src/components/Breadcrumb.jsx
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home, Users, FileText, Settings, User, LayoutDashboard, FolderOpen, GraduationCap, UserCog } from 'lucide-react';

// Mapping path ke icon dan label
const routeMap = {
  'dashboard': { label: 'Dashboard', icon: LayoutDashboard },
  'employees': { label: 'Data Pegawai', icon: Users },
  'dokumen': { label: 'Dokumen', icon: FileText },
  'profile': { label: 'Profil', icon: User },
  'settings': { label: 'Pengaturan', icon: Settings },
  'riwayat-pendidikan': { label: 'Riwayat Pendidikan', icon: GraduationCap },
  'status-pegawai': { label: 'Manajemen Status', icon: UserCog },
  'kategori': { label: 'Kategori', icon: FolderOpen },
};

// Get label dari path
const getLabel = (path, id) => {
  if (path === 'kategori' && id) {
    return `Kategori ${id}`;
  }
  if (routeMap[path]) {
    return routeMap[path].label;
  }
  return path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
};

// Get icon dari path
const getIcon = (path) => {
  if (routeMap[path]) {
    const Icon = routeMap[path].icon;
    return <Icon className="w-4 h-4" />;
  }
  return null;
};

export default function Breadcrumb({ 
  customItems = [], 
  className = '',
  separator = <ChevronRight className="w-3 h-3 text-gray-400" /> 
}) {
  const location = useLocation();
  const paths = location.pathname.split('/').filter(Boolean);
  
  const breadcrumbItems = customItems.length > 0 ? customItems : paths.map((path, index) => {
    const url = '/' + paths.slice(0, index + 1).join('/');
    const isLast = index === paths.length - 1;
    
    if (path === 'kategori' && paths[index + 1]) {
      const id = paths[index + 1];
      return {
        label: `Kategori ${id}`,
        url: url,
        isLast: isLast,
        icon: <FolderOpen className="w-4 h-4" />,
        skipNext: true
      };
    }
    
    if (index > 0 && paths[index - 1] === 'kategori') {
      return null;
    }
    
    return {
      label: getLabel(path, paths[index + 1]),
      url: url,
      isLast: isLast,
      icon: getIcon(path)
    };
  }).filter(Boolean);

  const items = breadcrumbItems.length === 0 ? [
    { label: 'Dashboard', url: '/dashboard', isLast: true, icon: <LayoutDashboard className="w-4 h-4" /> }
  ] : breadcrumbItems;

  return (
    <nav className={`flex items-center gap-2 text-sm mb-4 ${className}`}>
      <Link 
        to="/dashboard" 
        className="flex items-center gap-1.5 text-gray-500 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-400 transition-colors"
      >
        <Home className="w-4 h-4" />
        <span className="hidden sm:inline">Home</span>
      </Link>
      
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-2">
          {separator}
          {item.isLast ? (
            <span className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 font-medium">
              {item.icon}
              {item.label}
            </span>
          ) : (
            <Link 
              to={item.url} 
              className="flex items-center gap-1.5 text-gray-500 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-400 transition-colors"
            >
              {item.icon}
              {item.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}