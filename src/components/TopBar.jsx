import { useAuth } from '../contexts/AuthContext.jsx'
import { Search, LogOut } from 'lucide-react'

export default function TopBar() {
  const { user, logout } = useAuth()
  const initial = user?.name?.[0]?.toUpperCase() || 'U'

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar receitas, despesas, parcelas..."
          className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand"
        />
      </div>
      <div className="flex items-center gap-3 ml-4">
        <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand font-semibold text-sm">
          {initial}
        </div>
        <button onClick={logout} className="text-gray-400 hover:text-gray-600 transition-colors">
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}
