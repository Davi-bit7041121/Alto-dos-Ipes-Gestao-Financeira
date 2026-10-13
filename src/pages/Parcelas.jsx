import { useState } from 'react'
import { useData } from '../contexts/DataContext.jsx'
import { Plus, Search, Pencil, Trash2, X } from 'lucide-react'

const statusOptions = ['Em aberto', 'Pago', 'Vencido', 'Cancelado']
const statusColors = {
  'Pago': 'bg-green-100 text-green-700',
  'Em aberto': 'bg-yellow-100 text-yellow-700',
  'Vencido': 'bg-red-100 text-red-700',
  'Cancelado': 'bg-gray-100 text-gray-600',
}

const formatBRL = (v) => (v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const formatDate = (d) => d ? new Date(d).toLocaleDateString('pt-BR') : '-'

export default function Parcelas() {
  const { parcelas, clientes, lotes, add, update, remove } = useData()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [modal, setModal] = useState(null)

  const filtered = parcelas.filter(p => {
    if (search && !p.clienteNome?.toLowerCase().includes(search.toLowerCase()) && !p.loteIdentificador?.toLowerCase().includes(search.toLowerCase())) return false
    if (filterStatus && p.status !== filterStatus) return false
    return true
  })

  const aReceber = filtered.filter(p => p.status === 'Em aberto' || p.status === 'Vencido').reduce((s, p) => s + (p.valorParcela || 0) * (p.parcelasRestantes || 1), 0)

  const handleSave = (formData) => {
    if (modal?.id) update('parcelas', modal.id, formData)
    else add('parcelas', formData)
    setModal(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Parcelas</h1>
          <p className="text-sm text-gray-500 mt-1">{formatBRL(aReceber)} a receber · {filtered.length} financiamento(s)</p>
        </div>
        <button onClick={() => setModal({})} className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-dark flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Novo Financiamento
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Buscar por cliente ou lote..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-brand" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand">
          <option value="">Todos status</option>
          {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm py-16 text-center text-gray-400">Nenhum financiamento encontrado</div>
      ) : (
        <div className="space-y-3">
          {filtered.map(p => (
            <div key={p.id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800">{p.clienteNome || 'Sem cliente'}</h3>
                  <p className="text-sm text-gray-500">Lote: {p.loteIdentificador || '-'} · {p.totalParcelas || 0}x de {formatBRL(p.valorParcela)}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[p.status] || ''}`}>{p.status}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div><span className="text-gray-500">Valor Total: </span><span className="font-medium text-gray-800">{formatBRL(p.valorTotal)}</span></div>
                <div><span className="text-gray-500">Entrada: </span><span className="font-medium text-gray-800">{formatBRL(p.entrada)}</span></div>
                <div><span className="text-gray-500">Parcelas Pagas: </span><span className="font-medium text-gray-800">{p.parcelasPagas || 0}/{p.totalParcelas || 0}</span></div>
                <div><span className="text-gray-500">Próx. Vencimento: </span><span className="font-medium text-gray-800">{formatDate(p.proximoVencimento)}</span></div>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                <button onClick={() => setModal(p)} className="text-gray-400 hover:text-brand"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => remove('parcelas', p.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && <ParcelaModal parcela={modal} clientes={clientes} lotes={lotes} onSave={handleSave} onClose={() => setModal(null)} />}
    </div>
  )
}

function ParcelaModal({ parcela, clientes, lotes, onSave, onClose }) {
  const [form, setForm] = useState({
    clienteId: parcela.clienteId || '',
    loteId: parcela.loteId || '',
    valorTotal: parcela.valorTotal || '',
    entrada: parcela.entrada || '',
    totalParcelas: parcela.totalParcelas || '',
    parcelasPagas: parcela.parcelasPagas || 0,
    valorParcela: parcela.valorParcela || '',
    status: parcela.status || 'Em aberto',
    proximoVencimento: parcela.proximoVencimento || new Date().toISOString().slice(0, 10),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...form,
      valorTotal: parseFloat(form.valorTotal) || 0,
      entrada: parseFloat(form.entrada) || 0,
      totalParcelas: parseInt(form.totalParcelas) || 0,
      valorParcela: parseFloat(form.valorParcela) || 0,
      clienteNome: clientes.find(c => c.id === form.clienteId)?.nome || '',
      loteIdentificador: lotes.find(l => l.id === form.loteId)?.identificador || '',
    })
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="font-bold text-gray-800">{parcela.id ? 'Editar Financiamento' : 'Novo Financiamento'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
              <select required value={form.clienteId} onChange={e => setForm({...form, clienteId: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-brand">
                <option value="">Selecione...</option>
                {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lote</label>
              <select required value={form.loteId} onChange={e => setForm({...form, loteId: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-brand">
                <option value="">Selecione...</option>
                {lotes.map(l => <option key={l.id} value={l.id}>{l.identificador}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor Total (R$)</label>
              <input type="number" step="0.01" required value={form.valorTotal} onChange={e => setForm({...form, valorTotal: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-brand" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Entrada (R$)</label>
              <input type="number" step="0.01" value={form.entrada} onChange={e => setForm({...form, entrada: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-brand" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total de Parcelas</label>
              <input type="number" required value={form.totalParcelas} onChange={e => setForm({...form, totalParcelas: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-brand" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor da Parcela (R$)</label>
              <input type="number" step="0.01" required value={form.valorParcela} onChange={e => setForm({...form, valorParcela: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-brand" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-brand">
                {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Próx. Vencimento</label>
              <input type="date" value={form.proximoVencimento} onChange={e => setForm({...form, proximoVencimento: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-brand" />
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
