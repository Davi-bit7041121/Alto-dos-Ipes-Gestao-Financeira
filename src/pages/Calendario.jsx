import { useState } from 'react'
import { useData } from '../contexts/DataContext.jsx'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const monthNames = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']

export default function Calendario() {
  const { receitas, despesas, parcelas } = useData()
  const [current, setCurrent] = useState(new Date(2026, 9, 13)) // October 2026
  const [selectedDay, setSelectedDay] = useState(null)

  const year = current.getFullYear()
  const month = current.getMonth()
  const today = new Date()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const events = []
  despesas.forEach(d => {
    if (d.vencimento) {
      const dt = new Date(d.vencimento)
      if (dt.getFullYear() === year && dt.getMonth() === month) {
        events.push({ day: dt.getDate(), type: 'despesa', title: d.descricao, valor: d.valor, status: d.status })
      }
    }
  })
  parcelas.forEach(p => {
    if (p.proximoVencimento) {
      const dt = new Date(p.proximoVencimento)
      if (dt.getFullYear() === year && dt.getMonth() === month) {
        events.push({ day: dt.getDate(), type: 'parcela', title: `Parcela - ${p.clienteNome || ''}`, valor: p.valorParcela, status: p.status })
      }
    }
  })
  receitas.forEach(r => {
    if (r.data) {
      const dt = new Date(r.data)
      if (dt.getFullYear() === year && dt.getMonth() === month) {
        events.push({ day: dt.getDate(), type: 'receita', title: r.descricao, valor: r.valor })
      }
    }
  })

  const eventsByDay = {}
  events.forEach(e => {
    if (!eventsByDay[e.day]) eventsByDay[e.day] = []
    eventsByDay[e.day].push(e)
  })

  const monthEvents = events

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const prevMonth = () => setCurrent(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrent(new Date(year, month + 1, 1))

  const isToday = (d) => d && today.getDate() === d && today.getMonth() === month && today.getFullYear() === year

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Calendário Financeiro</h1>
        <p className="text-gray-500 text-sm mt-1">Contas a pagar e parcelas vencendo</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-700 capitalize">{monthNames[month]} de {year}</h2>
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-gray-100"><ChevronLeft className="w-5 h-5 text-gray-500" /></button>
              <button onClick={() => setCurrent(new Date())} className="px-3 py-1 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">Hoje</button>
              <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-gray-100"><ChevronRight className="w-5 h-5 text-gray-500" /></button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(d => <div key={d} className="text-center text-xs font-medium text-gray-500 py-2">{d}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((d, i) => (
              <button
                key={i}
                onClick={() => d && setSelectedDay(d)}
                className={`aspect-square rounded-lg text-sm flex flex-col items-center justify-center relative transition-colors ${
                  !d ? 'opacity-0' : isToday(d) ? 'border-2 border-brand' : 'border border-gray-100 hover:bg-gray-50'
                } ${selectedDay === d ? 'bg-brand-50' : ''}`}
              >
                {d && (
                  <>
                    <span className={`font-medium ${isToday(d) ? 'text-brand' : 'text-gray-700'}`}>{d}</span>
                    {eventsByDay[d] && <div className="flex gap-0.5 mt-1">{eventsByDay[d].slice(0, 3).map((e, j) => <div key={j} className={`w-1.5 h-1.5 rounded-full ${e.type === 'despesa' ? 'bg-red-400' : e.type === 'receita' ? 'bg-green-400' : 'bg-orange-400'}`} />)}</div>}
                  </>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="font-semibold text-gray-700 mb-4 capitalize">Eventos - {monthNames[month]}</h2>
          {monthEvents.length === 0 ? (
            <p className="text-center text-gray-400 py-8">Nenhum evento neste mês</p>
          ) : (
            <div className="space-y-3">
              {monthEvents.map((e, i) => (
                <div key={i} className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-1.5 ${e.type === 'despesa' ? 'bg-red-400' : e.type === 'receita' ? 'bg-green-400' : 'bg-orange-400'}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">Dia {e.day} - {e.title}</p>
                    <p className={`text-xs ${e.type === 'despesa' ? 'text-red-500' : 'text-green-500'}`}>
                      {e.valor?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                    {e.status && <span className="text-xs text-gray-400">{e.status}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
