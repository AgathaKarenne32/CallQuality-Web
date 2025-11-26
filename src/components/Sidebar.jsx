import { LayoutDashboard, Phone, Settings, FileText } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="w-64 bg-surface border-r border-slate-200 h-screen flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-slate-100">
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          📞 CallQuality
        </h1>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        <MenuItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active />
        <MenuItem icon={<Phone size={20}/>} label="Ligações" />
        <MenuItem icon={<FileText size={20}/>} label="Relatórios" />
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-100">
        <button className="flex items-center gap-3 text-secondary hover:text-primary transition w-full px-4 py-2">
          <Settings size={20} />
          <span className="text-sm font-medium">Configurações</span>
        </button>
      </div>
    </aside>
  );
}

function MenuItem({ icon, label, active }) {
  return (
    <button className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors
      ${active 
        ? 'bg-blue-50 text-primary' 
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
      {icon}
      {label}
    </button>
  );
}
