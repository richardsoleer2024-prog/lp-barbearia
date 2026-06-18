import { CSSProperties } from 'react'
import { IMG_FOTO5 } from '../assets/images'

const s: Record<string, CSSProperties> = {
  hero: {
    minHeight: '100svh', paddingTop: 56,
    position: 'relative', display: 'flex',
    flexDirection: 'column', justifyContent: 'flex-end', overflow: 'hidden',
  },
  img: {
    position: 'absolute', inset: 0, width: '100%', height: '100%',
    objectFit: 'cover', objectPosition: 'center top',
    filter: 'brightness(0.85)',
  },
  overlay: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(180deg,rgba(10,10,10,0.2) 0%,rgba(10,10,10,0.82) 60%,#0a0a0a 100%)',
  },
  content: { position: 'relative', zIndex: 2, padding: '32px 20px 48px' },
  eyebrow: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase' as const,
    color: 'var(--gold)', marginBottom: 14,
  },
  eyebrowLine: { display: 'block', width: 18, height: 1, background: 'var(--gold)' },
  title: {
    fontFamily: 'var(--font-serif)', fontSize: 38, lineHeight: 1.08,
    fontWeight: 700, color: 'var(--text)', marginBottom: 14,
  },
  em: { fontStyle: 'italic', color: 'var(--gold)' },
  sub: { fontSize: 14, color: 'var(--text2)', lineHeight: 1.65, marginBottom: 28, maxWidth: 320 },
  btns: { display: 'flex', gap: 10, flexWrap: 'wrap' as const },
  btnPrimary: {
    padding: '14px 28px', background: 'var(--gold)', color: '#1a1000',
    border: 'none', borderRadius: 'var(--r-sm)', fontSize: 15, fontWeight: 700,
  },
  btnSecondary: {
    padding: '14px 24px', background: 'rgba(255,255,255,0.07)',
    border: '0.5px solid var(--border2)', color: 'var(--text2)',
    borderRadius: 'var(--r-sm)', fontSize: 15,
  },
  stats: {
    display: 'flex', marginTop: 32,
    border: '0.5px solid var(--border)', borderRadius: 'var(--r)', overflow: 'hidden',
  },
  stat: { flex: 1, padding: '14px 10px', textAlign: 'center' as const, borderRight: '0.5px solid var(--border)' },
  statLast: { flex: 1, padding: '14px 10px', textAlign: 'center' as const },
  statNum: { fontFamily: 'var(--font-serif)', fontSize: 22, color: 'var(--gold)', fontWeight: 700 },
  statLabel: { fontSize: 10, color: 'var(--text3)', marginTop: 2 },
}

interface Props {
  onAgendar: () => void
  onPortfolio: () => void
}

export default function Hero({ onAgendar, onPortfolio }: Props) {
  return (
    <section id="hero" style={s.hero}>
      <img src={IMG_FOTO5} style={s.img} alt="LP Barbearia" />
      <div style={s.overlay} />
      <div style={s.content}>
        <div style={s.eyebrow}>
          <span style={s.eyebrowLine} />
          LP Barbearia · Florianópolis, SC
        </div>
        <h1 style={s.title}>
          Estilo e precisão<br />
          em cada <em style={s.em}>corte</em>
        </h1>
        <p style={s.sub}>
          Agendamento online fácil. Escolha seu serviço e horário em segundos, sem precisar ligar.
        </p>
        <div style={s.btns}>
          <button style={s.btnPrimary} onClick={onAgendar}>Agendar agora</button>
          <button style={s.btnSecondary} onClick={onPortfolio}>Ver trabalhos</button>
        </div>
        <div style={s.stats}>
          <div style={s.stat}>
            <div style={s.statNum}>500+</div>
            <div style={s.statLabel}>Clientes</div>
          </div>
          <div style={s.stat}>
            <div style={s.statNum}>8</div>
            <div style={s.statLabel}>Anos de exp.</div>
          </div>
          <div style={s.statLast}>
            <div style={s.statNum}>4.9★</div>
            <div style={s.statLabel}>Avaliação</div>
          </div>
        </div>
      </div>
    </section>
  )
}
