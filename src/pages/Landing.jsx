import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import Carousel from '../components/Carousel.jsx'

const WA_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.52 3.48A11.94 11.94 0 0 0 12.06 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.14 1.6 5.94L0 24l6.32-1.66a11.9 11.9 0 0 0 5.74 1.47h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.45-8.43ZM12.07 21.3h-.01a9.9 9.9 0 0 1-5.05-1.38l-.36-.22-3.75.98 1-3.65-.24-.38a9.87 9.87 0 0 1-1.52-5.25c0-5.46 4.45-9.9 9.93-9.9 2.65 0 5.14 1.03 7.01 2.9a9.83 9.83 0 0 1 2.9 7.02c0 5.46-4.45 9.9-9.91 9.9Zm5.44-7.42c-.3-.15-1.76-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.21 5.1 4.5.71.31 1.27.5 1.7.64.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35Z"/>
  </svg>
)

function FeaturedSlider({ devs, wa }) {
  const [idx, setIdx] = useState(0)
  const n = devs.length
  useEffect(() => {
    if (!n) return
    const t = setInterval(() => setIdx(i => (i + 1) % n), 6000)
    return () => clearInterval(t)
  }, [n])

  if (!n) return null
  const prev = () => setIdx(i => (i - 1 + n) % n)
  const next = () => setIdx(i => (i + 1) % n)
  const waLink = (msg) => `https://wa.me/${wa}?text=${encodeURIComponent(msg)}`

  return (
    <div className="feat">
      <div className="feat__track">
        {devs.map((d, i) => (
          <div key={d.id} className={i === idx ? 'feat__slide is-active' : 'feat__slide'}>
            {d.media[0]?.type === 'video'
              ? <video src={d.media[0].url} autoPlay muted loop playsInline />
              : d.media[0]?.url
                ? <img src={d.media[0].url} alt={d.title} loading="lazy" />
                : <div className="feat__ph" />}
            <div className="feat__caption">
              <span className="feat__status">{d.status}</span>
              <h3>{d.title}</h3>
              <p>{d.subtitle}</p>
              <p className="feat__meta">{d.location}{d.price ? ` · ${d.price}` : ''}</p>
              {wa && (
                <a className="btn btn--primary btn--sm" target="_blank" rel="noreferrer"
                  href={waLink(`Olá! Tenho interesse no empreendimento *${d.title}*.`)}>
                  {WA_ICON} Quero saber mais
                </a>
              )}
            </div>
          </div>
        ))}
        <button className="feat__btn feat__btn--prev" onClick={prev} aria-label="Anterior">‹</button>
        <button className="feat__btn feat__btn--next" onClick={next} aria-label="Próximo">›</button>
      </div>
      <div className="feat__dots">
        {devs.map((_, i) => <button key={i} onClick={() => setIdx(i)} aria-label={`Slide ${i + 1}`} className={i === idx ? 'feat__dot is-active' : 'feat__dot'} />)}
      </div>
    </div>
  )
}

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
  const heroBg = featured.flatMap(d => d.media).find(m => m?.type === 'image')?.url || developments.flatMap(d => d.media).find(m => m?.type === 'image')?.url
  const wa = (broker?.whatsapp || '').replace(/\D/g, '')
  const waLink = (msg) => `https://wa.me/${wa}?text=${encodeURIComponent(msg)}`

  return (
    <div className="landing">
      <header className="nav">
        <div className="nav__inner">
          <Link to="/" className="nav__brand">
            <span className="nav__dot" />
            <span className="nav__name">Autoridade<em>Digital</em></span>
          </Link>
          <nav className="nav__links">
            <a href="#empreendimentos">Empreendimentos</a>
            <a href="#sobre">Sobre</a>
            <a href="#contato">Contato</a>
          </nav>
          {wa && (
            <a href={waLink('Olá! Vim pelo site e gostaria de falar sobre imóveis.')} target="_blank" rel="noreferrer" className="nav__cta">
              {WA_ICON} Falar no WhatsApp
            </a>
          )}
        </div>
      </header>

      <section className="hero" style={heroBg ? { backgroundImage: `linear-gradient(160deg,rgba(18,22,34,.88) 0%,rgba(18,22,34,.55) 45%,rgba(18,22,34,.92) 100%), url(${heroBg})` } : undefined}>
        <div className="hero__content">
          <span className="hero__eyebrow">{broker?.instagram || 'Corretor de imóveis · Atendimento personalizado'}</span>
          <h1 className="hero__title">Seu próximo <em>endereço</em> começa aqui.</h1>
          <p className="hero__subtitle">{broker?.about || 'Assessoria completa na compra, venda e locação de imóveis. Atendimento discreto, personalizado e com o cuidado que o seu patrimônio merece.'}</p>
          <div className="hero__cta">
            {wa && (
              <a href={waLink('Olá, vim pelo site e gostaria de conversar sobre imóveis.')} target="_blank" rel="noreferrer" className="btn btn--primary">
                {WA_ICON} Fale comigo agora
              </a>
            )}
            <a href="#empreendimentos" className="btn btn--ghost">Ver empreendimentos</a>
          </div>
        </div>
      </section>

      <section className="carousel-section">
        <div className="section__head">
          <span className="eyebrow">Portfólio selecionado</span>
          <h2>Empreendimentos em destaque</h2>
          <p>Uma curadoria de imóveis exclusivos, escolhidos a dedo para clientes exigentes.</p>
        </div>
        <FeaturedSlider devs={featured} wa={wa} />
        {!featured.length && <p className="muted txt-center">Em breve, novidades em alta.</p>}
      </section>

      <section className="catalog">
        <div className="section__head">
          <span className="eyebrow">Catálogo completo</span>
          <h2>Todos os empreendimentos</h2>
        </div>
        <div className="dev-grid">
          {developments.map(d => (
            <article key={d.id} className="dev-card">
              <Carousel media={d.media} />
              <div className="dev-body">
                <span className="dev-status">{d.status}</span>
                <h3>{d.title}</h3>
                <p className="dev-sub">{d.subtitle}</p>
                <p className="dev-desc">{d.description}</p>
                <p className="dev-meta">{d.location}{d.price ? ` · ${d.price}` : ''}</p>
                {wa && (
                  <a className="btn btn--primary btn--sm" target="_blank" rel="noreferrer"
                    href={waLink(`Olá! Tenho interesse no empreendimento *${d.title}*.`)}>
                    {WA_ICON} Quero saber mais
                  </a>
                )}
              </div>
            </article>
          ))}
          {!developments.length && <p className="muted txt-center">Portfólio em construção.</p>}
        </div>
      </section>

      <section className="about" id="sobre">
        <div className="about__grid">
          <div className="about__text">
            <span className="eyebrow">Sobre</span>
            <h2>Mais que imóveis, <em>relações de confiança</em>.</h2>
            <p>{broker?.about || 'Cada negociação carrega histórias, expectativas e sonhos — e o papel do corretor é conduzir cada etapa com transparência, técnica e proximidade.'}</p>
            <ul className="about__list">
              <li><strong>Curadoria</strong> — Portfólio exclusivo, escolhido a dedo para cada perfil.</li>
              <li><strong>Dedicação</strong> — Atendimento de qualidade, do primeiro contato à chave.</li>
              <li><strong>Rede</strong> — Parceiros jurídicos e financeiros à disposição.</li>
            </ul>
            {wa && (
              <a href={waLink('Olá! Gostaria de agendar uma conversa sobre imóveis.')} target="_blank" rel="noreferrer" className="btn btn--primary">
                {WA_ICON} Agendar conversa
              </a>
            )}
          </div>
          <div className="about__badge">
            <div className="badge-card">
              <span className="badge-card__label">Empreendimentos</span>
              <span className="badge-card__number">{developments.length}</span>
              <span className="badge-card__foot">no portfólio</span>
            </div>
          </div>
        </div>
      </section>

      <section className="contact" id="contato">
        <div className="section__head">
          <span className="eyebrow">Contato</span>
          <h2>Vamos conversar</h2>
          <p>Deixe seus dados e receba atendimento personalizado o mais rápido possível.</p>
        </div>
        <div className="contact__cards">
          {wa && (
            <a href={waLink('Olá! Vim pelo site.')} target="_blank" rel="noreferrer" className="contact__card">
              <span className="contact__icon">{WA_ICON}</span>
              <span className="contact__label">WhatsApp</span>
              <span className="contact__value">{broker.whatsapp}</span>
            </a>
          )}
          {wa && (
            <a href={`tel:+${wa}`} className="contact__card">
              <span className="contact__icon">📞</span>
              <span className="contact__label">Telefone</span>
              <span className="contact__value">{broker.whatsapp}</span>
            </a>
          )}
          {broker?.instagram && (
            <a href={`https://instagram.com/${broker.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="contact__card">
              <span className="contact__icon">⟠</span>
              <span className="contact__label">Instagram</span>
              <span className="contact__value">{broker.instagram}</span>
            </a>
          )}
        </div>

        {sent ? (
          <p className="success txt-center lead-done">Recebido! {broker?.name || 'O corretor'} vai entrar em contato em breve.</p>
        ) : (
          <form className="lead-form" onSubmit={submit}>
            <input required placeholder="Seu nome" value={lead.name} onChange={e => setLead({ ...lead, name: e.target.value })} />
            <input required placeholder="Telefone / WhatsApp" value={lead.phone} onChange={e => setLead({ ...lead, phone: e.target.value })} />
            <input placeholder="E-mail (opcional)" value={lead.email} onChange={e => setLead({ ...lead, email: e.target.value })} />
            <select value={lead.development_id} onChange={e => setLead({ ...lead, development_id: e.target.value })}>
              <option value="">Tenho interesse em…</option>
              {developments.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
            </select>
            <textarea placeholder="Mensagem (opcional)" rows={3} value={lead.message} onChange={e => setLead({ ...lead, message: e.target.value })} />
            <button className="btn btn--primary" type="submit">Enviar meu interesse</button>
          </form>
        )}
      </section>

      <footer className="footer">
        <div className="footer__inner">
          <div>
            <span className="nav__name footer__brand">Autoridade<em>Digital</em></span>
            <p>{broker?.name || 'Corretor de Imóveis'}{broker?.instagram ? ` · ${broker.instagram}` : ''}</p>
          </div>
          <div className="footer__links">
            <a href="#empreendimentos">Empreendimentos</a>
            <a href="#sobre">Sobre</a>
            <a href="#contato">Contato</a>
          </div>
          <div className="footer__contact">
            <Link to="/login" className="staff-link">Área restrita</Link>
          </div>
        </div>
        <div className="footer__bottom">© {new Date().getFullYear()} Autoridade Digital · Todos os direitos reservados.</div>
      </footer>

      {wa && (
        <a href={waLink('Olá! Vim pelo site.')} target="_blank" rel="noreferrer" className="wa-float" aria-label="Falar no WhatsApp">
          {WA_ICON}
        </a>
      )}
    </div>
  )
}