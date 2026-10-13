import { useState } from 'react'
import { useData } from '../contexts/DataContext.jsx'
import { Plus, Search, Pencil, Trash2, X } from 'lucide-react'

const categorias = ['Infraestrutura', 'Terraplanagem', 'Asfalto', 'Energia', 'Água', 'Marketing', 'Comissão', 'Cartório', 'Jurídico', 'Administrativo', 'Outros']
const statusOptions = ['Em aberto', 'Pago', 'Vencido']

const formatBRL = (v) => (v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const formatDate = (d) => d ? new Date(d).toLocaleDateString('pt-BR') : '-'

const statusColors = {
  'Pago': 'bg-green-100 text-green-700',
  'Em aberto': 'bg-yellow-100 text-yellow-700',
  'Vencido': 'bg-red-100 text-red-700',
}

export default function Despesas() {
  const { despesas, add, update, remove } = useData()
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [modal, setModal] = useState(null)

  const filtered = despesas.filter(d => {
    if (search && !d.descricao?.toLowerCase().includes(search.toLowerCase()) && !d.fornecedor?.toLowerCase().includes(search.toLowerCase())) return false
    if (filterCat && d.categoria !== filterCat) return false
    if (filterStatus && d.status !== filterStatus) return false
    return true
  })

  const total = filtered.reduce((s, d) => s + (d.valor || 0), 0)
  const pago = filtered.filter(d => d.status === 'Pago').reduce((s, d) => s + (d.valor || 0), 0)

  const handleSave = (formData) => {
    if (modal?.id) update('despesas', modal.id, formData)
    else add('despesas', formData)
    setModal(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Despesas</h1>
          <p className="text-sm text-gray-500 mt-1">{formatBRL(total)} total · {formatBRL(pago)} pago</p>
        </div>
        <button onClick={() => setModal({})} className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-dark flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Nova Despesa
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Buscar por descrição ou fornecedor..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-brand" />
        </div>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand">
          <option value="">Todas categorias</option>
          {categorias.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand">
          <option value="">Todos status</option>
          {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 font-semibold text-gray-600">DESCRIÇÃO</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">CATEGORIA</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">FORNECEDOR</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">VALOR</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">VENCIMENTO</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">STATUS</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-gray-400">Nenhuma despesa encontrada</td></tr>
            ) : filtered.map(d => (
              <tr key={d.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-800">{d.descricao}</td>
                <td className="px-4 py-3 text-gray-600">{d.categoria}</td>
                <td className="px-4 py-3 text-gray-600">{d.fornecedor || '-'}</td>
                <td className="px-4 py-3 font-medium text-red-600">{formatBRL(d.valor)}</td>
                <td className="px-4 py-3 text-gray-600">{formatDate(d.vencimento)}</td>
                <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[d.status] || ''}`}>{d.status}</span></td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => setModal(d)} className="text-gray-400 hover:text-brand"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => remove('despesas', d.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && <DespesaModal despesa={modal} onSave={handleSave} onClose={() => setModal(null)} />}
    </div>
  )
}

function DespesaModal({ despesa, onSave, onClose }) {
  const [form, setForm] = useState({
    descricao: despesa.descricao || '',
    categoria: despesa.categoria || 'Infraestrutura',
    fornecedor: despesa.fornecedor || '',
    valor: despesa.valor || '',
    vencimento: despesa.vencimento || new Date().toISOString().slice(0, 10),
    status: despesa.status || 'Em aberto',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ ...form, valor: parseFloat(form.valor) || 0 })
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="font-bold text-gray-800">{despesa.id ? 'Editar Despesa' : 'Nova Despesa'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <input type="text" required value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-brand" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <select value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-brand">
                {categorias.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fornecedor</label>
              <input type="text" value={form.fornecedor} onChange={e => setForm({...form, fornecedor: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-brand" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
              <input type="number" step="0.01" required value={form.valor} onChange={e => setForm({...form, valor: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-brand" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vencimento</label>
              <input type="date" required value={form.vencimento} onChange={e => setForm({...form, vencimento: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-brand" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-brand">
              {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">Cancelar</button>
            <button type="submit" className="px-4 py-2 text-sm bg-brand text-white rounded-lg font-semibold hover:bg-brand-dark">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  )
}
