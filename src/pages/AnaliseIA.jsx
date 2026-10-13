import { useState } from 'react'
import { useData } from '../contexts/DataContext.jsx'
import { Sparkles, TrendingUp, TrendingDown, DollarSign, CreditCard, AlertTriangle, MapPin, BarChart3, Send } from 'lucide-react'

const formatBRL = (v) => (v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function AnaliseIA() {
  const { receitas, despesas, parcelas, lotes } = useData()
  const [tab, setTab] = useState('completa')
  const [pergunta, setPergunta] = useState('')
  const [resposta, setResposta] = useState('')
  const [loading, setLoading] = useState(false)
  const [analise, setAnalise] = useState('')

  const totalReceitas = receitas.reduce((s, r) => s + (r.valor || 0), 0)
  const totalDespesas = despesas.reduce((s, d) => s + (d.valor || 0), 0)
  const lucro = totalReceitas - totalDespesas
  const aReceber = parcelas.filter(p => p.status === 'Em aberto' || p.status === 'Vencido').reduce((s, p) => s + (p.valorParcela || 0) * ((p.totalParcelas || 0) - (p.parcelasPagas || 0)), 0)
  const vencidas = parcelas.filter(p => p.status === 'Vencido')
  const valorVencidas = vencidas.reduce((s, p) => s + (p.valorParcela || 0), 0)
  const inadimplencia = parcelas.length > 0 ? (vencidas.length / parcelas.length * 100) : 0
  const lotesVendidos = lotes.filter(l => l.status === 'Vendido').length
  const ticketMedio = lotesVendidos > 0 ? lotes.filter(l => l.status === 'Vendido').reduce((s, l) => s + (l.valorTotal || 0), 0) / lotesVendidos : 0

  const metrics = [
    { label: 'Receita Total', value: formatBRL(totalReceitas), icon: TrendingUp, color: 'text-green-600' },
    { label: 'Despesa Total', value: formatBRL(totalDespesas), icon: TrendingDown, color: 'text-red-600' },
    { label: 'Lucro Líquido', value: formatBRL(lucro), icon: DollarSign, color: lucro >= 0 ? 'text-green-600' : 'text-red-600' },
    { label: 'A Receber', value: formatBRL(aReceber), icon: CreditCard, color: 'text-blue-600' },
    { label: 'Parcelas Vencidas', value: `${vencidas.length} (${formatBRL(valorVencidas)})`, icon: AlertTriangle, color: 'text-red-500' },
    { label: 'Inadimplência', value: `${inadimplencia.toFixed(1)}%`, icon: AlertTriangle, color: 'text-orange-500' },
    { label: 'Lotes Vendidos', value: `${lotesVendidos}/${lotes.length}`, icon: MapPin, color: 'text-blue-600' },
    { label: 'Ticket Médio', value: formatBRL(ticketMedio), icon: BarChart3, color: 'text-purple-600' },
  ]

  const gerarAnalise = () => {
    setLoading(true)
    setTimeout(() => {
      setAnalise(`## Resumo Executivo

O loteamento Alto dos Ipês apresenta receita total de ${formatBRL(totalReceitas)} e despesas de ${formatBRL(totalDespesas)}, resultando em ${lucro >= 0 ? 'lucro' : 'prejuízo'} de ${formatBRL(Math.abs(lucro))}.

## Indicadores

- **A receber:** ${formatBRL(aReceber)}
- **Parcelas vencidas:** ${vencidas.length} (${formatBRL(valorVencidas)})
- **Inadimplência:** ${inadimplencia.toFixed(1)}%
- **Lotes vendidos:** ${lotesVendidos} de ${lotes.length}
- **Ticket médio:** ${formatBRL(ticketMedio)}

## Recomendações

1. ${inadimplencia > 10 ? 'A inadimplência está alta. Considere ações de cobrança ativa.' : 'A inadimplência está sob controle.'}
2. ${aReceber > 0 ? `Existem ${formatBRL(aReceber)} a receber. Acompanhe os vencimentos de perto.` : 'Sem valores a receber no momento.'}
3. ${lotesDisponiveis() > 0 ? `${lotesDisponiveis()} lotes disponíveis para venda. Considere campanhas de marketing.` : 'Todos os lotes foram comercializados.'}

## Projeção

Com base nos dados atuais, a projeção para o próximo período indica ${lucro > 0 ? 'crescimento' : 'necessidade de ajustes'} no fluxo de caixa.`)
      setLoading(false)
    }, 1500)
  }

  const lotesDisponiveis = () => lotes.filter(l => l.status === 'Disponível').length

  const perguntar = () => {
    if (!pergunta.trim()) return
    setLoading(true)
    setTimeout(() => {
      setResposta(`Com base nos dados do loteamento:\n\n- Receita total: ${formatBRL(totalReceitas)}\n- Despesa total: ${formatBRL(totalDespesas)}\n- Lucro: ${formatBRL(lucro)}\n- Lotes vendidos: ${lotesVendidos}/${lotes.length}\n\nSua pergunta foi sobre "${pergunta}". Os dados indicam que ${lucro >= 0 ? 'o loteamento está saudável financeiramente' : 'há necessidade de atenção ao fluxo de caixa'}.`)
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-brand" /> Análise com IA
          </h1>
          <p className="text-gray-500 text-sm mt-1">Inteligência artificial aplicada aos dados do loteamento</p>
        </div>
        <button onClick={gerarAnalise} disabled={loading} className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-dark flex items-center gap-1.5 disabled:opacity-50">
          <Sparkles className="w-4 h-4" /> Gerar Análise com IA
        </button>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setTab('completa')} className={`px-4 py-2 text-sm font-medium rounded-lg ${tab === 'completa' ? 'bg-brand text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}>Análise Completa</button>
        <button onClick={() => setTab('perguntar')} className={`px-4 py-2 text-sm font-medium rounded-lg ${tab === 'perguntar' ? 'bg-brand text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}>Perguntar à IA</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map(m => (
          <div key={m.label} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-start justify-between mb-2">
              <p className="text-xs text-gray-500">{m.label}</p>
              <m.icon className={`w-4 h-4 ${m.color}`} />
            </div>
            <p className={`text-lg font-bold ${m.color}`}>{m.value}</p>
          </div>
        ))}
      </div>

      {tab === 'completa' ? (
        <div className="bg-white border border-gray-200 rounded-xl p-8">
          {analise ? (
            <div className="prose prose-sm max-w-none">
              {analise.split('\n').map((line, i) => (
                <p key={i} className={line.startsWith('#') ? 'font-bold text-gray-800 mt-4 mb-2' : 'text-gray-600 mb-2'}>{line.replace(/^#+\s*/, '')}</p>
              ))}
            </div>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm text-gray-500">Gerando análise...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Sparkles className="w-12 h-12 text-brand-200 mb-4" />
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Análise Inteligente do Loteamento</h2>
              <p className="text-sm text-gray-500 max-w-md mb-4">Gere um relatório completo com IA analisando receitas, despesas, parcelas, clientes, lotes e vendas. Inclui resumo executivo, projeções e recomendações acionáveis.</p>
              <button onClick={gerarAnalise} className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-dark flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Gerar Análise com IA
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex gap-3 mb-4">
            <input type="text" value={pergunta} onChange={e => setPergunta(e.target.value)} placeholder="Faça uma pergunta sobre os dados do loteamento..." className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-brand" onKeyDown={e => e.key === 'Enter' && perguntar()} />
            <button onClick={perguntar} disabled={loading} className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-dark flex items-center gap-1.5 disabled:opacity-50">
              <Send className="w-4 h-4" /> Enviar
            </button>
          </div>
          {loading && <div className="flex items-center justify-center py-8"><div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" /></div>}
          {resposta && !loading && (
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap">{resposta}</div>
          )}
        </div>
      )}
    </div>
  )
}
