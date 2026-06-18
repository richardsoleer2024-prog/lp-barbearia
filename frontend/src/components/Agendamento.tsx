import { useState, useEffect } from 'react'
import { CONFIG, MESES, MESES_ABR, DIAS_SEMANA } from '../config'
import { AgendamentosAPI } from '../hooks/useApi'

interface Props {
  servicoInicial?: number
}

type Step = 1 | 2 | 3 | 4

interface Estado {
  servicoId: number | null
  data: string | null     // YYYY-MM-DD
  hora: string
  mes: number
  ano: number
}

const pill = (text: string) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: 'var(--gold-dim)', border: '0.5px solid var(--gold)',
    borderRadius: 20, padding: '5px 12px',
    fontSize: 13, color: 'var(--gold)', marginBottom: 20,
  }}>{text}</div>
)

const stepTitle = (t: string, sub: string) => (
  <>
    <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{t}</div>
    <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 20 }}>{sub}</div>
  </>
)

const btnBack = (onClick: () => void) => (
  <button onClick={onClick} style={{
    width: '100%', marginTop: 12, padding: 14,
    background: 'var(--bg3)', border: '0.5px solid var(--border2)',
    color: 'var(--text2)', borderRadius: 'var(--r-sm)', fontSize: 15, fontWeight: 500,
  }}>← Voltar</button>
)

