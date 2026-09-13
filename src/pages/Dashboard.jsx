import { useCallback, useEffect, useState } from 'react'
import { api } from '../api.js'
import DevForm from '../components/DevForm.jsx'
import PostsTab from '../components/PostsTab.jsx'

export default function Dashboard({ user }) {
  const [tab, setTab] = useState('devs')
  const [devs, setDevs] = useState([])
  const [leads, setLeads] = useState([])
  const [profile, setProfile] = useState({ name: user.name, whatsapp: user.whatsapp || '', instagram: user.instagram || '', about: user.about || '', photo: user.photo || '' })
  const [editing, setEditing] = useState(null)
  const [saved, setSaved] = useState('')

  const load = useCallback(async () => {
    try {
      const [dr, lr] = await Promise.all([api.getDevelopments(), api.getLeads()])
      setDevs(dr.developments)
      setLeads(lr.leads)
    } catch {}
  }, [])

  useEffect(() => { load() }, [load])

  const flash = (msg) => { setSaved(msg); setTimeout(() => setSaved(''), 2500) }

  const saveDev = async (d) => {
    if (editing) await api.updateDevelopment(editing.id, d)
    else await api.createDevelopment(d)
    setEditing(null)
    await load()
    flash('Empreendimento salvo')
  }

  const removeDev = async (id) => {
    if (!confirm('Excluir este empreendimento?')) return
    await api.deleteDevelopment(id)
    await load()
    flash('Removido')
  }

  const setStatus = async (id, status) => {
    await api.setLeadStatus(id, status)
    await load()
  }

  const saveProfile = async (e) => {
    e.preventDefault()
    await api.updateProfile(profile)
    flash('Perfil atualizado')
  }

  const uploadPhoto = async (e) => {
    const r = await api.upload(e.target.files[0])
    setProfile({ ...profile, photo: r.url })
    e.target.value = ''
  }

  return (
    <main className="dash">
      <aside className="tabs">
        <button className={tab === 'devs' ? 'tab on' : 'tab'} onClick={() => setTab('devs')}>Empreendimentos</button>
        <button className={tab === 'leads' ? 'tab on' : 'tab'} onClick={() => setTab('leads')}>Leads {leads.length ? `(${leads.length})` : ''}</button>
        <button className={tab === 'posts' ? 'tab on' : 'tab'} onClick={() => setTab('posts')}>Postagens</button>
        <button className={tab === 'profile' ? 'tab on' : 'tab'} onClick={() => setTab('profile')}>Meu perfil</button>
        <span className="role">{user.role === 'admin' ? 'Administrador' : 'Corretor'}</span>
      </aside>

      <section className="panel">
        {saved && <p className="success toast">{saved}</p>}

        {tab === 'devs' && (
          <>
            <div className="panel-head">
              <h2>Empreendimentos</h2>
              <button className="btn" onClick={() => setEditing({})}>+ Novo</button>
            </div>
            <div className="table">
              {devs.map(d => (
                <div key={d.id} className="table-row">
                  <div className="thumb">
                    {d.media[0]
                      ? (d.media[0].type === 'video' ? <video src={d.media[0].url} muted /> : <img src={d.media[0].url} alt="" />)
                      : <span>—</span>}
                  </div>
                  <div className="th-title">
                    <strong>{d.title}</strong>
                    <span>{(d.published ? 'Publicado' : 'Rascunho')} · {d.status} · {d.media.length} mídia(s)</span>
                  </div>
                  <div className="th-actions">
                    <button className="link-btn" onClick={() => setEditing(d)}>Editar</button>
                    <button className="link-btn danger" onClick={() => removeDev(d.id)}>Excluir</button>
                  </div>
                </div>
              ))}
              {!devs.length && <p className="muted">Nenhum empreendimento ainda.</p>}
            </div>
          </>
        )}

        {tab === 'leads' && (
          <>
            <div className="panel-head"><h2>Leads captados</h2></div>
            <div className="table">
              {leads.map(l => (
                <div key={l.id} className="table-row lead">
                  <div className="lead-main">
                    <strong>{l.name}</strong>
                    <span>{l.phone}{l.whatsapp ? ` · ${l.whatsapp}` : ''}{l.email ? ` · ${l.email}` : ''}</span>
                    <span className="muted">{l.development_title || 'Contato geral'}{l.message ? ` — ${l.message}` : ''}</span>
                    <span className="muted small">recebido em {l.created_at}</span>
                  </div>
                  <select className="status" value={l.status} onChange={e => setStatus(l.id, e.target.value)}>
                    {['novo', 'contatado', 'interessado', 'convertido', 'descartado'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              ))}
              {!leads.length && <p className="muted">Nenhum lead ainda.</p>}
            </div>
          </>
        )}

        {tab === 'posts' && (
          <PostsTab devs={devs} />
        )}

        {tab === 'profile' && (
          <form className="profile-form" onSubmit={saveProfile}>
            <h2>Perfil visível na landing</h2>
            {profile.photo && <img className="prof-photo" src={profile.photo} alt="foto" />}
            <label>Foto
              <input type="file" accept="image/*" onChange={uploadPhoto} />
            </label>
            <label>Nome<input required value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} /></label>
            <label>WhatsApp (código + número, ex: 5511999999999)
              <input value={profile.whatsapp} onChange={e => setProfile({ ...profile, whatsapp: e.target.value })} /></label>
            <label>Instagram<input value={profile.instagram} onChange={e => setProfile({ ...profile, instagram: e.target.value })} /></label>
            <label>Biografia<textarea rows={4} value={profile.about} onChange={e => setProfile({ ...profile, about: e.target.value })} /></label>
            <button className="btn" type="submit">Salvar perfil</button>
          </form>
        )}
      </section>

      {editing && (
        <DevForm
          initial={editing.id ? editing : null}
          onSave={saveDev}
          onCancel={() => setEditing(null)} />
      )}
    </main>
  )
}