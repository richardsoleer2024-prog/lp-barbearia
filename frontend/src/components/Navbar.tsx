import { CSSProperties } from 'react'
import { IMG_LOGO } from '../assets/images'

const s: Record<string, CSSProperties> = {
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
    height: 56, display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', padding: '0 16px',
    background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(12px)',
    borderBottom: '0.5px solid var(--border)',
  },
  logo: { display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' },
  logoImg: { width: 34, height: 34, objectFit: 'contain' as const, background: '#fff', borderRadius: 6, padding: 2 },
  logoName: { fontFamily: 'var(--font-serif)', fontSize: 16, color: 'var(--text)' },
  right: { display: 'flex', gap: 8, alignItems: 'center' },
  btnGold: {
    padding: '7px 14px', background: 'var(--gold)', color: '#1a1000',
    border: 'none', borderRadius: 'var(--r-sm)', fontSize: 13, fontWeight: 700,
  },
  btnOutline: {
    padding: '7px 12px', background: 'none',
    border: '0.5px solid var(--border2)', color: 'var(--text2)',
    borderRadius: 'var(--r-sm)', fontSize: 14,
  },
}

interface Props {
  onAgendar: () => void
  onAbrirPainel: () => void
}

export default function Navbar({ onAgendar, onAbrirPainel }: Props) {
  return (
    <nav style={s.nav}>
      <a href="#hero" style={s.logo}>
        <img src={IMG_LOGO} style={s.logoImg} alt="LP" />
        <span style={s.logoName}>LP Barbearia</span>
      </a>
      <div style={s.right}>
        <button style={s.btnGold} onClick={onAgendar}>Agendar</button>
        <button style={s.btnOutline} onClick={onAbrirPainel}>🔒</button>
      </div>
    </nav>
  )
}
