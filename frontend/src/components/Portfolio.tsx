import { useRef, useEffect, useState } from 'react'
import { IMG_FOTO1, IMG_FOTO2, IMG_FOTO3, IMG_FOTO4, IMG_FOTO5 } from '../assets/images'

const fotos = [
  { src: IMG_FOTO4, label: 'Cabelo + barba' },
  { src: IMG_FOTO2, label: 'Degradê com risca' },
  { src: IMG_FOTO3, label: 'Corte com desenho' },
  { src: IMG_FOTO1, label: 'Corte clássico' },
  { src: IMG_FOTO5, label: 'Acabamento impecável' },
]

export default function Portfolio() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [ativo, setAtivo] = useState(0)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const handler = () => {
      const idx = Math.round(el.scrollLeft / (el.offsetWidth * 0.72))
      setAtivo(idx)
    }
    el.addEventListener('scroll', handler, { passive: true })
    return () => el.removeEventListener('scroll', handler)
  }, [])

  return (
    <section id="portfolio" style={{ padding: '56px 20px', background: 'var(--bg)' }}>
      <span style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 10, display: 'block' }}>
        Trabalhos recentes
      </span>
      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
        O resultado <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>fala</em>
      </h2>
      <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 24 }}>
        Trabalhos do Luiz Paulo. Cada corte com precisão e dedicação.
      </p>

      <div ref={scrollRef} style={{
        display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8,
        scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
      }}>
        {fotos.map((f, i) => (
          <div key={i} style={{
            flexShrink: 0, width: i === 0 ? '80vw' : '72vw',
            maxWidth: i === 0 ? 320 : 280,
            aspectRatio: '3/4', borderRadius: 'var(--r)',
            overflow: 'hidden', position: 'relative',
            scrollSnapAlign: 'start',
          }}>
            <img src={f.src} style={{
              width: '100%', height: '100%', objectFit: 'cover',
              objectPosition: 'center top', display: 'block',
            }} alt={f.label} />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top,rgba(0,0,0,0.65) 0%,transparent 50%)',
            }} />
            <div style={{
              position: 'absolute', bottom: 14, left: 14,
              fontSize: 13, fontWeight: 500, color: 'var(--text)',
            }}>{f.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 14 }}>
        {fotos.map((_, i) => (
          <div key={i} style={{
            height: 6, borderRadius: 3,
            background: i === ativo ? 'var(--gold)' : 'var(--border2)',
            width: i === ativo ? 18 : 6,
            transition: 'width 0.2s, background 0.2s',
          }} />
        ))}
      </div>
    </section>
  )
}
