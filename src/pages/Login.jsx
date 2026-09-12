import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, setToken } from '../api.js'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const r = await api.login(email, password)
      setToken(r.token)
      navigate('/admin')
    } catch (err) { setError(err.message) }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={submit}>
        <h1>Autoridade<strong>Digital</strong></h1>
        <p className="muted">Acesso a corretores e administradores</p>
        <input type="email" placeholder="E-mail" value={email} required onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Senha" value={password} required onChange={e => setPassword(e.target.value)} />
        {error && <p className="error">{error}</p>}
        <button className="btn" type="submit">Entrar</button>
        <p className="muted small">Demo: corretor@autoridadedigital.com / admin123</p>
      </form>
    </div>
  )
}