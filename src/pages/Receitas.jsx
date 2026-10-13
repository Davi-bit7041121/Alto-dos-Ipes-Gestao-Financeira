import { useState } from 'react'
import { useData } from '../contexts/DataContext.jsx'
import { Plus, Search, Pencil, Trash2, X } from 'lucide-react'

const categorias = ['Venda de lote', 'Entrada', 'Juros', 'Multa', 'Outros']
const formas = ['Pix', 'Boleto', 'Cartão', 'Dinheiro', 'Transferência']

const formatBRL = (v) => (v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const formatDate = (d) => d ? new Date(d).toLocaleDateString('pt-BR') : '-'

export default function Receitas() {
  const { receitas, clientes, lotes, add, update, remove } = useData()
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('')
  const [filterForma, setFilterForma] = useState('')
  const [modal, setModal] = useState(null)

  const filtered = receitas.filter(r => {
    if (search && !r.descricao?.toLowerCase().includes(search.toLowerCase())) return false
    if (filterCat && r.categoria !== filterCat) return false
    if (filterForma && r.formaPagamento !== filterForma) return false
    return true
  })

  const totalFiltrado = filtered.reduce((s, r) => s + (r.valor || 0), 0)

  const handleSave = (formData) => {
    if (modal?.id) {
      update('receitas', modal.id, formData)
    } else {
      add('receitas', formData)
    }
    setModal(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Receitas</h1>
          <p className="text-sm text-gray-500 mt-1">{formatBRL(totalFiltrado)} no total filtrado</p>
        </div>
        <button onClick={() => setModal({})} className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-dark flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Nova Receita
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por descrição..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-brand"
          />
        </div>
        <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand">
          <option value="">Todas categorias</option>
          {categorias.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterForma} onChange={(e) => setFilterForma(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand">
          <option value="">Todas formas</option>
          {formas.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 font-semibold text-gray-600">DESCRIÇÃO</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">CLIENTE</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">LOTE</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">CATEGORIA</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">VALOR</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">DATA</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">PAGAMENTO</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-12 text-gray-400">Nenhuma receita encontrada</td></tr>
            ) : filtered.map(r => (
              <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-800">{r.descricao}</td>
                <td className="px-4 py-3 text-gray-600">{r.clienteNome || '-'}</td>
                <td className="px-4 py-3 text-gray-600">{r.loteIdentificador || '-'}</td>
                <td className="px-4 py-3 text-gray-600">{r.categoria}</td>
                <td className="px-4 py-3 font-medium text-green-600">{formatBRL(r.valor)}</td>
                <td className="px-4 py-3 text-gray-600">{formatDate(r.data)}</td>
                <td className="px-4 py-3 text-gray-600">{r.formaPagamento}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => setModal(r)} className="text-gray-400 hover:text-brand"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => remove('receitas', r.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && <ReceitaModal receita={modal} clientes={clientes} lotes={lotes} onSave={handleSave} onClose={() => setModal(null)} />}
    </div>
  )
}

function ReceitaModal({ receita, clientes, lotes, onSave, onClose }) {
  const [form, setForm] = useState({
    descricao: receita.descricao || '',
    clienteId: receita.clienteId || '',
    loteId: receita.loteId || '',
    categoria: receita.categoria || 'Venda de lote',
    valor: receita.valor || '',
    data: receita.data || new Date().toISOString().slice(0, 10),
    formaPagamento: receita.formaPagamento || 'Pix',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...form,
      valor: parseFloat(form.valor) || 0,
      clienteNome: clientes.find(c => c.id === form.clienteId)?.nome || '',
      loteIdentificador: lotes.find(l => l.id === form.loteId)?.identificador || '',
    })
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="font-bold text-gray-800">{receita.id ? 'Editar Receita' : 'Nova Receita'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <input type="text" required value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-brand" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
              <select value={form.clienteId} onChange={e => setForm({...form, clienteId: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-brand">
                <option value="">Selecione...</option>
                {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lote</label>
              <select value={form.loteId} onChange={e => setForm({...form, loteId: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-brand">
                <option value="">Selecione...</option>
                {lotes.map(l => <option key={l.id} value={l.id}>{l.identificador}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <select value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-brand">
                {categorias.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Forma de Pagamento</label>
              <select value={form.formaPagamento} onChange={e => setForm({...form, formaPagamento: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-brand">
                {formas.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
              <input type="number" step="0.01" required value={form.valor} onChange={e => setForm({...form, valor: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-brand" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
              <input type="date" required value={form.data} onChange={e => setForm({...form, data: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-brand" />
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