export default function Agendamento({ servicoInicial }: Props) {
  const [step, setStep] = useState<Step>(1)
  const [estado, setEstado] = useState<Estado>({
    servicoId: servicoInicial ?? null,
    data: null, hora: '',
    mes: new Date().getMonth(),
    ano: new Date().getFullYear(),
  })
  const [ocupados, setOcupados] = useState<string[]>([])
  const [nome, setNome] = useState('')
  const [wpp, setWpp] = useState('')
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState(false)
  const [modalMsg, setModalMsg] = useState('')

  const servico = CONFIG.SERVICOS.find(s => s.id === estado.servicoId)

  // Buscar horários ocupados ao trocar data
  useEffect(() => {
    if (!estado.data) return
    AgendamentosAPI.ocupados(estado.data)
      .then(r => setOcupados(r.ocupados))
      .catch(() => setOcupados([]))
  }, [estado.data])

  // Sync servicoInicial
  useEffect(() => {
    if (servicoInicial) {
      setEstado(e => ({ ...e, servicoId: servicoInicial }))
      setStep(2)
    }
  }, [servicoInicial])

  function irStep(n: Step) {
    setStep(n)
    setTimeout(() => {
      document.getElementById('agendar')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  // ─── Progresso ───
  const Progress = () => (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28 }}>
      {[1,2,3,4].map(n => {
        const done = n < step, active = n === step
        return (
          <div key={n} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            {n < 4 && <div style={{
              position: 'absolute', top: 14, left: '50%', right: '-50%',
              height: 1, background: done ? 'var(--gold)' : 'var(--border2)', zIndex: 0,
              transition: 'background 0.3s',
            }} />}
            <div style={{
              width: 28, height: 28, borderRadius: '50%', zIndex: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 600,
              background: done ? 'var(--gold)' : active ? 'var(--gold-dim)' : 'var(--bg3)',
              border: `1px solid ${done || active ? 'var(--gold)' : 'var(--border2)'}`,
              color: done ? '#1a1000' : active ? 'var(--gold)' : 'var(--text3)',
              transition: 'all 0.2s',
            }}>{done ? '✓' : n}</div>
            <div style={{ fontSize: 10, color: active ? 'var(--gold)' : done ? 'var(--text2)' : 'var(--text3)', marginTop: 5 }}>
              {['Serviço','Data','Horário','Confirmar'][n-1]}
            </div>
          </div>
        )
      })}
    </div>
  )

  // ─── Calendário ───
  const Calendario = () => {
    const hoje = new Date()
    const { mes, ano } = estado
    const primeiro = new Date(ano, mes, 1).getDay()
    const total = new Date(ano, mes + 1, 0).getDate()
    const dias: (number | null)[] = [...Array(primeiro).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)]

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>
            {MESES[mes]} {ano}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['←','→'].map((seta, i) => (
              <button key={i} onClick={() => {
                let nm = mes + (i === 0 ? -1 : 1), na = ano
                if (nm > 11) { nm = 0; na++ }
                if (nm < 0) { nm = 11; na-- }
                setEstado(e => ({ ...e, mes: nm, ano: na }))
              }} style={{
                width: 36, height: 36, background: 'var(--bg3)',
                border: '0.5px solid var(--border)', borderRadius: 'var(--r-sm)',
                color: 'var(--text2)', fontSize: 16,
              }}>{seta}</button>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', marginBottom: 6 }}>
          {DIAS_SEMANA.map(d => (
            <div key={d} style={{ fontSize: 11, color: 'var(--text3)', textAlign: 'center', padding: '5px 0' }}>{d[0]}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3 }}>
          {dias.map((d, i) => {
            if (!d) return <div key={i} />
            const dObj = new Date(ano, mes, d)
            const dataStr = `${ano}-${String(mes+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
            const passado = dObj < new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())
            const isSegunda = dObj.getDay() === CONFIG.DIA_FOLGA
            const isHoje = d === hoje.getDate() && mes === hoje.getMonth() && ano === hoje.getFullYear()
            const isSel = estado.data === dataStr
            const disabled = isSegunda || (passado && !isHoje)

            let bg = 'transparent', color = 'var(--text2)', border = 'none'
            if (isHoje) { bg = 'var(--gold)'; color = '#1a1000' }
            if (isSel && !isHoje) { bg = 'var(--gold-dim)'; border = '1.5px solid var(--gold)'; color = 'var(--gold)' }

            return (
              <div key={i} onClick={() => {
                if (disabled) return
                setEstado(e => ({ ...e, data: dataStr, hora: '' }))
                setTimeout(() => irStep(3), 150)
              }} style={{
                aspectRatio: '1', borderRadius: 'var(--r-sm)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.25 : 1,
                background: bg, color, border,
                position: 'relative', transition: 'background 0.1s',
              }}>{d}</div>
            )
          })}
        </div>
      </div>
    )
  }

  // ─── Horários ───
  const Horarios = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginTop: 12 }}>
      {CONFIG.HORARIOS.map(h => {
        const ocup = ocupados.includes(h)
        const sel = estado.hora === h
        return (
          <button key={h} disabled={ocup} onClick={() => {
            setEstado(e => ({ ...e, hora: h }))
            setTimeout(() => irStep(4), 200)
          }} style={{
            padding: '12px 4px', textAlign: 'center',
            background: sel ? 'var(--gold-dim)' : 'var(--bg3)',
            border: `0.5px solid ${sel ? 'var(--gold)' : 'var(--border)'}`,
            borderRadius: 'var(--r-sm)', fontSize: 14,
            color: sel ? 'var(--gold)' : ocup ? 'var(--text3)' : 'var(--text2)',
            fontWeight: sel ? 600 : 400,
            textDecoration: ocup ? 'line-through' : 'none',
            opacity: ocup ? 0.3 : 1,
            cursor: ocup ? 'not-allowed' : 'pointer',
          }}>{h}</button>
        )
      })}
    </div>
  )

  // ─── Resumo ───
  const Resumo = () => {
    const [a,m,d] = estado.data ? estado.data.split('-') : ['','','']
    const dataFmt = estado.data ? `${parseInt(d)} de ${MESES_ABR[+m-1]}` : '—'
    return (
      <div style={{ background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: 'var(--r)', overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ padding: '14px 16px', borderBottom: '0.5px solid var(--border)', fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
          📋 Resumo
        </div>
        {[
          ['Serviço', servico?.nome ?? '—'],
          ['Data', dataFmt],
          ['Horário', estado.hora || '—'],
          ['Total', servico ? `R$ ${servico.preco}` : '—'],
        ].map(([k, v], i, arr) => (
          <div key={k} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 16px',
            borderBottom: i < arr.length - 1 ? '0.5px solid var(--border)' : 'none',
            fontSize: 14,
          }}>
            <span style={{ color: 'var(--text3)' }}>{k}</span>
            <span style={{
              color: k === 'Total' ? 'var(--gold)' : 'var(--text)',
              fontFamily: k === 'Total' ? 'var(--font-serif)' : 'inherit',
              fontSize: k === 'Total' ? 18 : 14,
              fontWeight: 500,
            }}>{v}</span>
          </div>
        ))}
      </div>
    )
  }

  // ─── Confirmar ───
  async function confirmar() {
    if (!servico || !estado.data || !estado.hora || !nome || !wpp) return
    setLoading(true)
    try {
      await AgendamentosAPI.criar({
        nome, wpp, servico: servico.nome,
        preco: servico.preco, data: estado.data, hora: estado.hora,
      })
      const [a,m,d] = estado.data.split('-')
      const dataFmt = `${parseInt(d)} de ${MESES[+m-1]}`
      setModalMsg(`${nome}, seu horário das ${estado.hora} do dia ${dataFmt} para ${servico.nome} está confirmado!`)
      setModal(true)

      // Abrir WhatsApp
      const msg = encodeURIComponent(
        `✂️ *Novo agendamento - LP Barbearia!*\n\n` +
        `👤 *Cliente:* ${nome}\n📱 *WhatsApp:* ${wpp}\n` +
        `💈 *Serviço:* ${servico.nome}\n📅 *Data:* ${dataFmt}\n` +
        `⏰ *Horário:* ${estado.hora}\n💰 *Valor:* R$ ${servico.preco}`
      )
      setTimeout(() => window.open(`https://wa.me/${CONFIG.WPP_BARBEIRO}?text=${msg}`, '_blank'), 500)

      setEstado(e => ({ ...e, data: null, hora: '', servicoId: null }))
      setNome(''); setWpp('')
      irStep(1)
    } catch (err: any) {
      alert(err?.response?.data?.message ?? 'Erro ao agendar. Tente outro horário.')
    } finally {
      setLoading(false)
    }
  }

  const canConfirm = servico && estado.data && estado.hora && nome.trim() && wpp.trim()

  return (
    <section id="agendar" style={{ padding: '56px 20px', background: 'var(--bg2)', borderTop: '0.5px solid var(--border)' }}>
      <span style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 10, display: 'block' }}>
        Marque seu horário
      </span>
      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
        Agende <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>online</em>
      </h2>
      <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 28 }}>
        Rápido e sem ligação. Confirmação direto no WhatsApp.
      </p>

      <Progress />

      {/* Step 1 */}
      {step === 1 && (
        <div>
          {stepTitle('Qual serviço?', 'Toque para selecionar')}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {CONFIG.SERVICOS.map(sv => {
              const ativo = estado.servicoId === sv.id
              return (
                <div key={sv.id} onClick={() => {
                  setEstado(e => ({ ...e, servicoId: sv.id }))
                  setTimeout(() => irStep(2), 200)
                }} style={{
                  background: ativo ? '#1c1a0f' : 'var(--bg3)',
                  border: `0.5px solid ${ativo ? 'var(--gold)' : 'var(--border)'}`,
                  borderRadius: 'var(--r)', padding: 18,
                  display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer',
                  position: 'relative', overflow: 'hidden',
                }}>
                  {ativo && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: 'var(--gold)' }} />}
                  <div style={{ fontSize: 28, width: 44, textAlign: 'center' }}>{sv.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{sv.nome}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: 20, color: 'var(--gold)', fontWeight: 700 }}>R$ {sv.preco}</div>
                    <div style={{ fontSize: 11, color: 'var(--text3)' }}>{sv.min} min</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div>
          {stepTitle('Qual dia?', 'Segunda é folga do Luiz Paulo')}
          {servico && pill(`✂️ ${servico.nome} · R$ ${servico.preco}`)}
          <Calendario />
          {btnBack(() => irStep(1))}
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div>
          {stepTitle('Qual horário?', estado.data ? (() => {
            const [a,m,d] = estado.data!.split('-')
            return `${DIAS_SEMANA[new Date(+a,+m-1,+d).getDay()]}, ${parseInt(d)} de ${MESES[+m-1]}`
          })() : '')}
          {estado.data && pill(`📅 ${(() => { const [a,m,d] = estado.data!.split('-'); return `${parseInt(d)} de ${MESES_ABR[+m-1]}` })()} `)}
          <Horarios />
          {btnBack(() => irStep(2))}
        </div>
      )}

      {/* Step 4 */}
      {step === 4 && (
        <div>
          {stepTitle('Seus dados', 'Confirme o agendamento')}
          <Resumo />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
            {[
              { label: 'Seu nome', value: nome, set: setNome, type: 'text', placeholder: 'Ex: João Silva' },
              { label: 'WhatsApp', value: wpp, set: setWpp, type: 'tel', placeholder: '48 99999-0000' },
            ].map(f => (
              <div key={f.label}>
                <label style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, display: 'block' }}>
                  {f.label}
                </label>
                <input
                  type={f.type}
                  value={f.value}
                  placeholder={f.placeholder}
                  onChange={e => f.set(e.target.value)}
                  style={{
                    width: '100%', background: 'var(--bg2)',
                    border: '0.5px solid var(--border)', borderRadius: 'var(--r-sm)',
                    padding: '13px 14px', color: 'var(--text)', fontSize: 16,
                  }}
                />
              </div>
            ))}
          </div>

          <button onClick={confirmar} disabled={!canConfirm || loading} style={{
            width: '100%', padding: 16, background: canConfirm ? 'var(--gold)' : 'var(--bg4)',
            color: canConfirm ? '#1a1000' : 'var(--text3)',
            border: 'none', borderRadius: 'var(--r-sm)',
            fontSize: 16, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            cursor: canConfirm ? 'pointer' : 'not-allowed',
          }}>
            {loading ? 'Aguarde...' : '✅ Confirmar agendamento'}
          </button>

          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 10,
            background: 'var(--green-bg)', border: '0.5px solid var(--green-border)',
            borderRadius: 'var(--r-sm)', padding: 12, marginTop: 14,
          }}>
            <span style={{ fontSize: 18 }}>💬</span>
            <div style={{ fontSize: 12, color: 'var(--green)', lineHeight: 1.5 }}>
              Ao confirmar, o Luiz Paulo recebe uma mensagem no WhatsApp com todos os seus dados.
            </div>
          </div>

          {btnBack(() => irStep(3))}
        </div>
      )}

      {/* Modal sucesso */}
      {modal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 300,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        }}>
          <div style={{
            background: 'var(--bg2)', border: '0.5px solid var(--border2)',
            borderRadius: '16px 16px 0 0', padding: '32px 24px 48px',
            width: '100%', textAlign: 'center',
          }}>
            <div style={{
              width: 64, height: 64, background: 'var(--green-bg)',
              border: '1px solid var(--green-border)', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, margin: '0 auto 18px',
            }}>✅</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 24, color: 'var(--text)', marginBottom: 10 }}>Agendado!</div>
            <div style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.65, marginBottom: 28 }}>{modalMsg}</div>
            <button onClick={() => setModal(false)} style={{
              width: '100%', padding: 15, background: 'var(--gold)',
              color: '#1a1000', border: 'none', borderRadius: 'var(--r-sm)',
              fontSize: 16, fontWeight: 700,
            }}>Fechar</button>
            <div style={{ fontSize: 13, color: 'var(--green)', marginTop: 12 }}>
              💬 Luiz Paulo foi avisado no WhatsApp
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
