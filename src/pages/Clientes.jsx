import { useState } from 'react'
import { useData } from '../contexts/DataContext.jsx'
import { Plus, Search, Pencil, Trash2, X, Phone, Mail, MapPin } from 'lucide-react'

export default function Clientes() {
  const { clientes, add, update, remove } = useData()
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)

  const filtered = clientes.filter(c => {
    if (!search) return true
    const s = search.toLowerCase()
    return c.nome?.toLowerCase().includes(s) || c.email?.toLowerCase().includes(s) || c.cpfCnpj?.toLowerCase().includes(s) || c.telefone?.toLowerCase().includes(s)
  })

  const handleSave = (formData) => {
    if (modal?.id) update('clientes', modal.id, formData)
    else add('clientes', formData)
    setModal(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Clientes</h1>
          <p className="text-sm text-gray-500 mt-1">{filtered.length} cadastrado(s)</p>
        </div>
        <button onClick={() => setModal({})} className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-dark flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Novo Cliente
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Buscar por nome, e-mail, CPF/CNPJ ou telefone..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-brand" />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl py-16 text-center text-gray-400">Nenhum cliente encontrado</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(c => (
            <div key={c.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand font-semibold">
                    {c.nome?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{c.nome}</h3>
                    <p className="text-xs text-gray-500">{c.cpfCnpj || '-'}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setModal(c)} className="text-gray-400 hover:text-brand"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => remove('clientes', c.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="space-y-1.5 text-sm text-gray-600">
                {c.email && <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-gray-400" /> {c.email}</div>}
                {c.telefone && <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-gray-400" /> {c.telefone}</div>}
                {c.endereco && <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-gray-400" /> {c.endereco}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && <ClienteModal cliente={modal} onSave={handleSave} onClose={() => setModal(null)} />}
    </div>
  )
}

function ClienteModal({ cliente, onSave, onClose }) {
  const [form, setForm] = useState({
    nome: cliente.nome || '',
    cpfCnpj: cliente.cpfCnpj || '',
    email: cliente.email || '',
    telefone: cliente.telefone || '',
    endereco: cliente.endereco || '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(form)
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="font-bold text-gray-800">{cliente.id ? 'Editar Cliente' : 'Novo Cliente'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome / Razão Social</label>
            <input type="text" required value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-brand" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CPF / CNPJ</label>
            <input type="text" value={form.cpfCnpj} onChange={e => setForm({...form, cpfCnpj: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-brand" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-brand" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
              <input type="text" value={form.telefone} onChange={e => setForm({...form, telefone: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-brand" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
            <input type="text" value={form.endereco} onChange={e => setForm({...form, endereco: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-brand" />
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
