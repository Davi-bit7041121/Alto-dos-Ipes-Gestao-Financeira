import { useData } from '../contexts/DataContext.jsx'
import { ArrowDownCircle, ArrowUpCircle, Wallet, TrendingUp, MapPin, CreditCard, AlertTriangle } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const monthNames = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

export default function Dashboard() {
  const { receitas, despesas, lotes, parcelas } = useData()

  const totalReceitas = receitas.reduce((s, r) => s + (r.valor || 0), 0)
  const totalDespesas = despesas.reduce((s, d) => s + (d.valor || 0), 0)
  const lucro = totalReceitas - totalDespesas
  const aReceber = parcelas.filter(p => p.status === 'Em aberto' || p.status === 'Vencido').reduce((s, p) => s + (p.valorParcela || 0), 0)
  const lotesVendidos = lotes.filter(l => l.status === 'Vendido').length
  const lotesDisponiveis = lotes.filter(l => l.status === 'Disponível').length

  const chartData = monthNames.map((m, i) => {
    const entradas = receitas.filter(r => new Date(r.data || r.createdAt).getMonth() === i).reduce((s, r) => s + (r.valor || 0), 0)
    const saidas = despesas.filter(d => new Date(d.vencimento || d.createdAt).getMonth() === i).reduce((s, d) => s + (d.valor || 0), 0)
    return { mes: m, entradas, saidas }
  })

  const formatBRL = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  const cards = [
    { label: 'Receita Total', value: formatBRL(totalReceitas), icon: ArrowDownCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Despesa Total', value: formatBRL(totalDespesas), icon: ArrowUpCircle, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Lucro Líquido', value: formatBRL(lucro), icon: TrendingUp, color: lucro >= 0 ? 'text-green-600' : 'text-red-600', bg: 'bg-blue-50' },
    { label: 'A Receber', value: formatBRL(aReceber), icon: Wallet, color: 'text-blue-600', bg: 'bg-blue-50' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Visão geral do loteamento Alto dos Ipês</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">{c.label}</p>
                <p className="text-xl font-bold text-gray-800 mt-2">{c.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-lg ${c.bg} flex items-center justify-center`}>
                <c.icon className={`w-5 h-5 ${c.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 lg:col-span-2">
          <h2 className="font-semibold text-gray-700 mb-4">Fluxo Mensal - 2026</h2>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#718096' }} />
              <YAxis tick={{ fontSize: 12, fill: '#718096' }} tickFormatter={(v) => `R$${v}`} />
              <Tooltip formatter={(v) => formatBRL(v)} />
              <defs>
                <linearGradient id="gradEntradas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2a9d69" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#2a9d69" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradSaidas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e53e3e" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#e53e3e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="entradas" stroke="#2a9d69" fill="url(#gradEntradas)" name="Entradas" strokeWidth={2} />
              <Area type="monotone" dataKey="saidas" stroke="#e53e3e" fill="url(#gradSaidas)" name="Saídas" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 space-y-4">
          <h2 className="font-semibold text-gray-700">Resumo Lotes</h2>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-600">Disponíveis</span>
            </div>
            <span className="font-semibold text-gray-800">{lotesDisponiveis}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-600">Vendidos</span>
            </div>
            <span className="font-semibold text-gray-800">{lotesVendidos}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-gray-600">Financiamentos</span>
            </div>
            <span className="font-semibold text-gray-800">{parcelas.length}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-gray-600">Vencidos</span>
            </div>
            <span className="font-semibold text-gray-800">{parcelas.filter(p => p.status === 'Vencido').length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
