import { LayoutDashboard, Phone, Settings, FileText, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export function Sidebar() {
  const { signOut, user } = useContext(AuthContext);

  return (
    <aside className="w-64 bg-surface border-r border-slate-200 h-screen flex flex-col fixed left-0 top-0 z-10">
      <div className="p-6 border-b border-slate-100">
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          📞 CallQuality
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <MenuItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
        <MenuItem to="/ligacoes" icon={<Phone size={20} />} label="Ligações" />
        <MenuItem to="/relatorios" icon={<FileText size={20} />} label="Relatórios" />

        <div className="pt-4 mt-4 border-t border-slate-100">
          <MenuItem to="/configuracoes" icon={<Settings size={20} />} label="Configurações" />
        </div>
      </nav>

      <div className="p-4 border-t border-slate-100 bg-slate-50">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs">
            {user?.nome?.charAt(0) || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-slate-700 truncate">{user?.nome}</p>
            <p className="text-xs text-slate-500 truncate">{user?.perfil}</p>
          </div>
        </div>

        <button
          onClick={signOut}
          className="flex items-center gap-2 text-red-600 hover:bg-red-50 transition w-full px-4 py-2 rounded-lg text-sm font-medium"
        >
          <LogOut size={18} />
          Sair do Sistema
        </button>
      </div>
    </aside>
  );
}

function MenuItem({ icon, label, to }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors
      ${isActive
          ? 'bg-blue-50 text-primary'
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
    >
      {icon}
      {label}
    </NavLink>
  );
}
