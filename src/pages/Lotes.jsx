import { useState } from 'react'
import { useData } from '../contexts/DataContext.jsx'
import { Plus, Search, Pencil, Trash2, X } from 'lucide-react'

const statusOptions = ['Disponível', 'Reservado', 'Vendido']
const statusColors = {
  'Disponível': 'bg-green-100 text-green-700',
  'Reservado': 'bg-yellow-100 text-yellow-700',
  'Vendido': 'bg-blue-100 text-blue-700',
}

const formatBRL = (v) => (v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function Lotes() {
  const { lotes, clientes, add, update, remove } = useData()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [modal, setModal] = useState(null)

  const filtered = lotes.filter(l => {
    if (search && !l.identificador?.toLowerCase().includes(search.toLowerCase()) && !l.clienteNome?.toLowerCase().includes(search.toLowerCase())) return false
    if (filterStatus && l.status !== filterStatus) return false
    return true
  })

  const disponiveis = filtered.filter(l => l.status === 'Disponível').length
  const valorTotal = filtered.reduce((s, l) => s + (l.valorTotal || 0), 0)
  const areaTotal = filtered.reduce((s, l) => s + (l.area || 0), 0)

  const handleSave = (formData) => {
    if (modal?.id) update('lotes', modal.id, formData)
    else add('lotes', formData)
    setModal(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Lotes</h1>
          <p className="text-sm text-gray-500 mt-1">{disponiveis} disponível(eis) · {formatBRL(valorTotal)} em valor · {areaTotal} m²</p>
        </div>
        <button onClick={() => setModal({})} className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-dark flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Novo Lote
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Buscar por identificador ou cliente..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-brand" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand">
          <option value="">Todos status</option>
          {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 font-semibold text-gray-600">IDENTIFICADOR</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">ÁREA</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">VALOR TOTAL</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">R$/M²</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">CLIENTE</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">STATUS</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-gray-400">Nenhum lote encontrado</td></tr>
            ) : filtered.map(l => (
              <tr key={l.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{l.identificador}</td>
                <td className="px-4 py-3 text-gray-600">{l.area} m²</td>
                <td className="px-4 py-3 text-gray-800">{formatBRL(l.valorTotal)}</td>
                <td className="px-4 py-3 text-gray-600">{l.area ? formatBRL(l.valorTotal / l.area) : '-'}</td>
                <td className="px-4 py-3 text-gray-600">{l.clienteNome || '-'}</td>
                <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[l.status] || ''}`}>{l.status}</span></td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => setModal(l)} className="text-gray-400 hover:text-brand"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => remove('lotes', l.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && <LoteModal lote={modal} clientes={clientes} onSave={handleSave} onClose={() => setModal(null)} />}
    </div>
  )
}

function LoteModal({ lote, clientes, onSave, onClose }) {
  const [form, setForm] = useState({
    identificador: lote.identificador || '',
    area: lote.area || '',
    valorTotal: lote.valorTotal || '',
    clienteId: lote.clienteId || '',
    status: lote.status || 'Disponível',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...form,
      area: parseFloat(form.area) || 0,
      valorTotal: parseFloat(form.valorTotal) || 0,
      clienteNome: clientes.find(c => c.id === form.clienteId)?.nome || '',
    })
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="font-bold text-gray-800">{lote.id ? 'Editar Lote' : 'Novo Lote'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Identificador</label>
            <input type="text" required value={form.identificador} onChange={e => setForm({...form, identificador: e.target.value})} placeholder="Ex: Quadra A - Lote 01" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-brand" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Área (m²)</label>
              <input type="number" step="0.01" required value={form.area} onChange={e => setForm({...form, area: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-brand" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor Total (R$)</label>
              <input type="number" step="0.01" required value={form.valorTotal} onChange={e => setForm({...form, valorTotal: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-brand" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
              <select value={form.clienteId} onChange={e => setForm({...form, clienteId: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-brand">
                <option value="">Sem cliente</option>
                {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-brand">
                {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
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
