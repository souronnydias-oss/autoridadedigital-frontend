import { useEffect, useState } from 'react'
import { api } from '../api.js'

const PLATFORMS = ['instagram', 'linkedin', 'tiktok', 'facebook', 'whatsapp']

export default function PostsTab({ devs }) {
  const [posts, setPosts] = useState([])
  const [form, setForm] = useState({ development_id: '', platform: 'all', scheduled_at: '' })
  const [msg, setMsg] = useState('')

  const load = async () => {
    try { setPosts((await api.getPosts()).posts) } catch {}
  }
  useEffect(() => { load() }, [])

  const nowLocal = () => {
    const d = new Date(Date.now() + 60000)
    d.setSeconds(0, 0)
    const pad = n => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
  }

  const submit = async (e) => {
    e.preventDefault()
    setMsg('')
    try {
      const local = new Date(form.scheduled_at)
      const r = await api.createPosts({
        development_id: form.development_id || null,
        platform: form.platform,
        scheduled_at: local.toISOString()
      })
      setMsg(`Agendado: ${r.ids.length} post(s) para ${form.scheduled_at.replace('T', ' ')}`)
      setForm({ ...form, scheduled_at: '' })
      load()
    } catch (err) { setMsg(err.message) }
  }

  const remove = async (id) => {
    if (!confirm('Excluir este post?')) return
    await api.deletePost(id)
    load()
  }

  return (
    <>
      <div className="panel-head"><h2>Posts automáticos</h2></div>
      <form className="posts-form" onSubmit={submit}>
        <div className="row2">
          <select value={form.development_id} onChange={e => setForm({ ...form, development_id: e.target.value })}>
            <option value="">Sem empreendimento (post institucional)</option>
            {devs.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
          </select>
          <select value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })}>
            <option value="all">Todas as plataformas</option>
            {PLATFORMS.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
        <input type="datetime-local" required value={form.scheduled_at} min={nowLocal()}
          onChange={e => setForm({ ...form, scheduled_at: e.target.value })} />
        <button className="btn" type="submit">Gerar e agendar posts</button>
      </form>
      {msg && <p className="success">{msg}</p>}

      <div className="table" style={{ marginTop: '1rem' }}>
        {posts.map(p => (
          <div key={p.id} className="table-row" style={{ alignItems: 'flex-start' }}>
            <div className="lead-main">
              <strong>{p.platform}</strong>
              <span className="muted small">{(p.development_title || 'institucional')} · {new Date(p.scheduled_at).toLocaleString('pt-BR')}</span>
              <span className="muted small post-preview">{p.content}</span>
              {p.published_at && <span className="muted small">publicado em {new Date(p.published_at).toLocaleString('pt-BR')}</span>}
            </div>
            <span className={p.status === 'publicado' ? 'tag ok' : 'tag'}>{p.status}</span>
            {p.status === 'agendado' && (
              <button className="link-btn danger" onClick={() => remove(p.id)}>Excluir</button>
            )}
          </div>
        ))}
        {!posts.length && <p className="muted">Nenhum post agendado ainda.</p>}
      </div>
    </>
  )
}