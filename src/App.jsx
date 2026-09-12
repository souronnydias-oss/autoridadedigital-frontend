import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom'
import { api, getToken, clearToken } from './api.js'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'

function Protected() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (!getToken()) { setLoading(false); return }
    api.me().then(r => setUser(r.user)).catch(() => clearToken()).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="center-msg">Carregando…</div>
  if (!user) return <Navigate to="/login" replace />
  return (
    <div className="app-shell">
      <header className="side-head">
        <Link to="/" className="brand">Autoridade<strong>Digital</strong></Link>
        <nav>
          <Link to="/admin">Painel</Link>
          <button
            onClick={() => { clearToken(); navigate('/login') }}
            className="link-btn">Sair</button>
        </nav>
      </header>
      <Dashboard user={user} />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<Protected />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}