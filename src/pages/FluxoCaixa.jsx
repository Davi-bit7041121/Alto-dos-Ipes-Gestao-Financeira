import { useState } from 'react'
import { useData } from '../contexts/DataContext.jsx'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'

const monthNames = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
const fullMonthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

const formatBRL = (v) => (v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function FluxoCaixa() {
  const { receitas, despesas } = useData()
  const [year, setYear] = useState(2026)

  const yearReceitas = receitas.filter(r => new Date(r.data || r.createdAt).getFullYear() === year)
  const yearDespesas = despesas.filter(d => new Date(d.vencimento || d.createdAt).getFullYear() === year)

  const totalEntradas = yearReceitas.reduce((s, r) => s + (r.valor || 0), 0)
  const totalSaidas = yearDespesas.reduce((s, d) => s + (d.valor || 0), 0)
  const saldo = totalEntradas - totalSaidas

  const chartData = monthNames.map((m, i) => {
    const entradas = yearReceitas.filter(r => new Date(r.data || r.createdAt).getMonth() === i).reduce((s, r) => s + (r.valor || 0), 0)
    const saidas = yearDespesas.filter(d => new Date(d.vencimento || d.createdAt).getMonth() === i).reduce((s, d) => s + (d.valor || 0), 0)
    return { mes: m, entradas, saidas, saldo: entradas - saidas }
  })

  const cards = [
    { label: 'Entradas (Ano)', value: formatBRL(totalEntradas), color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Saídas (Ano)', value: formatBRL(totalSaidas), color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Saldo Anual', value: formatBRL(saldo), color: saldo >= 0 ? 'text-green-600' : 'text-red-600', bg: 'bg-blue-50' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Fluxo de Caixa</h1>
        <p className="text-gray-500 text-sm mt-1">Análise de entradas e saídas · {year}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map(c => (
          <div key={c.label} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">{c.label}</p>
                <p className={`text-xl font-bold mt-2 ${c.color}`}>{c.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-lg ${c.bg} flex items-center justify-center`}>
                <div className={`w-4 h-4 rounded ${c.color.replace('text-', 'bg-')}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="font-semibold text-gray-700 mb-4">Fluxo Mensal - {year}</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#718096' }} />
            <YAxis tick={{ fontSize: 12, fill: '#718096' }} tickFormatter={(v) => `R$${v}`} />
            <Tooltip formatter={(v) => formatBRL(v)} />
            <Legend />
            <Line type="monotone" dataKey="entradas" stroke="#2a9d69" name="Entradas" strokeWidth={2} />
            <Line type="monotone" dataKey="saidas" stroke="#e53e3e" name="Saídas" strokeWidth={2} />
            <Line type="monotone" dataKey="saldo" stroke="#3182ce" name="Saldo" strokeWidth={2} strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-700">Resumo Mensal - {year}</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 font-semibold text-gray-600">MÊS</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">ENTRADAS</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">SAÍDAS</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">SALDO</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((d, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="px-4 py-3 text-gray-800 capitalize">{fullMonthNames[i]}</td>
                <td className="px-4 py-3 text-green-600">{formatBRL(d.entradas)}</td>
                <td className="px-4 py-3 text-red-600">{formatBRL(d.saidas)}</td>
                <td className={`px-4 py-3 font-medium ${d.saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatBRL(d.saldo)}</td>
              </tr>
            ))}
            <tr className="bg-gray-50 font-semibold">
              <td className="px-4 py-3 text-gray-800">Total</td>
              <td className="px-4 py-3 text-green-600">{formatBRL(totalEntradas)}</td>
              <td className="px-4 py-3 text-red-600">{formatBRL(totalSaidas)}</td>
              <td className={`px-4 py-3 ${saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatBRL(saldo)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
