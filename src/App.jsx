import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext.jsx'
import Layout from './components/Layout.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Receitas from './pages/Receitas.jsx'
import Despesas from './pages/Despesas.jsx'
import Parcelas from './pages/Parcelas.jsx'
import Clientes from './pages/Clientes.jsx'
import Lotes from './pages/Lotes.jsx'
import FluxoCaixa from './pages/FluxoCaixa.jsx'
import Relatorios from './pages/Relatorios.jsx'
import Calendario from './pages/Calendario.jsx'
import AnaliseIA from './pages/AnaliseIA.jsx'

function Protected({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/*"
        element={
          <Protected>
            <Layout />
          </Protected>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="receitas" element={<Receitas />} />
        <Route path="despesas" element={<Despesas />} />
        <Route path="parcelas" element={<Parcelas />} />
        <Route path="clientes" element={<Clientes />} />
        <Route path="lotes" element={<Lotes />} />
        <Route path="fluxo-caixa" element={<FluxoCaixa />} />
        <Route path="relatorios" element={<Relatorios />} />
        <Route path="calendario" element={<Calendario />} />
        <Route path="analise-ia" element={<AnaliseIA />} />
      </Route>
    </Routes>
  )
}
