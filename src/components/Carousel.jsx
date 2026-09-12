import { useEffect, useState } from 'react'
import { api } from '../api.js'

function Carousel({ media }) {
  const [idx, setIdx] = useState(0)
  const n = media.length
  if (!n) return <div className="card-ph" role="img" aria-label="Empreendimento">Sem fotos ainda</div>

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % n), 5000)
    return () => clearInterval(t)
  }, [n])

  return (
    <div className="carousel">
      {media.map((m, i) => (
        <div key={i} className="carousel-slide" style={{ transform: `translateX(${(i - idx) * 100}%)` }}>
          {m.type === 'video'
            ? <video src={m.url} autoPlay muted loop playsInline />
            : <img src={m.url} alt="" loading="lazy" />}
        </div>
      ))}
      {n > 1 && (
        <div className="dots">
          {media.map((_, i) => (
            <button key={i} aria-label={`Foto ${i + 1}`} className={i === idx ? 'dot on' : 'dot'} onClick={() => setIdx(i)} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Carousel