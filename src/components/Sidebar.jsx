import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ArrowDownCircle, ArrowUpCircle, CreditCard, Users, MapPin, BarChart3, FileText, Calendar, Sparkles, TreePine } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/receitas', label: 'Receitas', icon: ArrowDownCircle },
  { to: '/despesas', label: 'Despesas', icon: ArrowUpCircle },
  { to: '/parcelas', label: 'Parcelas', icon: CreditCard },
  { to: '/clientes', label: 'Clientes', icon: Users },
  { to: '/lotes', label: 'Lotes', icon: MapPin },
  { to: '/fluxo-caixa', label: 'Fluxo de Caixa', icon: BarChart3 },
  { to: '/relatorios', label: 'Relatórios', icon: FileText },
  { to: '/calendario', label: 'Calendário', icon: Calendar },
  { to: '/analise-ia', label: 'Análise IA', icon: Sparkles },
]

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand flex items-center justify-center">
            <TreePine className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-800 text-sm">Alto dos Ipês</h1>
            <p className="text-xs text-gray-500">Gestão Financeira</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
