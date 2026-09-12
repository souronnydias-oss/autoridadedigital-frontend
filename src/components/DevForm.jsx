import { useState } from 'react'
import { api } from '../api.js'

const empty = { title: '', subtitle: '', description: '', price: '', location: '', status: 'disponivel', type: 'apartamento', featured: 0, published: 1, media: [] }

export default function DevForm({ initial, onSave, onCancel }) {
  const [d, setD] = useState(initial ? { ...empty, ...initial, media: initial.media || [] } : { ...empty })
  const [busy, setBusy] = useState(false)

  const addFiles = async (e) => {
    const files = [...e.target.files]
    setBusy(true)
    for (const f of files) {
      const r = await api.upload(f)
      setD(prev => ({ ...prev, media: [...prev.media, r] }))
    }
    setBusy(false)
    e.target.value = ''
  }

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try { await onSave(d) } finally { setBusy(false) }
  }

  return (
    <form className="modal" onSubmit={submit}>
      <div className="modal-body">
        <h3>{initial ? 'Editar empreendimento' : 'Novo empreendimento'}</h3>
        <label>Título *<input required value={d.title} onChange={e => setD({ ...d, title: e.target.value })} /></label>
        <label>Subtítulo<input value={d.subtitle} onChange={e => setD({ ...d, subtitle: e.target.value })} /></label>
        <label>Descrição<textarea rows={3} value={d.description} onChange={e => setD({ ...d, description: e.target.value })} /></label>
        <div className="row2">
          <label>Preço<input value={d.price} onChange={e => setD({ ...d, price: e.target.value })} /></label>
          <label>Localização<input value={d.location} onChange={e => setD({ ...d, location: e.target.value })} /></label>
        </div>
        <div className="row2">
          <label>Status
            <select value={d.status} onChange={e => setD({ ...d, status: e.target.value })}>
              {['disponivel', 'lançamento', 'em construção', 'vendido'].map(s => <option key={s}>{s}</option>)}
            </select>
          </label>
          <label>Tipo
            <select value={d.type} onChange={e => setD({ ...d, type: e.target.value })}>
              {['apartamento', 'casa', 'terreno', 'comercial', 'alto padrão'].map(s => <option key={s}>{s}</option>)}
            </select>
          </label>
        </div>
        <label className="check"><input type="checkbox" checked={!!d.featured} onChange={e => setD({ ...d, featured: e.target.checked ? 1 : 0 })} /> Destaque na landing</label>
        <label className="check"><input type="checkbox" checked={!!d.published} onChange={e => setD({ ...d, published: e.target.checked ? 1 : 0 })} /> Publicado na landing</label>

        <label>Fotos e vídeos
          <input type="file" accept="image/*,video/*" multiple disabled={busy} onChange={addFiles} />
        </label>
        {busy && <p className="muted">Enviando…</p>}
        <div className="media-list">
          {d.media.map((m, i) => (
            <div key={i} className="media-item">
              {m.type === 'video' ? <video src={m.url} muted /> : <img src={m.url} alt="" />}
              <button type="button" className="link-btn danger" onClick={() => setD({ ...d, media: d.media.filter((_, j) => j !== i) })}>remover</button>
            </div>
          ))}
        </div>

        <div className="modal-actions">
          <button type="button" className="btn ghost" onClick={onCancel}>Cancelar</button>
          <button className="btn" disabled={busy}>{initial ? 'Salvar' : 'Criar'}</button>
        </div>
      </div>
    </form>
  )
}