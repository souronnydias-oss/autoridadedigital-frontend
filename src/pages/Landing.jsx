import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import Carousel from '../components/Carousel.jsx'

export default function Landing() {
  const [data, setData] = useState({ broker: null, developments: [] })
  const [lead, setLead] = useState({ name: '', phone: '', whatsapp: '', email: '', message: '', development_id: '' })
  const [sent, setSent] = useState(false)

  useEffect(() => { api.public_().then(setData).catch(() => {}) }, [])

  const submit = async (e) => {
    e.preventDefault()
    await api.createLead(lead)
    setSent(true)
  }

  const { broker, developments } = data
  const featured = developments.filter(d => d.featured)

  return (
    <div className="landing">
      <header className="land-nav">
        <span className="brand">Autoridade<strong>Digital</strong></span>
        <Link to="/login" className="staff-link">Área restrita</Link>
      </header>

      <section className="hero">
        <div className="hero-info">
          <span className="tagline">Imóveis que valorizam sua vida</span>
          <h1>{broker?.name || 'Corretor de Imóveis'}</h1>
          <p>{broker?.about}</p>
          {broker?.instagram && <p className="insta">{broker.instagram}</p>}
          <div className="hero-cta">
            <a className="btn" href={`https://wa.me/${(broker?.whatsapp || '').replace(/\D/g, '')}`} target="_blank" rel="noreferrer">Chamar no WhatsApp</a>
          </div>
        </div>
        {broker?.photo && <div className="hero-photo"><img src={broker.photo} alt={broker.name} /></div>}
      </section>

      <section className="showcase">
        <h2>Destaques</h2>
        <div className="showcase-carousel">
          {featured.length ? (
            <div className="featured-grid">
              {featured.map(d => (
                <article key={d.id} className="dev-card">
                  <Carousel media={d.media} />
                  <div className="dev-body">
                    <span className="dev-status">{d.status}</span>
                    <h3>{d.title}</h3>
                    <p className="dev-sub">{d.subtitle}</p>
                    <p className="dev-desc">{d.description}</p>
                    <p className="dev-meta">{d.location}{d.price ? ` · ${d.price}` : ''}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : <p className="muted">Em breve, novidades em alta.</p>}
        </div>
      </section>

      <section className="catalog">
        <h2>Empreendimentos</h2>
        <div className="dev-grid">
          {developments.map(d => (
            <article key={d.id} className="dev-card">
              <Carousel media={d.media} />
              <div className="dev-body">
                <span className="dev-status">{d.status}</span>
                <h3>{d.title}</h3>
                <p className="dev-sub">{d.subtitle}</p>
                <p className="dev-meta">{d.location}{d.price ? ` · ${d.price}` : ''}</p>
              </div>
            </article>
          ))}
          {!developments.length && <p className="muted">Portfólio em construção.</p>}
        </div>
      </section>

      <section className="contact" id="contato">
        <h2>Quero saber mais</h2>
        {sent ? (
          <p className="success">Recebido! {broker?.name || 'O corretor'} vai entrar em contato em breve.</p>
        ) : (
          <form className="lead-form" onSubmit={submit}>
            <input required placeholder="Seu nome" value={lead.name}
              onChange={e => setLead({ ...lead, name: e.target.value })} />
            <input required placeholder="Telefone / WhatsApp" value={lead.phone}
              onChange={e => setLead({ ...lead, phone: e.target.value })} />
            <input placeholder="E-mail (opcional)" value={lead.email}
              onChange={e => setLead({ ...lead, email: e.target.value })} />
            <select value={lead.development_id} onChange={e => setLead({ ...lead, development_id: e.target.value })}>
              <option value="">Tenho interesse em…</option>
              {developments.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
            </select>
            <textarea placeholder="Mensagem (opcional)" rows={3} value={lead.message}
              onChange={e => setLead({ ...lead, message: e.target.value })} />
            <button className="btn" type="submit">Enviar</button>
          </form>
        )}
        {broker?.whatsapp && (
          <p className="muted">Prefere direto? <a href={`https://wa.me/${broker.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">WhatsApp {broker.whatsapp}</a></p>
        )}
      </section>

      <footer className="land-nav">Autoridade Digital · Captação de leads para corretores</footer>
    </div>
  )
}