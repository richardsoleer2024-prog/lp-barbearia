import { useState, useEffect } from 'react'
import { IMG_LOGO } from '../assets/images'
import { AuthAPI, AgendamentosAPI, Agendamento } from '../hooks/useApi'
import { MESES, MESES_ABR, CONFIG } from '../config'

interface Props {
  onVoltar: () => void
}

export default function Painel({ onVoltar }: Props) {
  const [logado, setLogado] = useState(false)
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])

  const hoje = new Date()
  const hojeStr = `${hoje.getFullYear()}-${String(hoje.getMonth()+1).padStart(2,'0')}-${String(hoje.getDate()).padStart(2,'0')}`

  async function login() {
    setLoading(true); setErro('')
    try {
      await AuthAPI.login(senha)
      setLogado(true)
      carregarAgendamentos()
    } catch {
      setErro('Senha incorreta. Tente novamente.')
      setSenha('')
    } finally { setLoading(false) }
  }

  async function carregarAgendamentos() {
    try {
      const data = await AgendamentosAPI.listar(hojeStr)
      setAgendamentos(data.sort((a,b) => a.hora.localeCompare(b.hora)))
    } catch { setAgendamentos([]) }
  }

  async function confirmar(id: number) {
    await AgendamentosAPI.confirmar(id)
    carregarAgendamentos()
  }

  async function cancelar(id: number) {
    if (!confirm('Cancelar este agendamento?')) return
    await AgendamentosAPI.cancelar(id)
    carregarAgendamentos()
  }

  // Stats
  const fat = agendamentos.reduce((s,a) => s + a.preco, 0)
  const agora = new Date()
  const livres = CONFIG.HORARIOS.filter(h => {
    const [hh,mm] = h.split(':').map(Number)
    return !agendamentos.map(a=>a.hora).includes(h)
      && (hh > agora.getHours() || (hh === agora.getHours() && mm > agora.getMinutes()))
  })

  const navStyle = {
    position: 'fixed' as const, top: 0, left: 0, right: 0, zIndex: 200,
    height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 16px', background: 'rgba(10,10,10,0.97)',
    borderBottom: '0.5px solid var(--border)',
  }

  return (
    <div style={{ minHeight: '100svh', background: 'var(--bg)', paddingTop: 56 }}>
      {/* Navbar */}
      <nav style={navStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src={IMG_LOGO} style={{ width: 34, height: 34, objectFit: 'contain', background: '#fff', borderRadius: 6, padding: 2 }} alt="LP" />
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: 15, color: 'var(--text)' }}>LP — Painel</span>
        </div>
        <button onClick={onVoltar} style={{
          padding: '7px 14px', background: 'none',
          border: '0.5px solid var(--border2)', color: 'var(--text2)',
          borderRadius: 'var(--r-sm)', fontSize: 13,
        }}>← Site</button>
      </nav>

      {/* Login */}
      {!logado && (
        <div style={{ minHeight: 'calc(100svh - 56px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '32px 24px', width: '100%', maxWidth: 360 }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, color: 'var(--text)', marginBottom: 6 }}>Área restrita</div>
            <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 24 }}>Entre com a senha para acessar o painel.</div>

            {erro && (
              <div style={{ background: 'var(--red-bg)', border: '0.5px solid var(--red-border)', borderRadius: 'var(--r-sm)', padding: '10px 14px', fontSize: 13, color: 'var(--red)', marginBottom: 14 }}>
                {erro}
              </div>
            )}

            <label style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, display: 'block' }}>Senha</label>
            <input
              type="password"
              value={senha}
              placeholder="••••••••"
              onChange={e => setSenha(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && login()}
              style={{ width: '100%', background: 'var(--bg)', border: '0.5px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '13px 14px', color: 'var(--text)', fontSize: 16, marginBottom: 16 }}
            />
            <button onClick={login} disabled={loading} style={{
              width: '100%', padding: 16, background: 'var(--gold)', color: '#1a1000',
              border: 'none', borderRadius: 'var(--r-sm)', fontSize: 16, fontWeight: 700,
            }}>
              {loading ? 'Verificando...' : 'Entrar'}
            </button>
            <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 14, textAlign: 'center' }}>
              Senha padrão: <strong style={{ color: 'var(--gold)' }}>1234</strong>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard */}
      {logado && (
        <div style={{ padding: '20px 16px 60px' }}>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 }}>
            {[
              { label: 'Hoje', val: String(agendamentos.length), sub: 'agendamentos', gold: false },
              { label: 'Faturamento', val: `R$ ${fat}`, sub: 'estimado hoje', gold: true },
              { label: 'Próx. livre', val: livres[0] || '—', sub: 'hoje', gold: true },
              { label: 'Total agenda', val: String(agendamentos.length), sub: 'agendamentos', gold: false },
            ].map(st => (
              <div key={st.label} style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 'var(--r)', padding: 16 }}>
                <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{st.label}</div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 26, fontWeight: 700, color: st.gold ? 'var(--gold)' : 'var(--text)' }}>{st.val}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 3 }}>{st.sub}</div>
              </div>
            ))}
          </div>

          {/* Lista */}
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 20, color: 'var(--text)', marginBottom: 16 }}>
            Agenda de hoje — {hoje.getDate()} de {MESES[hoje.getMonth()]}
          </div>

          {agendamentos.length === 0 ? (
            <div style={{ color: 'var(--text3)', fontSize: 14, padding: '20px 0', textAlign: 'center' }}>
              Sem agendamentos hoje ainda. Os feitos pelo site aparecem aqui!
            </div>
          ) : (
            agendamentos.map(ag => (
              <div key={ag.id} style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 'var(--r)', padding: 14, marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <div style={{ background: 'var(--bg3)', border: '0.5px solid var(--border2)', borderRadius: 8, padding: '8px 12px', textAlign: 'center', flexShrink: 0 }}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: 'var(--gold)', fontWeight: 700 }}>{ag.hora}</div>
                    <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 1 }}>
                      {CONFIG.SERVICOS.find(s => s.nome === ag.servico)?.min ?? ''}min
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{ag.nome}</div>
                    <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>{ag.servico} · R$ {ag.preco}</div>
                    <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>💬 {ag.wpp}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{
                    fontSize: 11, padding: '4px 10px', borderRadius: 20, fontWeight: 500,
                    background: ag.status === 'confirmado' ? 'var(--green-bg)' : '#1a1a2e',
                    color: ag.status === 'confirmado' ? 'var(--green)' : '#6a9abb',
                    border: `0.5px solid ${ag.status === 'confirmado' ? 'var(--green-border)' : '#2a3d4a'}`,
                  }}>
                    {ag.status === 'confirmado' ? 'Confirmado' : 'Pendente'}
                  </span>
                  {ag.status !== 'confirmado' && (
                    <button onClick={() => confirmar(ag.id)} style={{
                      fontSize: 12, padding: '6px 14px', borderRadius: 'var(--r-sm)',
                      background: 'var(--green-bg)', color: 'var(--green)',
                      border: '0.5px solid var(--green-border)',
                    }}>✓ Confirmar</button>
                  )}
                  <button onClick={() => cancelar(ag.id)} style={{
                    fontSize: 12, padding: '6px 14px', borderRadius: 'var(--r-sm)',
                    background: 'var(--red-bg)', color: 'var(--red)',
                    border: '0.5px solid var(--red-border)',
                  }}>✕ Cancelar</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
