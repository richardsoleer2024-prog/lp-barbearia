import { CSSProperties } from 'react'
import { CONFIG } from '../config'

interface Props {
  selecionado: number | null
  onSelecionar: (id: number) => void
}

export default function Servicos({ selecionado, onSelecionar }: Props) {
  return (
    <section id="servicos" style={{ padding: '56px 20px', background: 'var(--bg2)', borderTop: '0.5px solid var(--border)', borderBottom: '0.5px solid var(--border)' }}>
      <span style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 10, display: 'block' }}>
        O que oferecemos
      </span>
      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
        Nossos <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>serviços</em>
      </h2>
      <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 28 }}>
        Toque no serviço para já ir ao agendamento.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {CONFIG.SERVICOS.map(sv => {
          const ativo = selecionado === sv.id
          const card: CSSProperties = {
            background: ativo ? '#1c1a0f' : 'var(--bg3)',
            border: `0.5px solid ${ativo ? 'var(--gold)' : 'var(--border)'}`,
            borderRadius: 'var(--r)', padding: 18,
            display: 'flex', alignItems: 'center', gap: 16,
            cursor: 'pointer', position: 'relative', overflow: 'hidden',
            transition: 'border-color 0.15s, background 0.15s',
          }
          return (
            <div key={sv.id} style={card} onClick={() => onSelecionar(sv.id)}>
              {ativo && (
                <div style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
                  background: 'var(--gold)',
                }} />
              )}
              {ativo && (
                <div style={{
                  position: 'absolute', top: 12, right: 12,
                  width: 20, height: 20, background: 'var(--gold)',
                  borderRadius: '50%', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 11, color: '#1a1000', fontWeight: 700,
                }}>✓</div>
              )}
              <div style={{ fontSize: 28, flexShrink: 0, width: 44, textAlign: 'center' }}>{sv.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 3 }}>{sv.nome}</div>
                <div style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.4 }}>{sv.desc}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 20, color: 'var(--gold)', fontWeight: 700 }}>R$ {sv.preco}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>⏱ {sv.min} min</div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
