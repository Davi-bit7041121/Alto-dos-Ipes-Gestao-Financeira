import { useState } from 'react'
import { useData } from '../contexts/DataContext.jsx'
import { FileText, FileSpreadsheet, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'

const months = ['Todos os meses', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
const tipos = ['Todos', 'Receitas', 'Despesas']
const categoriasReceita = ['Venda de lote', 'Entrada', 'Juros', 'Multa', 'Outros']
const categoriasDespesa = ['Infraestrutura', 'Terraplanagem', 'Asfalto', 'Energia', 'Água', 'Marketing', 'Comissão', 'Cartório', 'Jurídico', 'Administrativo', 'Outros']
const todasCategorias = ['Todas categorias', ...categoriasReceita, ...categoriasDespesa]

const formatBRL = (v) => (v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function Relatorios() {
  const { receitas, despesas } = useData()
  const [tipo, setTipo] = useState('Todos')
  const [mes, setMes] = useState('Todos os meses')
  const [ano, setAno] = useState(2026)
  const [categoria, setCategoria] = useState('Todas categorias')

  const mesIndex = months.indexOf(mes) - 1

  const filterReceitas = receitas.filter(r => {
    const d = new Date(r.data || r.createdAt)
    if (d.getFullYear() !== ano) return false
    if (mesIndex >= 0 && d.getMonth() !== mesIndex) return false
    if (categoria !== 'Todas categorias' && r.categoria !== categoria) return false
    return true
  })

  const filterDespesas = despesas.filter(d => {
    const dt = new Date(d.vencimento || d.createdAt)
    if (dt.getFullYear() !== ano) return false
    if (mesIndex >= 0 && dt.getMonth() !== mesIndex) return false
    if (categoria !== 'Todas categorias' && d.categoria !== categoria) return false
    return true
  })

  const totalReceitas = tipo === 'Despesas' ? 0 : filterReceitas.reduce((s, r) => s + (r.valor || 0), 0)
  const totalDespesas = tipo === 'Receitas' ? 0 : filterDespesas.reduce((s, d) => s + (d.valor || 0), 0)
  const lucro = totalReceitas - totalDespesas

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Relatórios</h1>
          <p className="text-gray-500 text-sm mt-1">Análise financeira por período e categoria</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            <FileText className="w-4 h-4" /> PDF
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            <FileSpreadsheet className="w-4 h-4" /> Excel
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Tipo</label>
          <select value={tipo} onChange={e => setTipo(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand">
            {tipos.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Mês</label>
          <select value={mes} onChange={e => setMes(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand">
            {months.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Ano</label>
          <select value={ano} onChange={e => setAno(parseInt(e.target.value))} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand">
            <option value={2026}>2026</option>
            <option value={2025}>2025</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Categoria</label>
          <select value={categoria} onChange={e => setCategoria(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand">
            {todasCategorias.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Total Receitas</p>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-600">{formatBRL(totalReceitas)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Total Despesas</p>
            <TrendingDown className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-red-600">{formatBRL(totalDespesas)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Lucro Líquido</p>
            <DollarSign className="w-5 h-5 text-blue-500" />
          </div>
          <p className={`text-2xl font-bold ${lucro >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatBRL(lucro)}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="font-semibold text-gray-700 mb-4">Detalhamento por Categoria</h2>
        {tipo !== 'Despesas' && filterReceitas.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-green-600 mb-2">Receitas</h3>
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-100"><th className="text-left py-2 text-gray-500">Descrição</th><th className="text-left py-2 text-gray-500">Categoria</th><th className="text-right py-2 text-gray-500">Valor</th></tr></thead>
              <tbody>
                {filterReceitas.map(r => (
                  <tr key={r.id} className="border-b border-gray-50"><td className="py-2 text-gray-800">{r.descricao}</td><td className="py-2 text-gray-600">{r.categoria}</td><td className="py-2 text-right text-green-600">{formatBRL(r.valor)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {tipo !== 'Receitas' && filterDespesas.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-red-600 mb-2">Despesas</h3>
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-100"><th className="text-left py-2 text-gray-500">Descrição</th><th className="text-left py-2 text-gray-500">Categoria</th><th className="text-right py-2 text-gray-500">Valor</th></tr></thead>
              <tbody>
                {filterDespesas.map(d => (
                  <tr key={d.id} className="border-b border-gray-50"><td className="py-2 text-gray-800">{d.descricao}</td><td className="py-2 text-gray-600">{d.categoria}</td><td className="py-2 text-right text-red-600">{formatBRL(d.valor)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {filterReceitas.length === 0 && filterDespesas.length === 0 && (
          <p className="text-center text-gray-400 py-8">Nenhum dado encontrado para os filtros selecionados</p>
        )}
      </div>
    </div>
  )
}
